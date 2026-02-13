/**
 * @module formatters/formatter
 * @description Shared interface and context type for all output formatters.
 */

import type { HighlightState, RamadanOutput, RowAnnotationKind } from "../types/ramadan.js";

/**
 * Context object passed to every output formatter.
 */
export interface FormatContext {
	/** The Ramadan output data to format. */
	readonly output: RamadanOutput;
	/** Current highlight state (may be `null` outside Ramadan or if data is unavailable). */
	readonly highlight: HighlightState | null;
	/** Optional per-row annotations (current/next markers) for the "all days" view. */
	readonly rowAnnotations?: Readonly<Record<number, RowAnnotationKind>> | undefined;
	/** If `true`, suppress colors and decorations. */
	readonly plain?: boolean | undefined;
}

/**
 * Contract for an output formatter that renders {@link RamadanOutput} to a string.
 */
export interface IOutputFormatter {
	/** Formatter identifier (e.g. `"table"`, `"json"`, `"plain"`). */
	readonly name: string;
	/**
	 * Renders the Ramadan output to a formatted string.
	 *
	 * @param ctx - The formatting context.
	 * @returns The formatted output string.
	 */
	format(ctx: FormatContext): string;
}
