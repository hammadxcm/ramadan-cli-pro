import { describe, expect, it } from "vitest";
import {
	ApiError,
	ApiNetworkError,
	ApiValidationError,
	AppError,
	ConfigError,
	GeoLocationError,
	GeoProviderError,
	PrayerTimeFetchError,
	RozaNotFoundError,
} from "../../../errors/index.js";

describe("Error hierarchy", () => {
	it("AppError is an Error", () => {
		const err = new AppError("test", "UNKNOWN_ERROR");
		expect(err).toBeInstanceOf(Error);
		expect(err.code).toBe("UNKNOWN_ERROR");
		expect(err.isOperational).toBe(true);
		expect(err.timestamp).toBeInstanceOf(Date);
	});

	it("AppError serializes to JSON", () => {
		const err = new AppError("test msg", "API_ERROR");
		const json = err.toJSON();
		expect(json.code).toBe("API_ERROR");
		expect(json.message).toBe("test msg");
		expect(json.isOperational).toBe(true);
	});

	it("ApiError extends AppError", () => {
		const err = new ApiError("api fail");
		expect(err).toBeInstanceOf(AppError);
		expect(err.code).toBe("API_ERROR");
	});

	it("ApiValidationError has issues", () => {
		const err = new ApiValidationError("bad data", ["issue1", "issue2"]);
		expect(err.issues).toEqual(["issue1", "issue2"]);
		expect(err.code).toBe("API_VALIDATION_ERROR");
	});

	it("ApiNetworkError has url", () => {
		const err = new ApiNetworkError("timeout", "https://example.com");
		expect(err.url).toBe("https://example.com");
	});

	it("GeoProviderError has providerName", () => {
		const err = new GeoProviderError("fail", "ip-api");
		expect(err.providerName).toBe("ip-api");
	});

	it("PrayerTimeFetchError has attempts", () => {
		const err = new PrayerTimeFetchError("fail", ["attempt1"]);
		expect(err.attempts).toEqual(["attempt1"]);
	});

	it("RozaNotFoundError has rozaNumber", () => {
		const err = new RozaNotFoundError(15);
		expect(err.rozaNumber).toBe(15);
		expect(err.message).toContain("15");
	});
});
