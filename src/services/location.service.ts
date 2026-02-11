/**
 * @module services/location
 * @description Resolves the user's location into a {@link RamadanQuery} through
 * a multi-step strategy: CLI city flag → stored config → interactive setup →
 * IP geolocation fallback.
 */

import { normalizeCityAlias } from "../data/city-aliases.js";
import { getRecommendedMethod, getRecommendedSchool } from "../data/recommendations.js";
import type { GeoProviderFactory } from "../providers/geo/geo-provider.factory.js";
import type { IGeocodingProvider } from "../providers/geocoding/geocoding.interface.js";
import type { ConfigRepository } from "../repositories/config.repository.js";
import type { GeoLocation } from "../types/geo.js";
import type { RamadanQuery } from "../types/ramadan.js";
import { normalize } from "../utils/string.js";

/**
 * Orchestrates location resolution from multiple sources and builds
 * a fully-populated {@link RamadanQuery}.
 */
export class LocationService {
	/**
	 * @param configRepository - For reading stored location and settings.
	 * @param geoProviderFactory - For IP-based geolocation fallback.
	 * @param geocodingProvider - For resolving city names to coordinates.
	 */
	constructor(
		private readonly configRepository: ConfigRepository,
		private readonly geoProviderFactory: GeoProviderFactory,
		private readonly geocodingProvider: IGeocodingProvider,
	) {}

	/**
	 * Resolves a city alias to its full name.
	 *
	 * @param city - City name or abbreviation.
	 * @returns The resolved city name.
	 */
	normalizeCityAlias(city: string): string {
		return normalizeCityAlias(city);
	}

	private parseCityCountry(value: string): Readonly<{ city: string; country: string }> | null {
		const parts = value
			.split(",")
			.map((part) => part.trim())
			.filter(Boolean);

		if (parts.length < 2) {
			return null;
		}

		const city = normalizeCityAlias(parts[0] ?? "");
		if (!city) {
			return null;
		}

		const country = parts.slice(1).join(", ").trim();
		if (!country) {
			return null;
		}

		return { city, country };
	}

	private withStoredSettings(
		query: Omit<RamadanQuery, "method" | "school" | "timezone">,
	): RamadanQuery {
		const settings = this.configRepository.getStoredPrayerSettings();
		const withMethodSchool: RamadanQuery = {
			...query,
			method: settings.method,
			school: settings.school,
		};

		if (!settings.timezone) {
			return withMethodSchool;
		}

		return { ...withMethodSchool, timezone: settings.timezone };
	}

	private withCountryAwareSettings(
		query: Omit<RamadanQuery, "method" | "school" | "timezone">,
		country: string,
		cityTimezone?: string,
	): RamadanQuery {
		const settings = this.configRepository.getStoredPrayerSettings();

		let method = settings.method;
		const recommendedMethod = getRecommendedMethod(country);
		if (
			recommendedMethod !== null &&
			this.configRepository.shouldApplyRecommendedMethod(settings.method, recommendedMethod)
		) {
			method = recommendedMethod;
		}

		let school = settings.school;
		const recommendedSchool = getRecommendedSchool(country);
		if (this.configRepository.shouldApplyRecommendedSchool(settings.school, recommendedSchool)) {
			school = recommendedSchool;
		}

		const timezone = cityTimezone ?? settings.timezone;
		return {
			...query,
			method,
			school,
			...(timezone ? { timezone } : {}),
		};
	}

	private getStoredQuery(): RamadanQuery | null {
		if (!this.configRepository.hasStoredLocation()) {
			return null;
		}

		const location = this.configRepository.getStoredLocation();
		if (location.city && location.country) {
			return this.withStoredSettings({
				address: `${location.city}, ${location.country}`,
				city: location.city,
				country: location.country,
				...(location.latitude !== undefined ? { latitude: location.latitude } : {}),
				...(location.longitude !== undefined ? { longitude: location.longitude } : {}),
			});
		}

		if (location.latitude !== undefined && location.longitude !== undefined) {
			return this.withStoredSettings({
				address: `${location.latitude}, ${location.longitude}`,
				latitude: location.latitude,
				longitude: location.longitude,
			});
		}

		return null;
	}

	private async resolveFromCityInput(city: string): Promise<RamadanQuery> {
		const normalizedInput = normalizeCityAlias(city);
		const parsed = this.parseCityCountry(normalizedInput);
		if (parsed) {
			return this.withCountryAwareSettings(
				{
					address: `${parsed.city}, ${parsed.country}`,
					city: parsed.city,
					country: parsed.country,
				},
				parsed.country,
			);
		}

		const guessed = await this.geocodingProvider.search(normalizedInput);
		if (!guessed) {
			return this.withStoredSettings({ address: normalizedInput });
		}

		return this.withCountryAwareSettings(
			{
				address: `${guessed.city}, ${guessed.country}`,
				city: guessed.city,
				country: guessed.country,
				latitude: guessed.latitude,
				longitude: guessed.longitude,
			},
			guessed.country,
			guessed.timezone,
		);
	}

	/**
	 * Resolves a {@link RamadanQuery} using the best available location source.
	 *
	 * Resolution order:
	 * 1. CLI `--city` flag (geocoded if needed)
	 * 2. Stored configuration
	 * 3. Interactive first-run setup (if allowed)
	 * 4. IP geolocation fallback
	 *
	 * @param options - Resolution options.
	 * @param options.city - Explicit city from the CLI flag.
	 * @param options.allowInteractiveSetup - Whether to trigger first-run setup.
	 * @param options.onSetupNeeded - Callback invoked when interactive setup is required.
	 * @returns A fully-populated Ramadan query.
	 * @throws {Error} If no location can be determined.
	 */
	async resolveQuery(options: {
		city?: string | undefined;
		allowInteractiveSetup: boolean;
		onSetupNeeded?: (() => Promise<boolean>) | undefined;
	}): Promise<RamadanQuery> {
		if (options.city) {
			return this.resolveFromCityInput(options.city);
		}

		const storedQuery = this.getStoredQuery();
		if (storedQuery) {
			return storedQuery;
		}

		if (options.allowInteractiveSetup && options.onSetupNeeded) {
			const configured = await options.onSetupNeeded();
			if (!configured) {
				process.exit(0);
			}

			const configuredQuery = this.getStoredQuery();
			if (configuredQuery) {
				return configuredQuery;
			}
		}

		const guessed = await this.geoProviderFactory.detect();
		if (!guessed) {
			throw new Error('Could not detect location. Pass a city like `ramadan-cli-pro "Lahore"`.');
		}

		this.configRepository.saveAutoDetectedSetup(guessed);

		return this.withStoredSettings({
			address: `${guessed.city}, ${guessed.country}`,
			city: guessed.city,
			country: guessed.country,
			latitude: guessed.latitude,
			longitude: guessed.longitude,
		});
	}
}
