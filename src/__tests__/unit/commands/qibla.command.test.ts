import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { QiblaCommand } from "../../../commands/qibla.command.js";
import { CommandError } from "../../../errors/command.error.js";
import type { PrayerApiRepository } from "../../../repositories/prayer-api.repository.js";
import type { LocationService } from "../../../services/location.service.js";

vi.mock("../../../ui/spinner.js", () => ({
	createSpinner: () => ({
		start: vi.fn(),
		stop: vi.fn(),
		fail: vi.fn(),
	}),
}));

vi.mock("../../../formatters/qibla.formatter.js", () => ({
	formatQiblaOutput: vi.fn().mockReturnValue("formatted-qibla-output"),
}));

describe("QiblaCommand", () => {
	let command: QiblaCommand;
	let locationService: { [K in keyof LocationService]: ReturnType<typeof vi.fn> };
	let prayerApiRepository: { [K in keyof PrayerApiRepository]: ReturnType<typeof vi.fn> };
	let logSpy: ReturnType<typeof vi.spyOn>;

	const mockLocation = {
		address: "Lahore, Pakistan",
		city: "Lahore",
		country: "Pakistan",
		latitude: 31.52,
		longitude: 74.36,
		method: 2,
		school: 1,
	};

	const mockQibla = {
		latitude: 31.52,
		longitude: 74.36,
		direction: 252.14,
	};

	beforeEach(() => {
		locationService = {
			resolveQuery: vi.fn().mockResolvedValue(mockLocation),
			normalizeCityAlias: vi.fn().mockImplementation((c: string) => c),
		} as unknown as { [K in keyof LocationService]: ReturnType<typeof vi.fn> };

		prayerApiRepository = {
			fetchQibla: vi.fn().mockResolvedValue(mockQibla),
			fetchTimingsByCity: vi.fn(),
			fetchTimingsByAddress: vi.fn(),
			fetchTimingsByCoords: vi.fn(),
			fetchHijriCalendarByAddress: vi.fn(),
			fetchHijriCalendarByCity: vi.fn(),
			fetchCalendarByCity: vi.fn(),
			fetchMethods: vi.fn(),
		} as unknown as { [K in keyof PrayerApiRepository]: ReturnType<typeof vi.fn> };

		command = new QiblaCommand(
			locationService as unknown as LocationService,
			prayerApiRepository as unknown as PrayerApiRepository,
		);

		logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("calls resolveQuery with the provided options", async () => {
		await command.execute({ city: "Lahore" });

		expect(locationService.resolveQuery).toHaveBeenCalledTimes(1);
		expect(locationService.resolveQuery).toHaveBeenCalledWith({
			city: "Lahore",
			allowInteractiveSetup: false,
		});
	});

	it("calls resolveQuery with undefined city when no city is provided", async () => {
		await command.execute({});

		expect(locationService.resolveQuery).toHaveBeenCalledWith({
			city: undefined,
			allowInteractiveSetup: false,
		});
	});

	it("calls fetchQibla with correct latitude and longitude", async () => {
		await command.execute({ city: "Lahore" });

		expect(prayerApiRepository.fetchQibla).toHaveBeenCalledTimes(1);
		expect(prayerApiRepository.fetchQibla).toHaveBeenCalledWith(31.52, 74.36);
	});

	it("outputs formatted qibla result", async () => {
		const mod = await import("../../../formatters/qibla.formatter.js");
		const formatMock = vi.mocked(mod.formatQiblaOutput);
		formatMock.mockReturnValue("formatted-qibla-output");

		await command.execute({ city: "Lahore" });

		expect(formatMock).toHaveBeenCalledWith({
			direction: 252.14,
			latitude: 31.52,
			longitude: 74.36,
			location: "Lahore, Pakistan",
		});
		expect(logSpy).toHaveBeenCalledWith("formatted-qibla-output");
	});

	it("handles fetchQibla error gracefully", async () => {
		prayerApiRepository.fetchQibla.mockRejectedValue(new Error("Network error"));

		await expect(command.execute({ city: "Lahore" })).rejects.toThrow(CommandError);
		expect(logSpy).not.toHaveBeenCalled();
	});

	it("handles resolveQuery error gracefully", async () => {
		locationService.resolveQuery.mockRejectedValue(new Error("Location not found"));

		await expect(command.execute({ city: "UnknownCity" })).rejects.toThrow(CommandError);
		expect(prayerApiRepository.fetchQibla).not.toHaveBeenCalled();
		expect(logSpy).not.toHaveBeenCalled();
	});

	it("throws error when coordinates are undefined", async () => {
		locationService.resolveQuery.mockResolvedValue({
			address: "Unknown",
			latitude: undefined,
			longitude: undefined,
			method: 2,
			school: 1,
		});

		await expect(command.execute({})).rejects.toThrow(CommandError);
		expect(prayerApiRepository.fetchQibla).not.toHaveBeenCalled();
	});

	it("does not call fetchQibla when only latitude is undefined", async () => {
		locationService.resolveQuery.mockResolvedValue({
			address: "Partial",
			latitude: undefined,
			longitude: 74.36,
			method: 2,
			school: 1,
		});

		await expect(command.execute({})).rejects.toThrow(CommandError);
		expect(prayerApiRepository.fetchQibla).not.toHaveBeenCalled();
	});

	it("does not call fetchQibla when only longitude is undefined", async () => {
		locationService.resolveQuery.mockResolvedValue({
			address: "Partial",
			latitude: 31.52,
			longitude: undefined,
			method: 2,
			school: 1,
		});

		await expect(command.execute({})).rejects.toThrow(CommandError);
		expect(prayerApiRepository.fetchQibla).not.toHaveBeenCalled();
	});

	it("handles non-Error exceptions gracefully", async () => {
		prayerApiRepository.fetchQibla.mockRejectedValue("string error");

		await expect(command.execute({ city: "Lahore" })).rejects.toThrow(CommandError);
	});
});
