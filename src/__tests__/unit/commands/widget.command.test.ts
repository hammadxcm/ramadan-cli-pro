import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { WidgetCommand } from "../../../commands/widget.command.js";
import { CommandError } from "../../../errors/command.error.js";
import type { HighlightService } from "../../../services/highlight.service.js";
import type { LocationService } from "../../../services/location.service.js";
import type { PrayerTimeService } from "../../../services/prayer-time.service.js";

/**
 * Flush the microtask queue so that chained awaits inside
 * the (never-resolving) execute() method settle.
 */
const flushPromises = () => vi.advanceTimersByTimeAsync(0);

describe("WidgetCommand", () => {
	let command: WidgetCommand;
	let mockLocationService: { resolveQuery: ReturnType<typeof vi.fn> };
	let mockPrayerTimeService: { fetchDay: ReturnType<typeof vi.fn> };
	let mockHighlightService: { getHighlightState: ReturnType<typeof vi.fn> };
	let logSpy: ReturnType<typeof vi.spyOn>;
	let errorSpy: ReturnType<typeof vi.spyOn>;
	let exitSpy: ReturnType<typeof vi.fn>;
	// biome-ignore lint/suspicious/noExplicitAny: mock type
	let stdoutWriteSpy: any;
	let sigintHandlers: Array<() => void>;

	beforeEach(() => {
		vi.useFakeTimers();

		mockLocationService = {
			resolveQuery: vi.fn().mockResolvedValue({ address: "San Francisco" }),
		};

		mockPrayerTimeService = {
			fetchDay: vi.fn().mockResolvedValue({
				timings: { Fajr: "05:30 (PKT)", Maghrib: "18:45 (PKT)" },
			}),
		};

		mockHighlightService = {
			getHighlightState: vi.fn().mockReturnValue({
				current: "Dhuhr",
				next: "Asr",
				countdown: "2h 30m",
			}),
		};

		command = new WidgetCommand(
			mockLocationService as unknown as LocationService,
			mockPrayerTimeService as unknown as PrayerTimeService,
			mockHighlightService as unknown as HighlightService,
		);

		logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
		errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		exitSpy = vi
			.spyOn(process, "exit")
			.mockImplementation((() => {}) as never) as unknown as ReturnType<typeof vi.fn>;
		stdoutWriteSpy = vi.spyOn(process.stdout, "write").mockImplementation(() => true);

		sigintHandlers = [];
		vi.spyOn(process, "once").mockImplementation(((event: string, handler: () => void) => {
			if (event === "SIGINT") sigintHandlers.push(handler);
			return process;
		}) as never);
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	it("can be instantiated", () => {
		expect(command).toBeInstanceOf(WidgetCommand);
	});

	it("has an execute method", () => {
		expect(typeof command.execute).toBe("function");
	});

	it("displays initial output with highlight state", async () => {
		const promise = command.execute({ city: "sf" });
		await flushPromises();

		expect(mockLocationService.resolveQuery).toHaveBeenCalledWith({
			city: "sf",
			allowInteractiveSetup: false,
		});
		expect(mockPrayerTimeService.fetchDay).toHaveBeenCalledWith({ address: "San Francisco" });
		expect(mockHighlightService.getHighlightState).toHaveBeenCalled();

		// Lines 30-37: initial display
		const calls = logSpy.mock.calls.map((c) => c[0]);
		expect(calls[0]).toBe("");
		// Line 31: bold green header
		expect(calls[1]).toContain("Ramadan Widget");
		// Line 32: address, sehar, iftar
		expect(calls[2]).toContain("San Francisco");
		expect(calls[2]).toContain("05:30");
		expect(calls[2]).toContain("18:45");
		// Line 34-36: highlight line
		expect(calls[3]).toContain("Dhuhr");
		expect(calls[3]).toContain("Asr");
		expect(calls[3]).toContain("2h 30m");
		// Line 38: trailing empty line
		expect(calls[4]).toBe("");
	});

	it("displays initial output without highlight when highlight is null", async () => {
		mockHighlightService.getHighlightState.mockReturnValue(null);

		const promise = command.execute({ city: "sf" });
		await flushPromises();

		const calls = logSpy.mock.calls.map((c) => c[0]);
		// Should have: "", header, address line, "" (no highlight line)
		expect(calls).toHaveLength(4);
		expect(calls[0]).toBe("");
		expect(calls[1]).toContain("Ramadan Widget");
		expect(calls[2]).toContain("San Francisco");
		expect(calls[3]).toBe("");
	});

	it("uses fallback times when Fajr is undefined", async () => {
		mockPrayerTimeService.fetchDay.mockResolvedValue({
			timings: { Maghrib: "18:45 (PKT)" },
		});

		const promise = command.execute({ city: "sf" });
		await flushPromises();

		const calls = logSpy.mock.calls.map((c) => c[0]);
		// Line 27: fajr ?? "--:--"
		expect(calls[2]).toContain("--:--");
		expect(calls[2]).toContain("18:45");
	});

	it("uses fallback times when Maghrib is undefined", async () => {
		mockPrayerTimeService.fetchDay.mockResolvedValue({
			timings: { Fajr: "05:30 (PKT)" },
		});

		const promise = command.execute({ city: "sf" });
		await flushPromises();

		const calls = logSpy.mock.calls.map((c) => c[0]);
		// Line 28: maghrib ?? "--:--"
		expect(calls[2]).toContain("05:30");
		expect(calls[2]).toContain("--:--");
	});

	it("uses fallback times when both Fajr and Maghrib are undefined", async () => {
		mockPrayerTimeService.fetchDay.mockResolvedValue({
			timings: {},
		});

		const promise = command.execute({ city: "sf" });
		await flushPromises();

		const addressLine = logSpy.mock.calls[2]?.[0] as string;
		// Both should fall back to "--:--"
		const matches = addressLine.match(/--:--/g);
		expect(matches).toHaveLength(2);
	});

	it("auto-refreshes after 60 seconds with highlight", async () => {
		const promise = command.execute({ city: "sf" });
		await flushPromises();

		// Reset spies so we only capture refresh output
		logSpy.mockClear();
		stdoutWriteSpy.mockClear();

		// Provide fresh data for the refresh
		mockPrayerTimeService.fetchDay.mockResolvedValue({
			timings: { Fajr: "05:31 (PKT)", Maghrib: "18:46 (PKT)" },
		});
		mockHighlightService.getHighlightState.mockReturnValue({
			current: "Asr",
			next: "Maghrib",
			countdown: "1h 15m",
		});

		// Advance past the 60s interval
		await vi.advanceTimersByTimeAsync(60_000);

		// Line 48: clear screen
		expect(stdoutWriteSpy).toHaveBeenCalledWith("\x1B[2J\x1B[H");

		const calls = logSpy.mock.calls.map((c) => c[0]);
		// Lines 49-58: refresh output
		expect(calls[0]).toBe("");
		expect(calls[1]).toContain("Ramadan Widget");
		expect(calls[2]).toContain("San Francisco");
		expect(calls[2]).toContain("05:31");
		expect(calls[2]).toContain("18:46");
		// Line 52-55: highlight present
		expect(calls[3]).toContain("Asr");
		expect(calls[3]).toContain("Maghrib");
		expect(calls[3]).toContain("1h 15m");
		// Line 57: exit instruction
		expect(calls[4]).toContain("Press Ctrl+C to exit");
		expect(calls[5]).toBe("");
	});

	it("auto-refresh uses fallback times when Fajr/Maghrib undefined", async () => {
		const promise = command.execute({ city: "sf" });
		await flushPromises();

		logSpy.mockClear();
		stdoutWriteSpy.mockClear();

		// Return data with missing Fajr and Maghrib for the refresh
		mockPrayerTimeService.fetchDay.mockResolvedValue({
			timings: {},
		});

		await vi.advanceTimersByTimeAsync(60_000);

		const calls = logSpy.mock.calls.map((c) => c[0]);
		// Lines 45-46: fajrTime ?? "--:--" and maghribTime ?? "--:--"
		const addressLine = calls[2] as string;
		const matches = addressLine.match(/--:--/g);
		expect(matches).toHaveLength(2);
	});

	it("auto-refreshes after 60 seconds without highlight", async () => {
		const promise = command.execute({ city: "sf" });
		await flushPromises();

		logSpy.mockClear();
		stdoutWriteSpy.mockClear();

		// Return null highlight on refresh
		mockHighlightService.getHighlightState.mockReturnValue(null);

		await vi.advanceTimersByTimeAsync(60_000);

		expect(stdoutWriteSpy).toHaveBeenCalledWith("\x1B[2J\x1B[H");

		const calls = logSpy.mock.calls.map((c) => c[0]);
		// Without highlight: "", header, address, "Press Ctrl+C...", ""
		expect(calls[0]).toBe("");
		expect(calls[1]).toContain("Ramadan Widget");
		expect(calls[2]).toContain("San Francisco");
		// No highlight line, goes straight to exit instruction
		expect(calls[3]).toContain("Press Ctrl+C to exit");
		expect(calls[4]).toBe("");
	});

	it("handles auto-refresh failure silently", async () => {
		const promise = command.execute({ city: "sf" });
		await flushPromises();

		logSpy.mockClear();
		stdoutWriteSpy.mockClear();
		errorSpy.mockClear();

		// Make fetchDay reject on refresh
		mockPrayerTimeService.fetchDay.mockRejectedValue(new Error("Network error"));

		await vi.advanceTimersByTimeAsync(60_000);

		// Lines 59-61: silent catch — no console output from the refresh
		expect(stdoutWriteSpy).not.toHaveBeenCalled();
		expect(errorSpy).not.toHaveBeenCalled();
		// The log calls from the interval body should not have happened
		expect(logSpy).not.toHaveBeenCalled();
	});

	it("registers a SIGINT handler that clears interval and exits", async () => {
		const promise = command.execute({ city: "sf" });
		await flushPromises();

		// Lines 65-68: SIGINT handler should be registered
		expect(sigintHandlers).toHaveLength(1);

		// Invoke the SIGINT handler
		const handler = sigintHandlers[0];
		expect(handler).toBeDefined();
		handler?.();

		expect(exitSpy).toHaveBeenCalledWith(0);
	});

	it("SIGINT handler prevents further refreshes", async () => {
		const promise = command.execute({ city: "sf" });
		await flushPromises();

		// Invoke the SIGINT handler to clear the interval
		const handler = sigintHandlers[0];
		expect(handler).toBeDefined();
		handler?.();

		logSpy.mockClear();
		stdoutWriteSpy.mockClear();

		// Advance past the interval — should not fire since it was cleared
		await vi.advanceTimersByTimeAsync(60_000);

		expect(stdoutWriteSpy).not.toHaveBeenCalled();
	});

	it("handles error in execute catch block when resolveQuery rejects", async () => {
		mockLocationService.resolveQuery.mockRejectedValue(new Error("Location not found"));

		await expect(command.execute({ city: "unknown" })).rejects.toThrow(CommandError);
		await expect(command.execute({ city: "unknown" })).rejects.toThrow(
			"Widget error: could not fetch prayer times",
		);
	});

	it("handles error in execute catch block when fetchDay rejects", async () => {
		mockPrayerTimeService.fetchDay.mockRejectedValue(new Error("API down"));

		await expect(command.execute({ city: "sf" })).rejects.toThrow(CommandError);
	});

	it("passes undefined city when no city option is provided", async () => {
		const promise = command.execute({});
		await flushPromises();

		expect(mockLocationService.resolveQuery).toHaveBeenCalledWith({
			city: undefined,
			allowInteractiveSetup: false,
		});
	});
});
