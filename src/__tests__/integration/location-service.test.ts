import { beforeEach, describe, expect, it, vi } from "vitest";
import { GeoProviderFactory } from "../../providers/geo/geo-provider.factory.js";
import type { ConfigRepository } from "../../repositories/config.repository.js";
import { LocationService } from "../../services/location.service.js";
import { sampleCityGuess, sampleGeoLocation } from "../helpers/fixtures.js";
import {
	createMockConfigRepository,
	createMockGeoProvider,
	createMockGeocodingProvider,
} from "../helpers/mocks.js";

describe("LocationService + ConfigRepository + GeoProviders", () => {
	const mockConfigRepo = createMockConfigRepository();

	beforeEach(() => {
		vi.clearAllMocks();
		mockConfigRepo.getStoredPrayerSettings.mockReturnValue({ method: 2, school: 0 });
	});

	it("resolves from stored config when available", async () => {
		mockConfigRepo.hasStoredLocation.mockReturnValue(true);
		mockConfigRepo.getStoredLocation.mockReturnValue({
			city: "Lahore",
			country: "Pakistan",
			latitude: 31.52,
			longitude: 74.36,
		});

		const geoFactory = new GeoProviderFactory([]);
		const geocoding = createMockGeocodingProvider();
		const service = new LocationService(
			mockConfigRepo as unknown as ConfigRepository,
			geoFactory,
			geocoding,
		);

		const query = await service.resolveQuery({ allowInteractiveSetup: false });

		expect(query.address).toBe("Lahore, Pakistan");
		expect(query.city).toBe("Lahore");
		expect(query.country).toBe("Pakistan");
		expect(query.method).toBe(2);
		expect(query.school).toBe(0);
	});

	it("resolves from city input with geocoding", async () => {
		mockConfigRepo.hasStoredLocation.mockReturnValue(false);
		const geocoding = createMockGeocodingProvider(sampleCityGuess);
		const geoFactory = new GeoProviderFactory([]);
		const service = new LocationService(
			mockConfigRepo as unknown as ConfigRepository,
			geoFactory,
			geocoding,
		);

		const query = await service.resolveQuery({
			city: "Lahore",
			allowInteractiveSetup: false,
		});

		expect(query.address).toBe("Lahore, Pakistan");
		expect(query.latitude).toBe(31.5204);
		expect(query.longitude).toBe(74.3587);
	});

	it("resolves city alias (sf -> San Francisco)", async () => {
		const geocoding = createMockGeocodingProvider({
			city: "San Francisco",
			country: "United States",
			latitude: 37.77,
			longitude: -122.42,
			timezone: "America/Los_Angeles",
		});
		const geoFactory = new GeoProviderFactory([]);
		const service = new LocationService(
			mockConfigRepo as unknown as ConfigRepository,
			geoFactory,
			geocoding,
		);

		const query = await service.resolveQuery({
			city: "sf",
			allowInteractiveSetup: false,
		});

		expect(geocoding.search).toHaveBeenCalledWith("San Francisco");
	});

	it("falls back to geo-IP detection when no stored config and no city", async () => {
		mockConfigRepo.hasStoredLocation.mockReturnValue(false);
		const provider = createMockGeoProvider("ip-api", sampleGeoLocation);
		const geoFactory = new GeoProviderFactory([provider]);
		const geocoding = createMockGeocodingProvider();
		const service = new LocationService(
			mockConfigRepo as unknown as ConfigRepository,
			geoFactory,
			geocoding,
		);

		const query = await service.resolveQuery({ allowInteractiveSetup: false });

		expect(provider.detect).toHaveBeenCalled();
		expect(mockConfigRepo.saveAutoDetectedSetup).toHaveBeenCalledWith(sampleGeoLocation);
		expect(query.city).toBe("Lahore");
	});

	it("tries multiple geo providers in priority order", async () => {
		mockConfigRepo.hasStoredLocation.mockReturnValue(false);
		const failProvider = createMockGeoProvider("failing", null);
		const successProvider = createMockGeoProvider("working", sampleGeoLocation);
		const geoFactory = new GeoProviderFactory([failProvider, successProvider]);
		const geocoding = createMockGeocodingProvider();
		const service = new LocationService(
			mockConfigRepo as unknown as ConfigRepository,
			geoFactory,
			geocoding,
		);

		const query = await service.resolveQuery({ allowInteractiveSetup: false });

		expect(failProvider.detect).toHaveBeenCalled();
		expect(successProvider.detect).toHaveBeenCalled();
		expect(query.city).toBe("Lahore");
	});

	it("throws when all detection methods fail", async () => {
		mockConfigRepo.hasStoredLocation.mockReturnValue(false);
		const geoFactory = new GeoProviderFactory([]);
		const geocoding = createMockGeocodingProvider();
		const service = new LocationService(
			mockConfigRepo as unknown as ConfigRepository,
			geoFactory,
			geocoding,
		);

		await expect(service.resolveQuery({ allowInteractiveSetup: false })).rejects.toThrow(
			"Could not detect location",
		);
	});

	it("resolves city,country format without geocoding", async () => {
		const geocoding = createMockGeocodingProvider();
		const geoFactory = new GeoProviderFactory([]);
		const service = new LocationService(
			mockConfigRepo as unknown as ConfigRepository,
			geoFactory,
			geocoding,
		);

		const query = await service.resolveQuery({
			city: "Lahore, Pakistan",
			allowInteractiveSetup: false,
		});

		expect(geocoding.search).not.toHaveBeenCalled();
		expect(query.city).toBe("Lahore");
		expect(query.country).toBe("Pakistan");
	});
});
