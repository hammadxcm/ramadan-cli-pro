import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, ApiValidationError } from "../../../errors/api.error.js";
import { PrayerApiRepository } from "../../../repositories/prayer-api.repository.js";
import { samplePrayerData } from "../../helpers/fixtures.js";

const createApiEnvelope = (data: unknown, code = 200, status = "OK") => ({
	code,
	status,
	data,
});

const createMockFetchResponse = (body: unknown) => ({
	json: vi.fn().mockResolvedValue(body),
});

const sampleQiblaData = {
	latitude: 31.5204,
	longitude: 74.3587,
	direction: 253.583,
};

const sampleMethodsData: Record<string, unknown> = {
	"1": {
		id: 1,
		name: "University of Islamic Sciences, Karachi",
		params: { Fajr: 18, Isha: 18 },
	},
	"2": {
		id: 2,
		name: "Islamic Society of North America (ISNA)",
		params: { Fajr: 15, Isha: 15 },
	},
};

describe("PrayerApiRepository", () => {
	let repo: PrayerApiRepository;
	let mockFetch: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		repo = new PrayerApiRepository();
		mockFetch = vi.fn();
		vi.stubGlobal("fetch", mockFetch);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("fetchTimingsByCity", () => {
		it("constructs correct URL and returns parsed data", async () => {
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(samplePrayerData)));

			const result = await repo.fetchTimingsByCity({
				city: "Lahore",
				country: "Pakistan",
				method: 1,
				school: 1,
				date: new Date(2026, 2, 1), // March 1, 2026
			});

			expect(mockFetch).toHaveBeenCalledTimes(1);
			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("/v1/timingsByCity/01-03-2026");
			expect(calledUrl).toContain("city=Lahore");
			expect(calledUrl).toContain("country=Pakistan");
			expect(calledUrl).toContain("method=1");
			expect(calledUrl).toContain("school=1");
			expect(result.timings.Fajr).toBe(samplePrayerData.timings.Fajr);
			expect(result.meta.timezone).toBe("Asia/Karachi");
		});

		it("omits method and school when not provided", async () => {
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(samplePrayerData)));

			await repo.fetchTimingsByCity({
				city: "Lahore",
				country: "Pakistan",
				date: new Date(2026, 2, 1),
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).not.toContain("method=");
			expect(calledUrl).not.toContain("school=");
		});
	});

	describe("fetchTimingsByAddress", () => {
		it("constructs correct URL with address parameter", async () => {
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(samplePrayerData)));

			await repo.fetchTimingsByAddress({
				address: "Lahore, Pakistan",
				method: 2,
				school: 0,
				date: new Date(2026, 2, 15),
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("/v1/timingsByAddress/15-03-2026");
			expect(calledUrl).toContain("address=Lahore");
			expect(calledUrl).toContain("method=2");
			expect(calledUrl).toContain("school=0");
		});

		it("omits optional parameters when not specified", async () => {
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(samplePrayerData)));

			await repo.fetchTimingsByAddress({
				address: "Berlin, Germany",
				date: new Date(2026, 2, 1),
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("address=Berlin");
			expect(calledUrl).not.toContain("method=");
			expect(calledUrl).not.toContain("school=");
		});
	});

	describe("fetchTimingsByCoords", () => {
		it("constructs correct URL with lat/lon", async () => {
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(samplePrayerData)));

			await repo.fetchTimingsByCoords({
				latitude: 31.5204,
				longitude: 74.3587,
				method: 1,
				school: 1,
				date: new Date(2026, 2, 1),
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("/v1/timings/01-03-2026");
			expect(calledUrl).toContain("latitude=31.5204");
			expect(calledUrl).toContain("longitude=74.3587");
			expect(calledUrl).toContain("method=1");
			expect(calledUrl).toContain("school=1");
		});

		it("includes timezone parameter when provided", async () => {
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(samplePrayerData)));

			await repo.fetchTimingsByCoords({
				latitude: 31.5204,
				longitude: 74.3587,
				timezone: "Asia/Karachi",
				date: new Date(2026, 2, 1),
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("timezonestring=Asia");
		});

		it("omits timezone when not provided", async () => {
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(samplePrayerData)));

			await repo.fetchTimingsByCoords({
				latitude: 31.5204,
				longitude: 74.3587,
				date: new Date(2026, 2, 1),
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).not.toContain("timezonestring=");
		});
	});

	describe("fetchHijriCalendarByCity", () => {
		it("returns array of PrayerData for a Hijri month", async () => {
			const calendarData = [samplePrayerData, samplePrayerData];
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(calendarData)));

			const result = await repo.fetchHijriCalendarByCity({
				city: "Lahore",
				country: "Pakistan",
				year: 1447,
				month: 9,
				method: 1,
				school: 1,
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("/v1/hijriCalendarByCity/1447/9");
			expect(calledUrl).toContain("city=Lahore");
			expect(calledUrl).toContain("country=Pakistan");
			expect(result).toHaveLength(2);
			expect(result[0]?.timings.Fajr).toBe(samplePrayerData.timings.Fajr);
		});
	});

	describe("fetchHijriCalendarByAddress", () => {
		it("constructs correct URL with address and Hijri year/month", async () => {
			const calendarData = [samplePrayerData];
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(calendarData)));

			const result = await repo.fetchHijriCalendarByAddress({
				address: "Lahore, Pakistan",
				year: 1447,
				month: 9,
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("/v1/hijriCalendarByAddress/1447/9");
			expect(calledUrl).toContain("address=Lahore");
			expect(result).toHaveLength(1);
		});
	});

	describe("fetchCalendarByCity", () => {
		it("constructs URL with year and month", async () => {
			const calendarData = [samplePrayerData];
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(calendarData)));

			await repo.fetchCalendarByCity({
				city: "Lahore",
				country: "Pakistan",
				year: 2026,
				month: 3,
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("/v1/calendarByCity/2026/3");
		});

		it("constructs URL with year only when month is omitted", async () => {
			const calendarData = [samplePrayerData];
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(calendarData)));

			await repo.fetchCalendarByCity({
				city: "Lahore",
				country: "Pakistan",
				year: 2026,
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("/v1/calendarByCity/2026?");
			expect(calledUrl).not.toMatch(/calendarByCity\/2026\/\d/);
		});
	});

	describe("fetchQibla", () => {
		it("returns QiblaData with direction", async () => {
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(sampleQiblaData)));

			const result = await repo.fetchQibla(31.5204, 74.3587);

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("/v1/qibla/31.5204/74.3587");
			expect(result.latitude).toBe(31.5204);
			expect(result.longitude).toBe(74.3587);
			expect(result.direction).toBe(253.583);
		});
	});

	describe("fetchMethods", () => {
		it("returns methods data as a record", async () => {
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(sampleMethodsData)));

			const result = await repo.fetchMethods();

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("/v1/methods");
			expect(result["1"]?.id).toBe(1);
			expect(result["1"]?.name).toBe("University of Islamic Sciences, Karachi");
			expect(result["2"]?.id).toBe(2);
			expect(result["2"]?.params.Fajr).toBe(15);
		});
	});

	describe("error handling", () => {
		it("throws ApiError for non-200 API response code", async () => {
			mockFetch.mockResolvedValue(
				createMockFetchResponse({
					code: 400,
					status: "Bad Request",
					data: {},
				}),
			);

			await expect(
				repo.fetchTimingsByCity({
					city: "Lahore",
					country: "Pakistan",
					date: new Date(2026, 2, 1),
				}),
			).rejects.toThrow(ApiError);
		});

		it("throws ApiValidationError for invalid response body shape", async () => {
			mockFetch.mockResolvedValue(
				createMockFetchResponse(
					createApiEnvelope({
						// Missing required fields like timings, date, meta
						invalid: true,
					}),
				),
			);

			await expect(
				repo.fetchTimingsByCity({
					city: "Lahore",
					country: "Pakistan",
					date: new Date(2026, 2, 1),
				}),
			).rejects.toThrow(ApiValidationError);
		});

		it("throws ApiValidationError when envelope is malformed", async () => {
			mockFetch.mockResolvedValue(
				createMockFetchResponse({
					// Missing code and status fields
					result: "something",
				}),
			);

			await expect(
				repo.fetchTimingsByCity({
					city: "Lahore",
					country: "Pakistan",
					date: new Date(2026, 2, 1),
				}),
			).rejects.toThrow(ApiValidationError);
		});

		it("throws ApiError when API data is a string message", async () => {
			mockFetch.mockResolvedValue(
				createMockFetchResponse({
					code: 200,
					status: "OK",
					data: "Unable to locate city",
				}),
			);

			await expect(
				repo.fetchTimingsByCity({
					city: "InvalidCity",
					country: "Nowhere",
					date: new Date(2026, 2, 1),
				}),
			).rejects.toThrow(ApiError);
		});
	});

	describe("date formatting", () => {
		it("uses today's date when date is not provided", async () => {
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(samplePrayerData)));

			const now = new Date();
			await repo.fetchTimingsByCity({
				city: "Lahore",
				country: "Pakistan",
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			const day = String(now.getDate()).padStart(2, "0");
			const month = String(now.getMonth() + 1).padStart(2, "0");
			const year = now.getFullYear();
			expect(calledUrl).toContain(`/timingsByCity/${day}-${month}-${year}`);
		});

		it("zero-pads single digit day and month", async () => {
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(samplePrayerData)));

			await repo.fetchTimingsByCity({
				city: "Lahore",
				country: "Pakistan",
				date: new Date(2026, 0, 5), // Jan 5
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("/timingsByCity/05-01-2026");
		});
	});
});
