/**
 * @module schemas/geo
 * @description Zod schemas for validating responses from IP geolocation
 * and geocoding provider APIs.
 */

import { z } from "zod";

/**
 * Validates responses from the ip-api.com provider.
 * @see {@link import("../providers/geo/ip-api.provider.js").IpApiProvider}
 */
export const IpApiSchema = z.object({
	city: z.string(),
	country: z.string(),
	lat: z.number(),
	lon: z.number(),
	timezone: z.string().optional(),
});

/**
 * Validates responses from the ipapi.co provider.
 * @see {@link import("../providers/geo/ipapi-co.provider.js").IpapiCoProvider}
 */
export const IpapiCoSchema = z.object({
	city: z.string(),
	country_name: z.string(),
	latitude: z.number(),
	longitude: z.number(),
	timezone: z.string().optional(),
});

/**
 * Validates responses from the ipwhois.io provider.
 * @see {@link import("../providers/geo/ip-whois.provider.js").IpWhoisProvider}
 */
export const IpWhoisSchema = z.object({
	success: z.boolean(),
	city: z.string(),
	country: z.string(),
	latitude: z.number(),
	longitude: z.number(),
	timezone: z
		.object({
			id: z.string().optional(),
		})
		.optional(),
});

/**
 * Validates responses from the Open-Meteo geocoding search API.
 * @see {@link import("../providers/geocoding/open-meteo.provider.js").OpenMeteoProvider}
 */
export const OpenMeteoSearchSchema = z.object({
	results: z
		.array(
			z.object({
				name: z.string(),
				country: z.string(),
				latitude: z.number(),
				longitude: z.number(),
				timezone: z.string().optional(),
			}),
		)
		.optional(),
});
