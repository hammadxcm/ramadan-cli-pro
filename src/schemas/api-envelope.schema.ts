/**
 * @module schemas/api-envelope
 * @description Zod schema for the top-level Aladhan API response envelope
 * that wraps all endpoint responses.
 */

import { z } from "zod";

/**
 * Validates the outer envelope of every Aladhan API response.
 * The `data` field is left as `z.unknown()` and parsed separately
 * with an endpoint-specific schema.
 */
export const ApiEnvelopeSchema = z.object({
	code: z.number(),
	status: z.string(),
	data: z.unknown(),
});
