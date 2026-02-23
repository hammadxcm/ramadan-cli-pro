import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, ApiValidationError } from "../../../errors/api.error.js";
import { PrayerApiRepository } from "../../../repositories/prayer-api.repository.js";
import { samplePrayerData } from "../../helpers/fixtures.js";

const createApiEnvelope = (data: unknown, code = 200, status = "OK") => ({
	code,
	status,
	data,
});

const createMockFetchResponse = (body: unknown, ok = true) => ({
	ok,
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

describe("PrayerApiRepository – uncovered methods", () => {
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

	describe("fetchTimingsByAddress – conditional param paths", () => {
		it("includes only method when school is not provided", async () => {
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(samplePrayerData)));

			const result = await repo.fetchTimingsByAddress({
				address: "Islamabad, Pakistan",
				method: 3,
				date: new Date(2026, 2, 10),
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("/v1/timingsByAddress/10-03-2026");
			expect(calledUrl).toContain("address=Islamabad");
			expect(calledUrl).toContain("method=3");
			expect(calledUrl).not.toContain("school=");
			expect(result.timings.Fajr).toBe(samplePrayerData.timings.Fajr);
		});

		it("includes only school when method is not provided", async () => {
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(samplePrayerData)));

			const result = await repo.fetchTimingsByAddress({
				address: "Karachi, Pakistan",
				school: 1,
				date: new Date(2026, 2, 20),
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("/v1/timingsByAddress/20-03-2026");
			expect(calledUrl).toContain("address=Karachi");
			expect(calledUrl).not.toContain("method=");
			expect(calledUrl).toContain("school=1");
			expect(result.meta.timezone).toBe("Asia/Karachi");
		});

		it("returns validated PrayerData with all fields present", async () => {
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(samplePrayerData)));

			const result = await repo.fetchTimingsByAddress({
				address: "Dubai, UAE",
				method: 4,
				school: 0,
				date: new Date(2026, 5, 15),
			});

			expect(result.timings).toBeDefined();
			expect(result.timings.Fajr).toBe(samplePrayerData.timings.Fajr);
			expect(result.timings.Dhuhr).toBe(samplePrayerData.timings.Dhuhr);
			expect(result.timings.Asr).toBe(samplePrayerData.timings.Asr);
			expect(result.timings.Maghrib).toBe(samplePrayerData.timings.Maghrib);
			expect(result.timings.Isha).toBe(samplePrayerData.timings.Isha);
			expect(result.date.hijri.month.en).toBe("Ramadan");
			expect(result.date.gregorian.year).toBe("2026");
			expect(result.meta.latitude).toBe(31.5204);
			expect(result.meta.longitude).toBe(74.3587);
		});

		it("handles address with special characters", async () => {
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(samplePrayerData)));

			await repo.fetchTimingsByAddress({
				address: "123 Main St, New York, NY 10001",
				date: new Date(2026, 0, 1),
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("/v1/timingsByAddress/01-01-2026");
			expect(calledUrl).toContain("address=");
		});

		it("sets method=0 when method is explicitly 0", async () => {
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(samplePrayerData)));

			await repo.fetchTimingsByAddress({
				address: "London, UK",
				method: 0,
				date: new Date(2026, 2, 1),
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("method=0");
		});

		it("sets school=0 when school is explicitly 0", async () => {
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(samplePrayerData)));

			await repo.fetchTimingsByAddress({
				address: "London, UK",
				school: 0,
				date: new Date(2026, 2, 1),
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("school=0");
		});
	});

	describe("fetchHijriCalendarByCity – conditional param paths", () => {
		it("includes only method when school is not provided", async () => {
			const calendarData = [samplePrayerData];
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(calendarData)));

			const result = await repo.fetchHijriCalendarByCity({
				city: "Riyadh",
				country: "Saudi Arabia",
				year: 1447,
				month: 9,
				method: 4,
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("/v1/hijriCalendarByCity/1447/9");
			expect(calledUrl).toContain("city=Riyadh");
			expect(calledUrl).toContain("country=Saudi+Arabia");
			expect(calledUrl).toContain("method=4");
			expect(calledUrl).not.toContain("school=");
			expect(result).toHaveLength(1);
		});

		it("includes only school when method is not provided", async () => {
			const calendarData = [samplePrayerData, samplePrayerData];
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(calendarData)));

			const result = await repo.fetchHijriCalendarByCity({
				city: "Jakarta",
				country: "Indonesia",
				year: 1447,
				month: 10,
				school: 0,
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("/v1/hijriCalendarByCity/1447/10");
			expect(calledUrl).toContain("city=Jakarta");
			expect(calledUrl).toContain("country=Indonesia");
			expect(calledUrl).not.toContain("method=");
			expect(calledUrl).toContain("school=0");
			expect(result).toHaveLength(2);
		});

		it("includes both method and school when provided", async () => {
			const calendarData = [samplePrayerData];
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(calendarData)));

			await repo.fetchHijriCalendarByCity({
				city: "Cairo",
				country: "Egypt",
				year: 1447,
				month: 9,
				method: 5,
				school: 1,
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("method=5");
			expect(calledUrl).toContain("school=1");
		});

		it("returns validated array with correct data", async () => {
			const calendarData = [samplePrayerData, samplePrayerData, samplePrayerData];
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(calendarData)));

			const result = await repo.fetchHijriCalendarByCity({
				city: "Medina",
				country: "Saudi Arabia",
				year: 1447,
				month: 9,
			});

			expect(result).toHaveLength(3);
			expect(result[0]?.timings.Fajr).toBe(samplePrayerData.timings.Fajr);
			expect(result[1]?.meta.timezone).toBe("Asia/Karachi");
			expect(result[2]?.date.hijri.month.en).toBe("Ramadan");
		});

		it("throws ApiValidationError for invalid data in response", async () => {
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope([{ bad: "data" }])));

			await expect(
				repo.fetchHijriCalendarByCity({
					city: "Lahore",
					country: "Pakistan",
					year: 1447,
					month: 9,
				}),
			).rejects.toThrow(ApiValidationError);
		});

		it("throws ApiError when data is a string message", async () => {
			mockFetch.mockResolvedValue(
				createMockFetchResponse({
					code: 200,
					status: "OK",
					data: "Unable to locate city",
				}),
			);

			await expect(
				repo.fetchHijriCalendarByCity({
					city: "FakeCity",
					country: "FakeCountry",
					year: 1447,
					month: 9,
				}),
			).rejects.toThrow(ApiError);
		});
	});

	describe("fetchTimingsByCoords – conditional param paths", () => {
		it("includes method and school when provided", async () => {
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(samplePrayerData)));

			await repo.fetchTimingsByCoords({
				latitude: 31.52,
				longitude: 74.36,
				method: 1,
				school: 1,
				date: new Date(2026, 2, 15),
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("/v1/timings/15-03-2026");
			expect(calledUrl).toContain("latitude=31.52");
			expect(calledUrl).toContain("longitude=74.36");
			expect(calledUrl).toContain("method=1");
			expect(calledUrl).toContain("school=1");
		});

		it("omits method and school when not provided", async () => {
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(samplePrayerData)));

			await repo.fetchTimingsByCoords({
				latitude: 40.71,
				longitude: -74.01,
				date: new Date(2026, 0, 1),
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("/v1/timings/01-01-2026");
			expect(calledUrl).not.toContain("method=");
			expect(calledUrl).not.toContain("school=");
		});

		it("includes timezonestring when timezone is provided", async () => {
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(samplePrayerData)));

			await repo.fetchTimingsByCoords({
				latitude: 31.52,
				longitude: 74.36,
				timezone: "Asia/Karachi",
				date: new Date(2026, 2, 10),
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("timezonestring=Asia");
		});

		it("returns validated PrayerData", async () => {
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(samplePrayerData)));

			const result = await repo.fetchTimingsByCoords({
				latitude: 31.52,
				longitude: 74.36,
				date: new Date(2026, 2, 10),
			});

			expect(result.timings).toBeDefined();
			expect(result.date).toBeDefined();
			expect(result.meta).toBeDefined();
		});
	});

	describe("fetchHijriCalendarByAddress – conditional param paths", () => {
		it("includes method and school when provided", async () => {
			const calendarData = [samplePrayerData];
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(calendarData)));

			await repo.fetchHijriCalendarByAddress({
				address: "Lahore, Pakistan",
				year: 1447,
				month: 9,
				method: 2,
				school: 1,
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("/v1/hijriCalendarByAddress/1447/9");
			expect(calledUrl).toContain("address=");
			expect(calledUrl).toContain("method=2");
			expect(calledUrl).toContain("school=1");
		});

		it("omits method and school when not provided", async () => {
			const calendarData = [samplePrayerData];
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(calendarData)));

			await repo.fetchHijriCalendarByAddress({
				address: "Istanbul, Turkey",
				year: 1447,
				month: 9,
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("/v1/hijriCalendarByAddress/1447/9");
			expect(calledUrl).not.toContain("method=");
			expect(calledUrl).not.toContain("school=");
		});

		it("returns validated array of PrayerData", async () => {
			const calendarData = [samplePrayerData, samplePrayerData];
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(calendarData)));

			const result = await repo.fetchHijriCalendarByAddress({
				address: "Makkah, Saudi Arabia",
				year: 1447,
				month: 9,
			});

			expect(result).toHaveLength(2);
			expect(result[0]?.timings).toBeDefined();
		});
	});

	describe("fetchCalendarByCity – conditional param paths", () => {
		it("includes only method when school is not provided", async () => {
			const calendarData = [samplePrayerData];
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(calendarData)));

			await repo.fetchCalendarByCity({
				city: "Toronto",
				country: "Canada",
				year: 2026,
				month: 3,
				method: 2,
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("/v1/calendarByCity/2026/3");
			expect(calledUrl).toContain("city=Toronto");
			expect(calledUrl).toContain("country=Canada");
			expect(calledUrl).toContain("method=2");
			expect(calledUrl).not.toContain("school=");
		});

		it("includes only school when method is not provided", async () => {
			const calendarData = [samplePrayerData];
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(calendarData)));

			await repo.fetchCalendarByCity({
				city: "Paris",
				country: "France",
				year: 2026,
				month: 6,
				school: 1,
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("/v1/calendarByCity/2026/6");
			expect(calledUrl).toContain("city=Paris");
			expect(calledUrl).toContain("country=France");
			expect(calledUrl).not.toContain("method=");
			expect(calledUrl).toContain("school=1");
		});

		it("uses year-only path without method or school", async () => {
			const calendarData = [samplePrayerData];
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(calendarData)));

			await repo.fetchCalendarByCity({
				city: "Ankara",
				country: "Turkey",
				year: 2026,
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("/v1/calendarByCity/2026?");
			expect(calledUrl).not.toMatch(/calendarByCity\/2026\/\d/);
			expect(calledUrl).not.toContain("method=");
			expect(calledUrl).not.toContain("school=");
		});

		it("uses year/month path with both method and school", async () => {
			const calendarData = [samplePrayerData, samplePrayerData];
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(calendarData)));

			const result = await repo.fetchCalendarByCity({
				city: "Dhaka",
				country: "Bangladesh",
				year: 2026,
				month: 12,
				method: 1,
				school: 1,
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("/v1/calendarByCity/2026/12");
			expect(calledUrl).toContain("city=Dhaka");
			expect(calledUrl).toContain("country=Bangladesh");
			expect(calledUrl).toContain("method=1");
			expect(calledUrl).toContain("school=1");
			expect(result).toHaveLength(2);
		});

		it("sets method=0 when method is explicitly 0", async () => {
			const calendarData = [samplePrayerData];
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(calendarData)));

			await repo.fetchCalendarByCity({
				city: "Lahore",
				country: "Pakistan",
				year: 2026,
				month: 3,
				method: 0,
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("method=0");
		});

		it("throws ApiError for non-200 response", async () => {
			mockFetch.mockResolvedValue(
				createMockFetchResponse({
					code: 404,
					status: "Not Found",
					data: {},
				}),
			);

			await expect(
				repo.fetchCalendarByCity({
					city: "Unknown",
					country: "Nowhere",
					year: 2026,
					month: 3,
				}),
			).rejects.toThrow(ApiError);
		});
	});

	describe("fetchQibla – endpoint and response validation", () => {
		it("constructs correct URL with latitude and longitude", async () => {
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(sampleQiblaData)));

			await repo.fetchQibla(31.5204, 74.3587);

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toBe("https://api.aladhan.com/v1/qibla/31.5204/74.3587");
		});

		it("returns validated QiblaData with all fields", async () => {
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(sampleQiblaData)));

			const result = await repo.fetchQibla(31.5204, 74.3587);

			expect(result).toEqual({
				latitude: 31.5204,
				longitude: 74.3587,
				direction: 253.583,
			});
		});

		it("handles negative coordinates", async () => {
			const negativeQiblaData = {
				latitude: -33.8688,
				longitude: -151.2093,
				direction: 277.5,
			};
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(negativeQiblaData)));

			const result = await repo.fetchQibla(-33.8688, -151.2093);

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("/v1/qibla/-33.8688/-151.2093");
			expect(result.latitude).toBe(-33.8688);
			expect(result.longitude).toBe(-151.2093);
			expect(result.direction).toBe(277.5);
		});

		it("handles zero coordinates", async () => {
			const zeroQiblaData = {
				latitude: 0,
				longitude: 0,
				direction: 58.28,
			};
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(zeroQiblaData)));

			const result = await repo.fetchQibla(0, 0);

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("/v1/qibla/0/0");
			expect(result.latitude).toBe(0);
			expect(result.longitude).toBe(0);
		});

		it("throws ApiValidationError when response data is invalid", async () => {
			mockFetch.mockResolvedValue(
				createMockFetchResponse(
					createApiEnvelope({
						lat: 31.5204,
						lon: 74.3587,
						// missing direction, wrong field names
					}),
				),
			);

			await expect(repo.fetchQibla(31.5204, 74.3587)).rejects.toThrow(ApiValidationError);
		});

		it("throws ApiError when API returns string data", async () => {
			mockFetch.mockResolvedValue(
				createMockFetchResponse({
					code: 200,
					status: "OK",
					data: "Invalid coordinates",
				}),
			);

			await expect(repo.fetchQibla(999, 999)).rejects.toThrow(ApiError);
		});

		it("throws ApiError for non-200 response code", async () => {
			mockFetch.mockResolvedValue(
				createMockFetchResponse({
					code: 400,
					status: "Bad Request",
					data: {},
				}),
			);

			await expect(repo.fetchQibla(31.5204, 74.3587)).rejects.toThrow(ApiError);
		});
	});

	describe("fetchMethods – endpoint and response validation", () => {
		it("constructs correct URL for methods endpoint", async () => {
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(sampleMethodsData)));

			await repo.fetchMethods();

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toBe("https://api.aladhan.com/v1/methods");
		});

		it("returns validated methods data with all fields", async () => {
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(sampleMethodsData)));

			const result = await repo.fetchMethods();

			expect(result["1"]?.id).toBe(1);
			expect(result["1"]?.name).toBe("University of Islamic Sciences, Karachi");
			expect(result["1"]?.params.Fajr).toBe(18);
			expect(result["1"]?.params.Isha).toBe(18);
			expect(result["2"]?.id).toBe(2);
			expect(result["2"]?.name).toBe("Islamic Society of North America (ISNA)");
			expect(result["2"]?.params.Fajr).toBe(15);
			expect(result["2"]?.params.Isha).toBe(15);
		});

		it("handles methods with string Isha parameter", async () => {
			const methodsWithStringIsha: Record<string, unknown> = {
				"7": {
					id: 7,
					name: "Shia Ithna-Ashari",
					params: { Fajr: 16, Isha: "14 min after Maghrib" },
				},
			};
			mockFetch.mockResolvedValue(
				createMockFetchResponse(createApiEnvelope(methodsWithStringIsha)),
			);

			const result = await repo.fetchMethods();

			expect(result["7"]?.id).toBe(7);
			expect(result["7"]?.params.Isha).toBe("14 min after Maghrib");
		});

		it("handles empty methods response", async () => {
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope({})));

			const result = await repo.fetchMethods();

			expect(Object.keys(result)).toHaveLength(0);
		});

		it("throws ApiValidationError when method shape is invalid", async () => {
			const invalidMethods: Record<string, unknown> = {
				"1": {
					// missing required id and name fields
					description: "Some method",
				},
			};
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(invalidMethods)));

			await expect(repo.fetchMethods()).rejects.toThrow(ApiValidationError);
		});

		it("throws ApiError for non-200 response code", async () => {
			mockFetch.mockResolvedValue(
				createMockFetchResponse({
					code: 500,
					status: "Internal Server Error",
					data: {},
				}),
			);

			await expect(repo.fetchMethods()).rejects.toThrow(ApiError);
		});

		it("throws ApiError when data is a string message", async () => {
			mockFetch.mockResolvedValue(
				createMockFetchResponse({
					code: 200,
					status: "OK",
					data: "Service temporarily unavailable",
				}),
			);

			await expect(repo.fetchMethods()).rejects.toThrow(ApiError);
		});

		it("propagates network error when fetch rejects", async () => {
			mockFetch.mockRejectedValue(new TypeError("Network error"));

			await expect(repo.fetchMethods()).rejects.toThrow(TypeError);
		});
	});
});
