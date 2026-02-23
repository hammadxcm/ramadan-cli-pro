import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CacheCommand } from "../../../commands/cache.command.js";
import { CommandError } from "../../../errors/command.error.js";
import type { CacheService } from "../../../services/cache.service.js";
import type { LocationService } from "../../../services/location.service.js";
import type { PrayerTimeService } from "../../../services/prayer-time.service.js";

describe("CacheCommand", () => {
	let command: CacheCommand;
	let mockCacheService: {
		clear: ReturnType<typeof vi.fn>;
		get: ReturnType<typeof vi.fn>;
		set: ReturnType<typeof vi.fn>;
	};
	let mockLocationService: { resolveQuery: ReturnType<typeof vi.fn> };
	let mockPrayerTimeService: { fetchDay: ReturnType<typeof vi.fn> };
	let logSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		mockCacheService = {
			clear: vi.fn(),
			get: vi.fn(),
			set: vi.fn(),
		};

		mockLocationService = {
			resolveQuery: vi.fn().mockResolvedValue({
				address: "San Francisco, US",
				city: "San Francisco",
				country: "US",
				method: 2,
				school: 0,
			}),
		};

		mockPrayerTimeService = {
			fetchDay: vi.fn().mockResolvedValue({
				timings: { Fajr: "05:30 (PKT)", Maghrib: "18:45 (PKT)" },
			}),
		};

		command = new CacheCommand(
			mockCacheService as unknown as CacheService,
			mockLocationService as unknown as LocationService,
			mockPrayerTimeService as unknown as PrayerTimeService,
		);

		logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("can be instantiated", () => {
		expect(command).toBeInstanceOf(CacheCommand);
	});

	it("has an execute method", () => {
		expect(typeof command.execute).toBe("function");
	});

	describe("--clear", () => {
		it("calls cacheService.clear() and prints confirmation", async () => {
			await command.execute({ clear: true });

			expect(mockCacheService.clear).toHaveBeenCalledOnce();
			expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Cache cleared"));
		});

		it("does not call fetchDay when clearing", async () => {
			await command.execute({ clear: true });

			expect(mockPrayerTimeService.fetchDay).not.toHaveBeenCalled();
		});
	});

	describe("--build", () => {
		it("fetches 30 days of prayer times by default", async () => {
			await command.execute({ build: true });

			expect(mockLocationService.resolveQuery).toHaveBeenCalledWith({
				city: undefined,
				allowInteractiveSetup: false,
			});
			expect(mockPrayerTimeService.fetchDay).toHaveBeenCalledTimes(30);
			expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Cached 30 days"));
		});

		it("passes city to resolveQuery when --city is provided", async () => {
			await command.execute({ build: true, city: "Lahore" });

			expect(mockLocationService.resolveQuery).toHaveBeenCalledWith({
				city: "Lahore",
				allowInteractiveSetup: false,
			});
		});

		it("respects custom --days option", async () => {
			await command.execute({ build: true, days: 7 });

			expect(mockPrayerTimeService.fetchDay).toHaveBeenCalledTimes(7);
			expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Cached 7 days"));
		});

		it("calls fetchDay with sequential dates", async () => {
			const now = new Date();
			await command.execute({ build: true, days: 3 });

			expect(mockPrayerTimeService.fetchDay).toHaveBeenCalledTimes(3);

			// Verify each call received a date parameter
			for (let i = 0; i < 3; i++) {
				const call = mockPrayerTimeService.fetchDay.mock.calls[i] as unknown[];
				expect(call).toHaveLength(2);
				// First arg is the query, second is the date
				const dateArg = call[1] as Date;
				expect(dateArg).toBeInstanceOf(Date);
			}
		});

		it("handles fetch failures gracefully and continues", async () => {
			// Fail on days 2 and 4, succeed on others
			mockPrayerTimeService.fetchDay
				.mockResolvedValueOnce({ timings: {} }) // day 1
				.mockRejectedValueOnce(new Error("API error")) // day 2
				.mockResolvedValueOnce({ timings: {} }) // day 3
				.mockRejectedValueOnce(new Error("Network error")) // day 4
				.mockResolvedValueOnce({ timings: {} }); // day 5

			await command.execute({ build: true, days: 5 });

			expect(mockPrayerTimeService.fetchDay).toHaveBeenCalledTimes(5);
			// Only 3 succeeded
			expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Cached 3 days"));
		});

		it("handles all fetch failures gracefully", async () => {
			mockPrayerTimeService.fetchDay.mockRejectedValue(new Error("API down"));

			await command.execute({ build: true, days: 3 });

			expect(mockPrayerTimeService.fetchDay).toHaveBeenCalledTimes(3);
			expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Cached 0 days"));
		});

		it("prints building message with address", async () => {
			await command.execute({ build: true });

			expect(logSpy).toHaveBeenCalledWith(
				expect.stringContaining("Building cache for San Francisco, US"),
			);
		});

		it("throws CommandError when location cannot be resolved", async () => {
			mockLocationService.resolveQuery.mockRejectedValue(new Error("Location not found"));

			await expect(command.execute({ build: true, city: "unknown" })).rejects.toThrow(CommandError);
			await expect(command.execute({ build: true, city: "unknown" })).rejects.toThrow(
				"Could not resolve location",
			);
		});
	});

	describe("default (no flags)", () => {
		it("shows usage hint when no options provided", async () => {
			await command.execute({});

			expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("--build"));
			expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("--clear"));
		});

		it("does not call clear or fetchDay", async () => {
			await command.execute({});

			expect(mockCacheService.clear).not.toHaveBeenCalled();
			expect(mockPrayerTimeService.fetchDay).not.toHaveBeenCalled();
		});
	});
});
