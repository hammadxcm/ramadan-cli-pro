import { afterEach, describe, expect, it, vi } from "vitest";
import { IpWhoisProvider } from "../../../providers/geo/ip-whois.provider.js";

describe("IpWhoisProvider", () => {
	const provider = new IpWhoisProvider();

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should have the correct name", () => {
		expect(provider.name).toBe("ip-whois");
	});

	it("should have priority 3", () => {
		expect(provider.priority).toBe(3);
	});

	it("should return GeoLocation when success is true", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			json: async () => ({
				success: true,
				city: "Istanbul",
				country: "Turkey",
				latitude: 41.01,
				longitude: 28.97,
				timezone: { id: "Europe/Istanbul" },
			}),
		});
		vi.stubGlobal("fetch", mockFetch);

		const result = await provider.detect();
		expect(result).toEqual({
			city: "Istanbul",
			country: "Turkey",
			latitude: 41.01,
			longitude: 28.97,
			timezone: "Europe/Istanbul",
		});
		expect(mockFetch).toHaveBeenCalledWith("https://ipwho.is/");
	});

	it("should return GeoLocation with empty timezone when timezone object is missing", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			json: async () => ({
				success: true,
				city: "Dubai",
				country: "United Arab Emirates",
				latitude: 25.2,
				longitude: 55.27,
			}),
		});
		vi.stubGlobal("fetch", mockFetch);

		const result = await provider.detect();
		expect(result).toEqual({
			city: "Dubai",
			country: "United Arab Emirates",
			latitude: 25.2,
			longitude: 55.27,
			timezone: "",
		});
	});

	it("should return null when success is false", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			json: async () => ({
				success: false,
				city: "Unknown",
				country: "Unknown",
				latitude: 0,
				longitude: 0,
			}),
		});
		vi.stubGlobal("fetch", mockFetch);

		const result = await provider.detect();
		expect(result).toBeNull();
	});

	it("should return null on network error", async () => {
		const mockFetch = vi.fn().mockRejectedValue(new Error("Network error"));
		vi.stubGlobal("fetch", mockFetch);

		const result = await provider.detect();
		expect(result).toBeNull();
	});

	it("should return null on invalid response shape", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			json: async () => ({ invalid: "response" }),
		});
		vi.stubGlobal("fetch", mockFetch);

		const result = await provider.detect();
		expect(result).toBeNull();
	});
});
