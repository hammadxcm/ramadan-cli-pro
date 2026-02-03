/**
 * @module errors/geo
 * @description Error classes for geolocation failures.
 */

import { AppError } from "./base.error.js";

/**
 * Thrown when geographic location detection fails entirely.
 *
 * @example
 * ```ts
 * throw new GeoLocationError("Could not determine your location");
 * ```
 */
export class GeoLocationError extends AppError {
	/**
	 * @param message - Description of the geolocation failure.
	 */
	constructor(message: string) {
		super(message, "GEO_LOCATION_ERROR");
		this.name = "GeoLocationError";
	}
}

/**
 * Thrown when a specific geo provider (e.g. ip-api, ipapi.co) fails.
 *
 * @example
 * ```ts
 * throw new GeoProviderError("Rate limited", "ip-api");
 * ```
 */
export class GeoProviderError extends AppError {
	/** Name of the provider that failed (e.g. `"ip-api"`, `"ipapi.co"`). */
	readonly providerName: string;

	/**
	 * @param message - Description of the provider failure.
	 * @param providerName - Identifier of the failing provider.
	 */
	constructor(message: string, providerName: string) {
		super(message, "GEO_PROVIDER_ERROR");
		this.name = "GeoProviderError";
		this.providerName = providerName;
	}
}
