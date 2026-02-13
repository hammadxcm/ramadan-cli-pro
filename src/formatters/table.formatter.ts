/**
 * @module formatters/table
 * @description Colorized table formatter for terminal output with row annotations.
 */

import pc from "picocolors";
import type { RamadanRow, RowAnnotationKind } from "../types/ramadan.js";
import { getBanner } from "../ui/banner.js";
import { ramadanGreen } from "../ui/theme.js";
import type { FormatContext, IOutputFormatter } from "./formatter.interface.js";

const formatRowAnnotation = (kind: RowAnnotationKind): string => {
	if (kind === "current") {
		return pc.green("\u2190 current");
	}
	return pc.yellow("\u2190 next");
};

/**
 * Renders the Ramadan timetable as a colorized ASCII table with banner,
 * location, highlight status, and optional row annotations.
 */
export class TableFormatter implements IOutputFormatter {
	readonly name = "table";

	/**
	 * Formats the Ramadan output as a colorized table.
	 *
	 * @param ctx - The formatting context.
	 * @returns The formatted table string.
	 */
	format(ctx: FormatContext): string {
		const lines: Array<string> = [];
		const { output, highlight, rowAnnotations = {}, plain } = ctx;

		const title =
			output.mode === "all"
				? `Ramadan ${output.hijriYear} (All Days)`
				: output.mode === "number"
					? `Roza ${output.rows[0]?.roza ?? ""} Sehar/Iftar`
					: "Today Sehar/Iftar";

		lines.push(plain ? "RAMADAN CLI" : getBanner());
		lines.push(ramadanGreen(`  ${title}`));
		lines.push(pc.dim(`  \u{1F4CD} ${output.location}`));
		lines.push("");
		lines.push(this.formatTable(output.rows, rowAnnotations));
		lines.push("");

		if (highlight) {
			lines.push(`  ${ramadanGreen("Status:")} ${pc.white(highlight.current)}`);
			lines.push(
				`  ${ramadanGreen("Up next:")} ${pc.white(highlight.next)} in ${pc.yellow(highlight.countdown)}`,
			);
			lines.push("");
		}

		lines.push(pc.dim("  Sehar uses Fajr. Iftar uses Maghrib."));
		lines.push("");

		return lines.join("\n");
	}

	private formatTable(
		rows: ReadonlyArray<RamadanRow>,
		rowAnnotations: Readonly<Record<number, RowAnnotationKind>>,
	): string {
		const headers = ["Roza", "Sehar", "Iftar", "Date", "Hijri"];
		const widths = [6, 8, 8, 14, 20] as const;
		const pad = (value: string, index: number): string =>
			value.padEnd(widths[index] ?? value.length);
		const line = (columns: ReadonlyArray<string>): string =>
			columns.map((column, index) => pad(column, index)).join("  ");
		const divider = "-".repeat(line(headers).length);

		const lines: Array<string> = [];
		lines.push(pc.dim(`  ${line(headers)}`));
		lines.push(pc.dim(`  ${divider}`));

		for (const row of rows) {
			const rowLine = line([String(row.roza), row.sehar, row.iftar, row.date, row.hijri]);
			const annotation = rowAnnotations[row.roza];
			if (!annotation) {
				lines.push(`  ${rowLine}`);
			} else {
				lines.push(`  ${rowLine}  ${formatRowAnnotation(annotation)}`);
			}
		}

		return lines.join("\n");
	}
}
