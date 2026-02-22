import { describe, expect, it } from "vitest";
import {
	ApiError,
	ApiNetworkError,
	ApiValidationError,
	AppError,
	ConfigError,
	ConfigValidationError,
	GeoLocationError,
	GeoProviderError,
	NotificationError,
	NotificationPermissionError,
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

	it("ConfigError has correct code and name", () => {
		const err = new ConfigError("config fail");
		expect(err).toBeInstanceOf(AppError);
		expect(err.code).toBe("CONFIG_ERROR");
		expect(err.name).toBe("ConfigError");
		expect(err.message).toBe("config fail");
	});

	it("ConfigValidationError has correct code and name", () => {
		const err = new ConfigValidationError("invalid value");
		expect(err).toBeInstanceOf(AppError);
		expect(err.code).toBe("CONFIG_VALIDATION_ERROR");
		expect(err.name).toBe("ConfigValidationError");
		expect(err.message).toBe("invalid value");
	});

	it("GeoLocationError has correct code and name", () => {
		const err = new GeoLocationError("location fail");
		expect(err).toBeInstanceOf(AppError);
		expect(err.code).toBe("GEO_LOCATION_ERROR");
		expect(err.name).toBe("GeoLocationError");
		expect(err.message).toBe("location fail");
	});

	it("NotificationError has correct code and name", () => {
		const err = new NotificationError("notify fail");
		expect(err).toBeInstanceOf(AppError);
		expect(err.code).toBe("NOTIFICATION_ERROR");
		expect(err.name).toBe("NotificationError");
		expect(err.message).toBe("notify fail");
	});

	it("NotificationPermissionError has correct code and name", () => {
		const err = new NotificationPermissionError("no permission");
		expect(err).toBeInstanceOf(AppError);
		expect(err.code).toBe("NOTIFICATION_PERMISSION_ERROR");
		expect(err.name).toBe("NotificationPermissionError");
		expect(err.message).toBe("no permission");
	});
});
