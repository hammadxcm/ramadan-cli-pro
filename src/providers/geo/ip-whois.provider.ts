/**
 * @module providers/geo/ip-whois
 * @description IP geolocation provider using the ipwho.is service (priority 3).
 */

import { IpWhoisSchema } from "../../schemas/geo.schema.js";
import type { GeoLocation } from "../../types/geo.js";
import type { IGeoProvider } from "./geo-provider.interface.js";

/**
 * Geolocates the user via the ipwho.is JSON endpoint.
 * Used as a last-resort fallback provider.
 */
export class IpWhoisProvider implements IGeoProvider {
	readonly name = "ip-whois";
	readonly priority = 3;

	/**
	 * Queries ipwho.is and returns the parsed location.
	 *
	 * @returns The detected location, or `null` on failure.
	 */
	async detect(): Promise<GeoLocation | null> {
		try {
			const response = await fetch("https://ipwho.is/");
			const json = (await response.json()) as unknown;
			const parsed = IpWhoisSchema.safeParse(json);
			if (!parsed.success) {
				return null;
			}
			if (!parsed.data.success) {
				return null;
			}
			return {
				city: parsed.data.city,
				country: parsed.data.country,
				latitude: parsed.data.latitude,
				longitude: parsed.data.longitude,
				timezone: parsed.data.timezone?.id ?? "",
			};
		} catch {
			return null;
		}
	}
}
