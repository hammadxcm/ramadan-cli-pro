import { afterEach, describe, expect, it, vi } from "vitest";
import { IpapiCoProvider } from "../../../providers/geo/ipapi-co.provider.js";

describe("IpapiCoProvider", () => {
	const provider = new IpapiCoProvider();

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should have the correct name", () => {
		expect(provider.name).toBe("ipapi-co");
	});

	it("should have priority 2", () => {
		expect(provider.priority).toBe(2);
	});

	it("should return GeoLocation on a successful response", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			json: async () => ({
				city: "Lahore",
				country_name: "Pakistan",
				latitude: 31.52,
				longitude: 74.35,
				timezone: "Asia/Karachi",
			}),
		});
		vi.stubGlobal("fetch", mockFetch);

		const result = await provider.detect();
		expect(result).toEqual({
			city: "Lahore",
			country: "Pakistan",
			latitude: 31.52,
			longitude: 74.35,
			timezone: "Asia/Karachi",
		});
		expect(mockFetch).toHaveBeenCalledWith("https://ipapi.co/json/");
	});

	it("should return GeoLocation with empty timezone when timezone is missing", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			json: async () => ({
				city: "Berlin",
				country_name: "Germany",
				latitude: 52.52,
				longitude: 13.4,
			}),
		});
		vi.stubGlobal("fetch", mockFetch);

		const result = await provider.detect();
		expect(result).toEqual({
			city: "Berlin",
			country: "Germany",
			latitude: 52.52,
			longitude: 13.4,
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
			json: async () => ({ broken: true }),
		});
		vi.stubGlobal("fetch", mockFetch);

		const result = await provider.detect();
		expect(result).toBeNull();
	});
});
