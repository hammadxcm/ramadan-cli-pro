/**
 * @module formatters/plain
 * @description Plain-text formatter with no colors, suitable for piping and logging.
 */

import type { RamadanRow } from "../types/ramadan.js";
import type { FormatContext, IOutputFormatter } from "./formatter.interface.js";

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

		const title =
			output.mode === "all"
				? `Ramadan ${output.hijriYear} (All Days)`
				: output.mode === "number"
					? `Roza ${output.rows[0]?.roza ?? ""} Sehar/Iftar`
					: "Today Sehar/Iftar";

		lines.push("RAMADAN CLI");
		lines.push(`  ${title}`);
		lines.push(`  ${output.location}`);
		lines.push("");
		lines.push(this.formatTable(output.rows));
		lines.push("");

		if (highlight) {
			lines.push(`  Status: ${highlight.current}`);
			lines.push(`  Up next: ${highlight.next} in ${highlight.countdown}`);
			lines.push("");
		}

		lines.push("  Sehar uses Fajr. Iftar uses Maghrib.");
		lines.push("");

		return lines.join("\n");
	}

	private formatTable(rows: ReadonlyArray<RamadanRow>): string {
		const headers = ["Roza", "Sehar", "Iftar", "Date", "Hijri"];
		const widths = [6, 8, 8, 14, 20] as const;
		const pad = (value: string, index: number): string =>
			value.padEnd(widths[index] ?? value.length);
		const line = (columns: ReadonlyArray<string>): string =>
			columns.map((column, index) => pad(column, index)).join("  ");
		const divider = "-".repeat(line(headers).length);

		const lines: Array<string> = [];
		lines.push(`  ${line(headers)}`);
		lines.push(`  ${divider}`);

		for (const row of rows) {
			lines.push(`  ${line([String(row.roza), row.sehar, row.iftar, row.date, row.hijri])}`);
		}

		return lines.join("\n");
	}
}
