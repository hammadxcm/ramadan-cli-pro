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

describe("PrayerApiRepository – extended coverage", () => {
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

	describe("fetchTimingsByCoords – timezone option", () => {
		it("sets timezonestring param when timezone is provided", async () => {
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(samplePrayerData)));

			const result = await repo.fetchTimingsByCoords({
				latitude: 40.7128,
				longitude: -74.006,
				timezone: "America/New_York",
				method: 2,
				school: 0,
				date: new Date(2026, 2, 10),
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("/v1/timings/10-03-2026");
			expect(calledUrl).toContain("latitude=40.7128");
			expect(calledUrl).toContain("longitude=-74.006");
			expect(calledUrl).toContain("timezonestring=America%2FNew_York");
			expect(calledUrl).toContain("method=2");
			expect(calledUrl).toContain("school=0");
			expect(result.timings.Fajr).toBe(samplePrayerData.timings.Fajr);
		});

		it("omits method, school, and timezone when not provided", async () => {
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(samplePrayerData)));

			await repo.fetchTimingsByCoords({
				latitude: 51.5074,
				longitude: -0.1278,
				date: new Date(2026, 0, 20),
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("/v1/timings/20-01-2026");
			expect(calledUrl).not.toContain("method=");
			expect(calledUrl).not.toContain("school=");
			expect(calledUrl).not.toContain("timezonestring=");
		});

		it("uses today's date when date is not provided", async () => {
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(samplePrayerData)));

			const now = new Date();
			await repo.fetchTimingsByCoords({
				latitude: 31.5204,
				longitude: 74.3587,
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			const day = String(now.getDate()).padStart(2, "0");
			const month = String(now.getMonth() + 1).padStart(2, "0");
			const year = now.getFullYear();
			expect(calledUrl).toContain(`/v1/timings/${day}-${month}-${year}`);
		});
	});

	describe("fetchHijriCalendarByAddress – method and school options", () => {
		it("includes method and school params when provided", async () => {
			const calendarData = [samplePrayerData, samplePrayerData];
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(calendarData)));

			const result = await repo.fetchHijriCalendarByAddress({
				address: "Mecca, Saudi Arabia",
				year: 1447,
				month: 9,
				method: 4,
				school: 1,
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("/v1/hijriCalendarByAddress/1447/9");
			expect(calledUrl).toContain("address=Mecca");
			expect(calledUrl).toContain("method=4");
			expect(calledUrl).toContain("school=1");
			expect(result).toHaveLength(2);
		});

		it("omits method and school when not provided", async () => {
			const calendarData = [samplePrayerData];
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(calendarData)));

			await repo.fetchHijriCalendarByAddress({
				address: "Cairo, Egypt",
				year: 1447,
				month: 10,
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("/v1/hijriCalendarByAddress/1447/10");
			expect(calledUrl).not.toContain("method=");
			expect(calledUrl).not.toContain("school=");
		});
	});

	describe("fetchHijriCalendarByCity – without optional params", () => {
		it("omits method and school when not provided", async () => {
			const calendarData = [samplePrayerData];
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(calendarData)));

			await repo.fetchHijriCalendarByCity({
				city: "Istanbul",
				country: "Turkey",
				year: 1447,
				month: 9,
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("/v1/hijriCalendarByCity/1447/9");
			expect(calledUrl).toContain("city=Istanbul");
			expect(calledUrl).toContain("country=Turkey");
			expect(calledUrl).not.toContain("method=");
			expect(calledUrl).not.toContain("school=");
		});
	});

	describe("fetchCalendarByCity – month variations and options", () => {
		it("constructs URL with year and month when month is provided", async () => {
			const calendarData = [samplePrayerData];
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(calendarData)));

			await repo.fetchCalendarByCity({
				city: "London",
				country: "UK",
				year: 2026,
				month: 6,
				method: 3,
				school: 0,
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("/v1/calendarByCity/2026/6");
			expect(calledUrl).toContain("city=London");
			expect(calledUrl).toContain("country=UK");
			expect(calledUrl).toContain("method=3");
			expect(calledUrl).toContain("school=0");
		});

		it("constructs URL with year only when month is omitted", async () => {
			const calendarData = [samplePrayerData];
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(calendarData)));

			await repo.fetchCalendarByCity({
				city: "Berlin",
				country: "Germany",
				year: 2026,
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			expect(calledUrl).toContain("/v1/calendarByCity/2026?");
			expect(calledUrl).not.toMatch(/calendarByCity\/2026\/\d/);
			expect(calledUrl).not.toContain("method=");
			expect(calledUrl).not.toContain("school=");
		});

		it("returns the parsed array of prayer data", async () => {
			const calendarData = [samplePrayerData, samplePrayerData, samplePrayerData];
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(calendarData)));

			const result = await repo.fetchCalendarByCity({
				city: "Lahore",
				country: "Pakistan",
				year: 2026,
				month: 3,
			});

			expect(result).toHaveLength(3);
			expect(result[0]?.meta.timezone).toBe("Asia/Karachi");
		});
	});

	describe("fetchAndParse – additional error paths", () => {
		it("propagates network error when fetch rejects", async () => {
			mockFetch.mockRejectedValue(new TypeError("Failed to fetch"));

			await expect(
				repo.fetchTimingsByCoords({
					latitude: 31.5204,
					longitude: 74.3587,
					date: new Date(2026, 2, 1),
				}),
			).rejects.toThrow(TypeError);
		});

		it("throws ApiError when response.json() rejects", async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				json: vi.fn().mockRejectedValue(new SyntaxError("Unexpected token")),
			});

			await expect(
				repo.fetchTimingsByCity({
					city: "Lahore",
					country: "Pakistan",
					date: new Date(2026, 2, 1),
				}),
			).rejects.toThrow(SyntaxError);
		});

		it("throws ApiValidationError when data schema validation fails on calendar endpoint", async () => {
			mockFetch.mockResolvedValue(
				createMockFetchResponse(createApiEnvelope([{ invalid: "not prayer data" }])),
			);

			await expect(
				repo.fetchCalendarByCity({
					city: "Lahore",
					country: "Pakistan",
					year: 2026,
					month: 3,
				}),
			).rejects.toThrow(ApiValidationError);
		});

		it("throws ApiError for non-200 status on coords endpoint", async () => {
			mockFetch.mockResolvedValue(
				createMockFetchResponse({
					code: 500,
					status: "Internal Server Error",
					data: {},
				}),
			);

			await expect(
				repo.fetchTimingsByCoords({
					latitude: 31.5204,
					longitude: 74.3587,
					date: new Date(2026, 2, 1),
				}),
			).rejects.toThrow(ApiError);
		});

		it("throws ApiError when data is a string on hijri calendar endpoint", async () => {
			mockFetch.mockResolvedValue(
				createMockFetchResponse({
					code: 200,
					status: "OK",
					data: "Invalid address provided",
				}),
			);

			await expect(
				repo.fetchHijriCalendarByAddress({
					address: "Nowhere",
					year: 1447,
					month: 9,
				}),
			).rejects.toThrow(ApiError);
		});

		it("throws ApiValidationError for malformed envelope on qibla endpoint", async () => {
			mockFetch.mockResolvedValue(createMockFetchResponse({ unexpected: "shape" }));

			await expect(repo.fetchQibla(31.5204, 74.3587)).rejects.toThrow(ApiValidationError);
		});
	});

	describe("fetchTimingsByAddress – default date", () => {
		it("uses today's date when date is not provided", async () => {
			mockFetch.mockResolvedValue(createMockFetchResponse(createApiEnvelope(samplePrayerData)));

			const now = new Date();
			await repo.fetchTimingsByAddress({
				address: "Tokyo, Japan",
			});

			const calledUrl = mockFetch.mock.calls[0]?.[0] as string;
			const day = String(now.getDate()).padStart(2, "0");
			const month = String(now.getMonth() + 1).padStart(2, "0");
			const year = now.getFullYear();
			expect(calledUrl).toContain(`/v1/timingsByAddress/${day}-${month}-${year}`);
		});
	});
});
