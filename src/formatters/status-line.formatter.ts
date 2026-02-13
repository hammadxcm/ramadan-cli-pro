/**
 * @module formatters/status-line
 * @description Minimal single-line formatter for status bar integrations
 * (e.g. tmux, polybar).
 */

import type { FormatContext, IOutputFormatter } from "./formatter.interface.js";

/**
 * Renders a single-line countdown string suitable for status bars.
 * Returns an empty string if no highlight state is available.
 */
export class StatusLineFormatter implements IOutputFormatter {
	readonly name = "status-line";

	/**
	 * Formats the output as a single status line.
	 *
	 * @param ctx - The formatting context.
	 * @returns A concise countdown string (e.g. `"Iftar in 2h 15m"`) or `""`.
	 */
	format(ctx: FormatContext): string {
		if (!ctx.highlight) {
			return "";
		}

		const label = (() => {
			switch (ctx.highlight.next) {
				case "First Sehar":
				case "Next day Sehar":
					return "Sehar";
				case "Roza starts (Fajr)":
					return "Fast starts";
				default:
					return ctx.highlight.next;
			}
		})();

		return `${label} in ${ctx.highlight.countdown}`;
	}
}
