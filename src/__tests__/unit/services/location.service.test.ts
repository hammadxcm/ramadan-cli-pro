import { beforeEach, describe, expect, it, vi } from "vitest";
import type { GeoProviderFactory } from "../../../providers/geo/geo-provider.factory.js";
import type { ConfigRepository } from "../../../repositories/config.repository.js";
import { LocationService } from "../../../services/location.service.js";
import type { GeoLocation } from "../../../types/geo.js";
import { sampleCityGuess, sampleGeoLocation } from "../../helpers/fixtures.js";
import { createMockConfigRepository, createMockGeocodingProvider } from "../../helpers/mocks.js";

const createMockGeoProviderFactory = (
	result: GeoLocation | null = null,
): { detect: ReturnType<typeof vi.fn> } => ({
	detect: vi.fn().mockResolvedValue(result),
});

describe("LocationService", () => {
	let configRepo: ReturnType<typeof createMockConfigRepository>;
	let geoProviderFactory: ReturnType<typeof createMockGeoProviderFactory>;
	let geocodingProvider: ReturnType<typeof createMockGeocodingProvider>;
	let service: LocationService;

	beforeEach(() => {
		configRepo = createMockConfigRepository();
		geoProviderFactory = createMockGeoProviderFactory();
		geocodingProvider = createMockGeocodingProvider();
		service = new LocationService(
			configRepo as unknown as ConfigRepository,
			geoProviderFactory as unknown as GeoProviderFactory,
			geocodingProvider,
		);
	});

	describe("parseCityCountry", () => {
		it("returns null for a single city without comma", () => {
			// parseCityCountry is private, but we can test it indirectly through resolveQuery
			// when a "City, Country" string is passed as the city option
			// However, let's access it via the bracket notation for direct testing
			const result = (
				service as unknown as Record<string, (v: string) => unknown>
			).parseCityCountry?.("Lahore");
			expect(result).toBeNull();
		});

		it("parses 'Lahore, Pakistan' into city and country", () => {
			const result = (
				service as unknown as Record<string, (v: string) => unknown>
			).parseCityCountry?.("Lahore, Pakistan") as { city: string; country: string };
			expect(result).toEqual({ city: "Lahore", country: "Pakistan" });
		});

		it("parses 'New York, USA' into city and country", () => {
			const result = (
				service as unknown as Record<string, (v: string) => unknown>
			).parseCityCountry?.("New York, USA") as { city: string; country: string };
			expect(result).toEqual({ city: "New York", country: "USA" });
		});

		it("passes city part through without alias expansion", () => {
			const result = (
				service as unknown as Record<string, (v: string) => unknown>
			).parseCityCountry?.("lhr, Pakistan") as { city: string; country: string };
			expect(result).toEqual({ city: "lhr", country: "Pakistan" });
		});

		it("returns null for empty string", () => {
			const result = (
				service as unknown as Record<string, (v: string) => unknown>
			).parseCityCountry?.("");
			expect(result).toBeNull();
		});

		it("returns null when city part is empty after trim", () => {
			const result = (
				service as unknown as Record<string, (v: string) => unknown>
			).parseCityCountry?.(", Pakistan");
			expect(result).toBeNull();
		});

		it("returns null when country part is empty", () => {
			const result = (
				service as unknown as Record<string, (v: string) => unknown>
			).parseCityCountry?.("Lahore, ");
			expect(result).toBeNull();
		});
	});

	describe("normalizeCityAlias", () => {
		it("resolves known alias 'lhr' to 'Lahore'", () => {
			expect(service.normalizeCityAlias("lhr")).toBe("Lahore");
		});

		it("resolves known alias 'isb' to 'Islamabad'", () => {
			expect(service.normalizeCityAlias("isb")).toBe("Islamabad");
		});

		it("resolves known alias 'khi' to 'Karachi'", () => {
			expect(service.normalizeCityAlias("khi")).toBe("Karachi");
		});

		it("returns unknown city name as-is", () => {
			expect(service.normalizeCityAlias("Berlin")).toBe("Berlin");
		});

		it("returns unrecognized abbreviation as-is", () => {
			expect(service.normalizeCityAlias("xyz")).toBe("xyz");
		});

		it("trims whitespace from input", () => {
			expect(service.normalizeCityAlias("  lhr  ")).toBe("Lahore");
		});
	});

	describe("resolveQuery", () => {
		it("CLI city option takes priority over stored config", async () => {
			configRepo.hasStoredLocation.mockReturnValue(true);
			configRepo.getStoredLocation.mockReturnValue({
				city: "Karachi",
				country: "Pakistan",
			});

			geocodingProvider.search = vi.fn().mockResolvedValue(sampleCityGuess);

			const query = await service.resolveQuery({
				city: "Lahore",
				allowInteractiveSetup: false,
			});

			expect(query.city).toBe("Lahore");
			expect(query.country).toBe("Pakistan");
			expect(query.latitude).toBe(sampleCityGuess.latitude);
			expect(query.longitude).toBe(sampleCityGuess.longitude);
		});

		it("falls back to stored config when no CLI city is provided", async () => {
			configRepo.hasStoredLocation.mockReturnValue(true);
			configRepo.getStoredLocation.mockReturnValue({
				city: "Karachi",
				country: "Pakistan",
			});

			const query = await service.resolveQuery({
				allowInteractiveSetup: false,
			});

			expect(query.address).toBe("Karachi, Pakistan");
			expect(query.city).toBe("Karachi");
			expect(query.country).toBe("Pakistan");
		});

		it("uses geocoding to resolve coordinates when city is provided without country", async () => {
			configRepo.hasStoredLocation.mockReturnValue(false);

			geocodingProvider.search = vi.fn().mockResolvedValue({
				city: "Lahore",
				country: "Pakistan",
				latitude: 31.5204,
				longitude: 74.3587,
				timezone: "Asia/Karachi",
			});

			const query = await service.resolveQuery({
				city: "Lahore",
				allowInteractiveSetup: false,
			});

			expect(geocodingProvider.search).toHaveBeenCalledWith("Lahore");
			expect(query.city).toBe("Lahore");
			expect(query.country).toBe("Pakistan");
			expect(query.latitude).toBe(31.5204);
			expect(query.longitude).toBe(74.3587);
		});

		it("resolves city alias before geocoding", async () => {
			configRepo.hasStoredLocation.mockReturnValue(false);

			geocodingProvider.search = vi.fn().mockResolvedValue({
				city: "Lahore",
				country: "Pakistan",
				latitude: 31.5204,
				longitude: 74.3587,
			});

			const query = await service.resolveQuery({
				city: "lhr",
				allowInteractiveSetup: false,
			});

			// The alias "lhr" should be normalized to "Lahore" before being passed to geocoding
			expect(geocodingProvider.search).toHaveBeenCalledWith("Lahore");
			expect(query.city).toBe("Lahore");
		});

		it("geocodes city,country format to obtain coordinates", async () => {
			geocodingProvider.search = vi.fn().mockResolvedValue({
				city: "Lahore",
				country: "Pakistan",
				latitude: 31.5204,
				longitude: 74.3587,
				timezone: "Asia/Karachi",
			});

			const query = await service.resolveQuery({
				city: "Lahore, Pakistan",
				allowInteractiveSetup: false,
			});

			expect(geocodingProvider.search).toHaveBeenCalledWith("Lahore, Pakistan");
			expect(query.city).toBe("Lahore");
			expect(query.country).toBe("Pakistan");
			expect(query.address).toBe("Lahore, Pakistan");
			expect(query.latitude).toBe(31.5204);
			expect(query.longitude).toBe(74.3587);
		});

		it("falls back to stored settings when geocoding returns null", async () => {
			configRepo.hasStoredLocation.mockReturnValue(false);
			geocodingProvider.search = vi.fn().mockResolvedValue(null);

			const query = await service.resolveQuery({
				city: "UnknownCity",
				allowInteractiveSetup: false,
			});

			expect(query.address).toBe("UnknownCity");
			expect(query.method).toBe(2);
			expect(query.school).toBe(0);
		});

		it("falls back to IP geolocation when no stored config and no city", async () => {
			configRepo.hasStoredLocation.mockReturnValue(false);
			geoProviderFactory.detect.mockResolvedValue(sampleGeoLocation);

			const query = await service.resolveQuery({
				allowInteractiveSetup: false,
			});

			expect(geoProviderFactory.detect).toHaveBeenCalled();
			expect(query.city).toBe("Lahore");
			expect(query.country).toBe("Pakistan");
			expect(configRepo.saveAutoDetectedSetup).toHaveBeenCalledWith(sampleGeoLocation);
		});

		it("throws error when no location can be determined", async () => {
			configRepo.hasStoredLocation.mockReturnValue(false);
			geoProviderFactory.detect.mockResolvedValue(null);

			await expect(
				service.resolveQuery({
					allowInteractiveSetup: false,
				}),
			).rejects.toThrow("Could not detect location");
		});

		it("uses stored coordinates when city and country are absent", async () => {
			configRepo.hasStoredLocation.mockReturnValue(true);
			configRepo.getStoredLocation.mockReturnValue({
				latitude: 31.5204,
				longitude: 74.3587,
			});

			const query = await service.resolveQuery({
				allowInteractiveSetup: false,
			});

			expect(query.latitude).toBe(31.5204);
			expect(query.longitude).toBe(74.3587);
			expect(query.address).toBe("31.5204, 74.3587");
		});

		it("includes timezone from stored settings when available", async () => {
			configRepo.hasStoredLocation.mockReturnValue(true);
			configRepo.getStoredLocation.mockReturnValue({
				city: "Lahore",
				country: "Pakistan",
			});
			configRepo.getStoredPrayerSettings.mockReturnValue({
				method: 1,
				school: 1,
				timezone: "Asia/Karachi",
			});

			const query = await service.resolveQuery({
				allowInteractiveSetup: false,
			});

			expect(query.timezone).toBe("Asia/Karachi");
		});

		it("invokes onSetupNeeded when interactive setup is allowed and no stored location", async () => {
			configRepo.hasStoredLocation.mockReturnValue(false);
			geoProviderFactory.detect.mockResolvedValue(sampleGeoLocation);

			const onSetupNeeded = vi.fn().mockResolvedValue(false);
			const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
				throw new Error("process.exit called");
			});

			await expect(
				service.resolveQuery({
					allowInteractiveSetup: true,
					onSetupNeeded,
				}),
			).rejects.toThrow("process.exit called");

			expect(onSetupNeeded).toHaveBeenCalled();
			exitSpy.mockRestore();
		});

		it("uses configured query after successful interactive setup", async () => {
			let setupCalled = false;
			configRepo.hasStoredLocation.mockImplementation(() => {
				// Return false on first call (before setup), true on subsequent calls
				if (!setupCalled) {
					return false;
				}
				return true;
			});
			configRepo.getStoredLocation.mockReturnValue({
				city: "Dubai",
				country: "United Arab Emirates",
			});

			const onSetupNeeded = vi.fn().mockImplementation(async () => {
				setupCalled = true;
				return true;
			});

			const query = await service.resolveQuery({
				allowInteractiveSetup: true,
				onSetupNeeded,
			});

			expect(onSetupNeeded).toHaveBeenCalled();
			expect(query.city).toBe("Dubai");
		});

		it("falls through to null when stored location has no city/country and no lat/lon", async () => {
			// First call: hasStoredLocation returns true, but location has neither
			// city+country nor latitude+longitude — exercises getStoredQuery line 138
			configRepo.hasStoredLocation.mockReturnValue(true);
			configRepo.getStoredLocation.mockReturnValue({});
			geoProviderFactory.detect.mockResolvedValue(sampleGeoLocation);

			const query = await service.resolveQuery({
				allowInteractiveSetup: false,
			});

			// Should fall through getStoredQuery() and reach the IP geolocation fallback
			expect(geoProviderFactory.detect).toHaveBeenCalled();
			expect(query.city).toBe("Lahore");
			expect(query.country).toBe("Pakistan");
		});

		it("parseCityCountry returns null when normalizeCityAlias returns empty string for city part", () => {
			// Test with ",  , Country" where first part after split is whitespace-only
			// normalizeCityAlias("  ") trims to "" which is falsy => returns null (lines 54-56)
			const result = (
				service as unknown as Record<string, (v: string) => unknown>
			).parseCityCountry?.("  , Pakistan");
			expect(result).toBeNull();
		});

		it("parseCityCountry returns null when country part is only whitespace", () => {
			// "Lahore,   " — country after join+trim is "" (lines 60-61)
			const result = (
				service as unknown as Record<string, (v: string) => unknown>
			).parseCityCountry?.("Lahore,   ");
			expect(result).toBeNull();
		});

		it("applies country-aware method and school for geocoded city", async () => {
			configRepo.hasStoredLocation.mockReturnValue(false);
			configRepo.shouldApplyRecommendedMethod.mockReturnValue(true);
			configRepo.shouldApplyRecommendedSchool.mockReturnValue(true);

			geocodingProvider.search = vi.fn().mockResolvedValue({
				city: "Lahore",
				country: "Pakistan",
				latitude: 31.5204,
				longitude: 74.3587,
				timezone: "Asia/Karachi",
			});

			const query = await service.resolveQuery({
				city: "Lahore",
				allowInteractiveSetup: false,
			});

			// Pakistan recommends method 1 (Karachi) and school 1 (Hanafi)
			expect(query.method).toBe(1);
			expect(query.school).toBe(1);
		});
	});
});
