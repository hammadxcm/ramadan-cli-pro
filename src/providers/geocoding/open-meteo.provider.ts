/**
 * @module providers/geocoding/open-meteo
 * @description Geocoding provider using the Open-Meteo geocoding API
 * to resolve city names to coordinates.
 */

import { OpenMeteoSearchSchema } from "../../schemas/geo.schema.js";
import type { CityCountryGuess } from "../../types/geo.js";
import type { IGeocodingProvider } from "./geocoding.interface.js";

/**
 * Resolves city names to geographic coordinates via the Open-Meteo geocoding API.
 *
 * @example
 * ```ts
 * const provider = new OpenMeteoProvider();
 * const result = await provider.search("Karachi");
 * // { city: "Karachi", country: "Pakistan", latitude: 24.86, longitude: 67.0 }
 * ```
 */
export class OpenMeteoProvider implements IGeocodingProvider {
	/**
	 * Searches the Open-Meteo geocoding API for the given query.
	 *
	 * @param query - City name or address to geocode.
	 * @returns The best matching location, or `null` if no results or on error.
	 */
	async search(query: string): Promise<CityCountryGuess | null> {
		const trimmedQuery = query.trim();
		if (!trimmedQuery) {
			return null;
		}

		try {
			const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
			url.searchParams.set("name", trimmedQuery);
			url.searchParams.set("count", "1");
			url.searchParams.set("language", "en");
			url.searchParams.set("format", "json");

			const response = await fetch(url.toString());
			const json = (await response.json()) as unknown;
			const parsed = OpenMeteoSearchSchema.safeParse(json);
			if (!parsed.success) {
				return null;
			}

			const result = parsed.data.results?.[0];
			if (!result) {
				return null;
			}

			return {
				city: result.name,
				country: result.country,
				latitude: result.latitude,
				longitude: result.longitude,
				...(result.timezone ? { timezone: result.timezone } : {}),
			};
		} catch {
			return null;
		}
	}
}
