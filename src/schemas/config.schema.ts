/**
 * @module schemas/config
 * @description Zod schemas for validating configuration values, including
 * the persisted config store and individual field constraints.
 */

import { z } from "zod";

/**
 * Validates the full persisted configuration object.
 * @see {@link import("../types/config.js").RamadanConfigStore}
 */
export const SharedConfigSchema = z.object({
	latitude: z.number().optional(),
	longitude: z.number().optional(),
	city: z.string().optional(),
	country: z.string().optional(),
	method: z.number().optional(),
	school: z.number().optional(),
	timezone: z.string().optional(),
	firstRozaDate: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.optional(),
	format24h: z.boolean().optional(),
	locale: z.string().optional(),
	notificationsEnabled: z.boolean().optional(),
	notifySehar: z.boolean().optional(),
	notifyIftar: z.boolean().optional(),
	notifyMinutesBefore: z.number().int().min(1).max(120).optional(),
	theme: z.string().optional(),
});

/**
 * Validates an ISO 8601 date string in `YYYY-MM-DD` format.
 */
export const IsoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

/**
 * Validates and coerces a calculation method ID (integer 0–23).
 */
export const MethodSchema = z.coerce.number().int().min(0).max(23);

/**
 * Validates and coerces a juristic school ID (0 = Shafi, 1 = Hanafi).
 */
export const SchoolSchema = z.coerce.number().int().min(0).max(1);

/**
 * Validates and coerces a latitude value in the range \[-90, 90\].
 */
export const LatitudeSchema = z.coerce.number().min(-90).max(90);

/**
 * Validates and coerces a longitude value in the range \[-180, 180\].
 */
export const LongitudeSchema = z.coerce.number().min(-180).max(180);
