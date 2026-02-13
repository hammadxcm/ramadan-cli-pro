/**
 * @module formatters/json
 * @description JSON output formatter for machine-readable consumption.
 */

import type { FormatContext, IOutputFormatter } from "./formatter.interface.js";

/**
 * Renders the Ramadan output as pretty-printed JSON.
 */
export class JsonFormatter implements IOutputFormatter {
	readonly name = "json";

	/**
	 * Formats the output as indented JSON.
	 *
	 * @param ctx - The formatting context.
	 * @returns A JSON string.
	 */
	format(ctx: FormatContext): string {
		return JSON.stringify(ctx.output, null, 2);
	}
}
