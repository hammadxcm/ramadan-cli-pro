/**
 * @module providers/geo/ip-api
 * @description IP geolocation provider using the ip-api.com service (priority 1).
 */

import { IpApiSchema } from "../../schemas/geo.schema.js";
import type { GeoLocation } from "../../types/geo.js";
import type { IGeoProvider } from "./geo-provider.interface.js";

/**
 * Geolocates the user via the free ip-api.com JSON endpoint.
 * This is the highest-priority (first-tried) provider.
 */
export class IpApiProvider implements IGeoProvider {
	readonly name = "ip-api";
	readonly priority = 1;

	/**
	 * Queries ip-api.com and returns the parsed location.
	 *
	 * @returns The detected location, or `null` on failure.
	 */
	async detect(): Promise<GeoLocation | null> {
		try {
			const response = await fetch("http://ip-api.com/json/?fields=city,country,lat,lon,timezone");
			const json = (await response.json()) as unknown;
			const parsed = IpApiSchema.safeParse(json);
			if (!parsed.success) {
				return null;
			}
			return {
				city: parsed.data.city,
				country: parsed.data.country,
				latitude: parsed.data.lat,
				longitude: parsed.data.lon,
				timezone: parsed.data.timezone ?? "",
			};
		} catch {
			return null;
		}
	}
}
