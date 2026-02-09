/**
 * @module providers/geocoding/geocoding
 * @description Interface for geocoding providers that resolve city names to coordinates.
 */

import type { CityCountryGuess } from "../../types/geo.js";

/**
 * Contract for a geocoding provider that converts a city/address query
 * into geographic coordinates.
 */
export interface IGeocodingProvider {
	/**
	 * Searches for a city by name and returns the best match.
	 *
	 * @param query - City name or address to geocode.
	 * @returns The best matching location, or `null` if no results.
	 */
	search(query: string): Promise<CityCountryGuess | null>;
}
