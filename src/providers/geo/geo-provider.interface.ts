/**
 * @module providers/geo/geo-provider
 * @description Interface for IP-based geolocation providers.
 */

import type { GeoLocation } from "../../types/geo.js";

/**
 * Contract for an IP-based geolocation provider.
 * Implementations query an external service to determine the user's location.
 */
export interface IGeoProvider {
	/** Human-readable provider name (e.g. `"ip-api"`). */
	readonly name: string;
	/** Priority order — lower numbers are tried first. */
	readonly priority: number;
	/**
	 * Attempts to detect the user's geographic location via IP lookup.
	 *
	 * @returns The detected location, or `null` if detection failed.
	 */
	detect(): Promise<GeoLocation | null>;
}
