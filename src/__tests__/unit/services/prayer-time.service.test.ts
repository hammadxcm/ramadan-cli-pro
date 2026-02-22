import { describe, expect, it, vi } from "vitest";
import { PrayerTimeFetchError, RamadanCalendarError } from "../../../errors/prayer.error.js";
import type { PrayerApiRepository } from "../../../repositories/prayer-api.repository.js";
import type { CacheService } from "../../../services/cache.service.js";
import { PrayerTimeService } from "../../../services/prayer-time.service.js";
import type { PrayerData } from "../../../types/prayer.js";
import type { RamadanQuery } from "../../../types/ramadan.js";
import { samplePrayerData } from "../../helpers/fixtures.js";

const createMockPrayerApiRepository = (): {
	[K in keyof PrayerApiRepository]: ReturnType<typeof vi.fn>;
} => ({
	fetchTimingsByCity: vi.fn(),
	fetchTimingsByAddress: vi.fn(),
	fetchTimingsByCoords: vi.fn(),
	fetchHijriCalendarByCity: vi.fn(),
	fetchHijriCalendarByAddress: vi.fn(),
	fetchCalendarByCity: vi.fn(),
	fetchMethods: vi.fn(),
	fetchQibla: vi.fn(),
});

const createMockCacheService = (): {
	[K in keyof CacheService]: ReturnType<typeof vi.fn>;
} => ({
	get: vi.fn().mockReturnValue(null),
	set: vi.fn(),
	delete: vi.fn().mockReturnValue(false),
	clear: vi.fn(),
	pruneExpired: vi.fn().mockReturnValue(0),
	buildTimingsKey: vi.fn().mockReturnValue("timings:key"),
	buildCalendarKey: vi.fn().mockReturnValue("calendar:key"),
	buildGeoKey: vi.fn().mockReturnValue("geo:key"),
});

const baseQuery: RamadanQuery = {
	address: "Lahore, Pakistan",
	city: "Lahore",
	country: "Pakistan",
	latitude: 31.5204,
	longitude: 74.3587,
	method: 1,
	school: 1,
	timezone: "Asia/Karachi",
};

describe("PrayerTimeService", () => {
	const createService = () => {
		const apiRepo = createMockPrayerApiRepository();
		const cacheService = createMockCacheService();
		const service = new PrayerTimeService(
			apiRepo as unknown as PrayerApiRepository,
			cacheService as unknown as CacheService,
		);
		return { service, apiRepo, cacheService };
	};

	describe("fetchDay", () => {
		it("returns data when address strategy succeeds", async () => {
			const { service, apiRepo } = createService();
			apiRepo.fetchTimingsByAddress.mockResolvedValue(samplePrayerData);

			const result = await service.fetchDay(baseQuery);

			expect(result).toBe(samplePrayerData);
			expect(apiRepo.fetchTimingsByAddress).toHaveBeenCalledTimes(1);
			expect(apiRepo.fetchTimingsByCity).not.toHaveBeenCalled();
			expect(apiRepo.fetchTimingsByCoords).not.toHaveBeenCalled();
		});

		it("falls back to city strategy when address fails", async () => {
			const { service, apiRepo } = createService();
			apiRepo.fetchTimingsByAddress.mockRejectedValue(new Error("address failed"));
			apiRepo.fetchTimingsByCity.mockResolvedValue(samplePrayerData);

			const result = await service.fetchDay(baseQuery);

			expect(result).toBe(samplePrayerData);
			expect(apiRepo.fetchTimingsByAddress).toHaveBeenCalledTimes(1);
			expect(apiRepo.fetchTimingsByCity).toHaveBeenCalledTimes(1);
			expect(apiRepo.fetchTimingsByCoords).not.toHaveBeenCalled();
		});

		it("falls back to coords when city fails", async () => {
			const { service, apiRepo } = createService();
			apiRepo.fetchTimingsByAddress.mockRejectedValue(new Error("address failed"));
			apiRepo.fetchTimingsByCity.mockRejectedValue(new Error("city failed"));
			apiRepo.fetchTimingsByCoords.mockResolvedValue(samplePrayerData);

			const result = await service.fetchDay(baseQuery);

			expect(result).toBe(samplePrayerData);
			expect(apiRepo.fetchTimingsByAddress).toHaveBeenCalledTimes(1);
			expect(apiRepo.fetchTimingsByCity).toHaveBeenCalledTimes(1);
			expect(apiRepo.fetchTimingsByCoords).toHaveBeenCalledTimes(1);
		});

		it("throws PrayerTimeFetchError when all strategies fail", async () => {
			const { service, apiRepo } = createService();
			apiRepo.fetchTimingsByAddress.mockRejectedValue(new Error("address failed"));
			apiRepo.fetchTimingsByCity.mockRejectedValue(new Error("city failed"));
			apiRepo.fetchTimingsByCoords.mockRejectedValue(new Error("coords failed"));

			await expect(service.fetchDay(baseQuery)).rejects.toThrow(PrayerTimeFetchError);
		});

		it("PrayerTimeFetchError message includes all error details", async () => {
			const { service, apiRepo } = createService();
			apiRepo.fetchTimingsByAddress.mockRejectedValue(new Error("address failed"));
			apiRepo.fetchTimingsByCity.mockRejectedValue(new Error("city failed"));
			apiRepo.fetchTimingsByCoords.mockRejectedValue(new Error("coords failed"));

			await expect(service.fetchDay(baseQuery)).rejects.toThrow(/Could not fetch prayer times/);
		});

		it("skips city strategy when city/country not provided", async () => {
			const { service, apiRepo } = createService();
			apiRepo.fetchTimingsByAddress.mockRejectedValue(new Error("address failed"));
			apiRepo.fetchTimingsByCoords.mockResolvedValue(samplePrayerData);

			const queryWithoutCity: RamadanQuery = {
				address: "Lahore",
				latitude: 31.5204,
				longitude: 74.3587,
			};

			const result = await service.fetchDay(queryWithoutCity);

			expect(result).toBe(samplePrayerData);
			expect(apiRepo.fetchTimingsByCity).not.toHaveBeenCalled();
		});

		it("skips coords strategy when lat/lon not provided", async () => {
			const { service, apiRepo } = createService();
			apiRepo.fetchTimingsByAddress.mockRejectedValue(new Error("address failed"));
			apiRepo.fetchTimingsByCity.mockRejectedValue(new Error("city failed"));

			const queryWithoutCoords: RamadanQuery = {
				address: "Lahore",
				city: "Lahore",
				country: "Pakistan",
			};

			await expect(service.fetchDay(queryWithoutCoords)).rejects.toThrow(PrayerTimeFetchError);
			expect(apiRepo.fetchTimingsByCoords).not.toHaveBeenCalled();
		});

		it("passes date parameter to address strategy", async () => {
			const { service, apiRepo } = createService();
			apiRepo.fetchTimingsByAddress.mockResolvedValue(samplePrayerData);
			const date = new Date("2026-03-01");

			await service.fetchDay(baseQuery, date);

			expect(apiRepo.fetchTimingsByAddress).toHaveBeenCalledWith(expect.objectContaining({ date }));
		});

		it("handles non-Error thrown values gracefully", async () => {
			const { service, apiRepo } = createService();
			apiRepo.fetchTimingsByAddress.mockRejectedValue("string error");
			apiRepo.fetchTimingsByCity.mockRejectedValue(42);
			apiRepo.fetchTimingsByCoords.mockRejectedValue(null);

			await expect(service.fetchDay(baseQuery)).rejects.toThrow(PrayerTimeFetchError);
		});
	});

	describe("fetchCalendar", () => {
		it("returns calendar data when address strategy succeeds", async () => {
			const { service, apiRepo } = createService();
			const calendarData: ReadonlyArray<PrayerData> = [samplePrayerData];
			apiRepo.fetchHijriCalendarByAddress.mockResolvedValue(calendarData);

			const result = await service.fetchCalendar(baseQuery, 1447);

			expect(result).toBe(calendarData);
			expect(apiRepo.fetchHijriCalendarByAddress).toHaveBeenCalledWith(
				expect.objectContaining({
					address: "Lahore, Pakistan",
					year: 1447,
					month: 9,
				}),
			);
		});

		it("falls back to city strategy when address fails", async () => {
			const { service, apiRepo } = createService();
			const calendarData: ReadonlyArray<PrayerData> = [samplePrayerData];
			apiRepo.fetchHijriCalendarByAddress.mockRejectedValue(new Error("address failed"));
			apiRepo.fetchHijriCalendarByCity.mockResolvedValue(calendarData);

			const result = await service.fetchCalendar(baseQuery, 1447);

			expect(result).toBe(calendarData);
			expect(apiRepo.fetchHijriCalendarByCity).toHaveBeenCalledTimes(1);
		});

		it("throws RamadanCalendarError when all strategies fail", async () => {
			const { service, apiRepo } = createService();
			apiRepo.fetchHijriCalendarByAddress.mockRejectedValue(new Error("address failed"));
			apiRepo.fetchHijriCalendarByCity.mockRejectedValue(new Error("city failed"));

			await expect(service.fetchCalendar(baseQuery, 1447)).rejects.toThrow(RamadanCalendarError);
		});

		it("skips city strategy when city/country not provided", async () => {
			const { service, apiRepo } = createService();
			apiRepo.fetchHijriCalendarByAddress.mockRejectedValue(new Error("address failed"));

			const queryWithoutCity: RamadanQuery = {
				address: "Lahore",
			};

			await expect(service.fetchCalendar(queryWithoutCity, 1447)).rejects.toThrow(
				RamadanCalendarError,
			);
			expect(apiRepo.fetchHijriCalendarByCity).not.toHaveBeenCalled();
		});
	});

	describe("fetchCustomDays", () => {
		it("fetches each day individually", async () => {
			const { service, apiRepo } = createService();
			apiRepo.fetchTimingsByAddress.mockResolvedValue(samplePrayerData);

			const firstRoza = new Date("2026-03-01");
			const result = await service.fetchCustomDays(baseQuery, firstRoza, 3);

			expect(result).toHaveLength(3);
			expect(apiRepo.fetchTimingsByAddress).toHaveBeenCalledTimes(3);
		});

		it("defaults to 30 days when totalDays is not provided", async () => {
			const { service, apiRepo } = createService();
			apiRepo.fetchTimingsByAddress.mockResolvedValue(samplePrayerData);

			const firstRoza = new Date("2026-03-01");
			const result = await service.fetchCustomDays(baseQuery, firstRoza);

			expect(result).toHaveLength(30);
			expect(apiRepo.fetchTimingsByAddress).toHaveBeenCalledTimes(30);
		});

		it("passes correct dates to fetchDay for each day", async () => {
			const { service, apiRepo } = createService();
			apiRepo.fetchTimingsByAddress.mockResolvedValue(samplePrayerData);

			const firstRoza = new Date("2026-03-01");
			await service.fetchCustomDays(baseQuery, firstRoza, 3);

			const calls = apiRepo.fetchTimingsByAddress.mock.calls;
			const dates = calls.map((call: Array<Record<string, unknown>>) => call[0]?.date as Date);
			expect(dates[0]?.getDate()).toBe(1);
			expect(dates[1]?.getDate()).toBe(2);
			expect(dates[2]?.getDate()).toBe(3);
		});

		it("rejects when any single-day fetch fails", async () => {
			const { service, apiRepo } = createService();
			apiRepo.fetchTimingsByAddress
				.mockResolvedValueOnce(samplePrayerData)
				.mockRejectedValueOnce(new Error("fail"));

			const queryMinimal: RamadanQuery = { address: "Lahore" };

			await expect(
				service.fetchCustomDays(queryMinimal, new Date("2026-03-01"), 2),
			).rejects.toThrow();
		});
	});
});
