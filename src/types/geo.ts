/**
 * @module types/geo
 * @description Geographic location types used throughout the application
 * for IP-based geolocation and geocoding results.
 */

/**
 * A fully-resolved geographic location with all required fields.
 * Produced after successful IP geolocation or geocoding lookup.
 */
export interface GeoLocation {
	/** City name, e.g. `"Karachi"`. */
	readonly city: string;
	/** Country name, e.g. `"Pakistan"`. */
	readonly country: string;
	/** Geographic latitude in decimal degrees. */
	readonly latitude: number;
	/** Geographic longitude in decimal degrees. */
	readonly longitude: number;
	/** IANA timezone identifier, e.g. `"Asia/Karachi"`. */
	readonly timezone: string;
}

/**
 * A best-effort city/country guess from geocoding, where timezone may be absent.
 * Used as an intermediate result before full location resolution.
 */
export interface CityCountryGuess {
	/** City name, e.g. `"Karachi"`. */
	readonly city: string;
	/** Country name, e.g. `"Pakistan"`. */
	readonly country: string;
	/** Geographic latitude in decimal degrees. */
	readonly latitude: number;
	/** Geographic longitude in decimal degrees. */
	readonly longitude: number;
	/** IANA timezone identifier, if available. */
	readonly timezone?: string | undefined;
}
