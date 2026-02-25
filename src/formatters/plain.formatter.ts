/**
 * @module formatters/plain
 * @description Plain-text formatter with no colors, suitable for piping and logging.
 */

import type { RamadanRow } from "../types/ramadan.js";
import type { FormatContext, IOutputFormatter } from "./formatter.interface.js";
import {
	TABLE_HEADERS,
	formatRowLine,
	getFooterNote,
	getFormatterTitle,
	getHighlightInLabel,
	getHighlightStatusLabel,
	getHighlightUpNextLabel,
	getTableDivider,
	getTableHeaders,
	rowToColumns,
	translateHighlightString,
} from "./formatter.utils.js";

/**
 * Renders the Ramadan timetable as plain text without any ANSI color codes.
 */
export class PlainFormatter implements IOutputFormatter {
	readonly name = "plain";

	/**
	 * Formats the output as plain text.
	 *
	 * @param ctx - The formatting context.
	 * @returns A plain-text string.
	 */
	format(ctx: FormatContext): string {
		const lines: Array<string> = [];
		const { output, highlight } = ctx;

		const title = getFormatterTitle(output);

		lines.push("RAMADAN CLI");
		lines.push(`  ${title}`);
		lines.push(`  ${output.location}`);
		lines.push("");
		lines.push(this.formatTable(output.rows));
		lines.push("");

		if (highlight) {
			lines.push(`  ${getHighlightStatusLabel()} ${translateHighlightString(highlight.current)}`);
			lines.push(
				`  ${getHighlightUpNextLabel()} ${translateHighlightString(highlight.next)} ${getHighlightInLabel()} ${highlight.countdown}`,
			);
			lines.push("");
		}

		lines.push(`  ${getFooterNote()}`);
		lines.push("");

		return lines.join("\n");
	}

	private formatTable(rows: ReadonlyArray<RamadanRow>): string {
		const divider = getTableDivider();

		const lines: Array<string> = [];
		const headers = getTableHeaders();
		lines.push(`  ${formatRowLine([...headers])}`);
		lines.push(`  ${divider}`);

		for (const row of rows) {
			lines.push(`  ${formatRowLine([...rowToColumns(row)])}`);
		}

		return lines.join("\n");
	}
}
