import { afterEach, describe, expect, it, vi } from "vitest";
import { OpenMeteoProvider } from "../../../providers/geocoding/open-meteo.provider.js";

describe("OpenMeteoProvider", () => {
	const provider = new OpenMeteoProvider();

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should return CityCountryGuess on a successful response", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			json: async () => ({
				results: [
					{
						name: "Karachi",
						country: "Pakistan",
						latitude: 24.86,
						longitude: 67.0,
						timezone: "Asia/Karachi",
					},
				],
			}),
		});
		vi.stubGlobal("fetch", mockFetch);

		const result = await provider.search("Karachi");
		expect(result).toEqual({
			city: "Karachi",
			country: "Pakistan",
			latitude: 24.86,
			longitude: 67.0,
			timezone: "Asia/Karachi",
		});
		expect(mockFetch).toHaveBeenCalledOnce();
	});

	it("should return result without timezone when timezone is absent", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			json: async () => ({
				results: [
					{
						name: "Mecca",
						country: "Saudi Arabia",
						latitude: 21.42,
						longitude: 39.82,
					},
				],
			}),
		});
		vi.stubGlobal("fetch", mockFetch);

		const result = await provider.search("Mecca");
		expect(result).toEqual({
			city: "Mecca",
			country: "Saudi Arabia",
			latitude: 21.42,
			longitude: 39.82,
		});
		expect(result?.timezone).toBeUndefined();
	});

	it("should return null when results array is empty", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			json: async () => ({
				results: [],
			}),
		});
		vi.stubGlobal("fetch", mockFetch);

		const result = await provider.search("xyznonexistent");
		expect(result).toBeNull();
	});

	it("should return null when results field is missing", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			json: async () => ({}),
		});
		vi.stubGlobal("fetch", mockFetch);

		const result = await provider.search("anything");
		expect(result).toBeNull();
	});

	it("should return null for an empty query", async () => {
		const result = await provider.search("");
		expect(result).toBeNull();
	});

	it("should return null for a whitespace-only query", async () => {
		const result = await provider.search("   ");
		expect(result).toBeNull();
	});

	it("should return null on network error", async () => {
		const mockFetch = vi.fn().mockRejectedValue(new Error("Network error"));
		vi.stubGlobal("fetch", mockFetch);

		const result = await provider.search("Karachi");
		expect(result).toBeNull();
	});

	it("should return null on invalid response shape", async () => {
		const mockFetch = vi.fn().mockResolvedValue({
			json: async () => "not an object",
		});
		vi.stubGlobal("fetch", mockFetch);

		const result = await provider.search("Karachi");
		expect(result).toBeNull();
	});
});
