/**
 * @module providers/geo/ipapi-co
 * @description IP geolocation provider using the ipapi.co service (priority 2).
 */

import { IpapiCoSchema } from "../../schemas/geo.schema.js";
import type { GeoLocation } from "../../types/geo.js";
import type { IGeoProvider } from "./geo-provider.interface.js";

/**
 * Geolocates the user via the ipapi.co JSON endpoint.
 * Used as a fallback when ip-api.com fails.
 */
export class IpapiCoProvider implements IGeoProvider {
	readonly name = "ipapi-co";
	readonly priority = 2;

	/**
	 * Queries ipapi.co and returns the parsed location.
	 *
	 * @returns The detected location, or `null` on failure.
	 */
	async detect(): Promise<GeoLocation | null> {
		try {
			const response = await fetch("https://ipapi.co/json/");
			const json = (await response.json()) as unknown;
			const parsed = IpapiCoSchema.safeParse(json);
			if (!parsed.success) {
				return null;
			}
			return {
				city: parsed.data.city,
				country: parsed.data.country_name,
				latitude: parsed.data.latitude,
				longitude: parsed.data.longitude,
				timezone: parsed.data.timezone ?? "",
			};
		} catch {
			return null;
		}
	}
}
