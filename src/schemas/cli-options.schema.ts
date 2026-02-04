/**
 * @module schemas/cli-options
 * @description Zod schemas for validating CLI command options parsed from argv.
 */

import { z } from "zod";

/**
 * Validates the options passed to the main `ramadan` command.
 * @see {@link import("../types/command.js").CommandContext}
 */
export const RamadanCommandOptionsSchema = z.object({
	city: z.string().optional(),
	all: z.boolean().optional(),
	rozaNumber: z.number().int().min(1).max(30).optional(),
	plain: z.boolean().optional(),
	json: z.boolean().optional(),
	status: z.boolean().optional(),
	tui: z.boolean().optional(),
	locale: z.string().optional(),
	firstRozaDate: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.optional(),
	clearFirstRozaDate: z.boolean().optional(),
});

/**
 * Validates the options passed to the `config` subcommand.
 */
export const ConfigCommandOptionsSchema = z.object({
	city: z.string().optional(),
	country: z.string().optional(),
	latitude: z.string().optional(),
	longitude: z.string().optional(),
	method: z.string().optional(),
	school: z.string().optional(),
	timezone: z.string().optional(),
	show: z.boolean().optional(),
	clear: z.boolean().optional(),
});
