import { afterEach, describe, expect, it, vi } from "vitest";
import { IpApiProvider } from "../../../providers/geo/ip-api.provider.js";

describe("IpApiProvider", () => {
	const provider = new IpApiProvider();

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should have the correct name", () => {
		expect(provider.name).toBe("ip-api");
	});

	it("should have priority 1", () => {
		expect(provider.priority).toBe(1);
	});

	it("should return GeoLocation on a successful response", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			json: async () => ({
				city: "Karachi",
				country: "Pakistan",
				lat: 24.86,
				lon: 67.0,
				timezone: "Asia/Karachi",
			}),
		});
		vi.stubGlobal("fetch", mockFetch);

		const result = await provider.detect();
		expect(result).toEqual({
			city: "Karachi",
			country: "Pakistan",
			latitude: 24.86,
			longitude: 67.0,
			timezone: "Asia/Karachi",
		});
		expect(mockFetch).toHaveBeenCalledWith(
			"http://ip-api.com/json/?fields=city,country,lat,lon,timezone",
		);
	});

	it("should return GeoLocation with empty timezone when timezone is missing", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			json: async () => ({
				city: "London",
				country: "United Kingdom",
				lat: 51.5,
				lon: -0.12,
			}),
		});
		vi.stubGlobal("fetch", mockFetch);

		const result = await provider.detect();
		expect(result).toEqual({
			city: "London",
			country: "United Kingdom",
			latitude: 51.5,
			longitude: -0.12,
			timezone: "",
		});
	});

	it("should return null on network error", async () => {
		const mockFetch = vi.fn().mockRejectedValue(new Error("Network error"));
		vi.stubGlobal("fetch", mockFetch);

		const result = await provider.detect();
		expect(result).toBeNull();
	});

	it("should return null on invalid response shape", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			json: async () => ({ invalid: "data" }),
		});
		vi.stubGlobal("fetch", mockFetch);

		const result = await provider.detect();
		expect(result).toBeNull();
	});
});
