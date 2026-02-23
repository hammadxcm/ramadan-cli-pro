/**
 * @module formatters/table
 * @description Colorized table formatter for terminal output with row annotations.
 */

import pc from "picocolors";
import type { RamadanRow, RowAnnotationKind } from "../types/ramadan.js";
import { getBanner } from "../ui/banner.js";
import { ramadanGreen } from "../ui/theme.js";
import type { FormatContext, IOutputFormatter } from "./formatter.interface.js";
import {
	TABLE_HEADERS,
	formatRowLine,
	getFormatterTitle,
	getTableDivider,
	rowToColumns,
} from "./formatter.utils.js";

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

		const title = getFormatterTitle(output);

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
		const divider = getTableDivider();

		const lines: Array<string> = [];
		lines.push(pc.dim(`  ${formatRowLine([...TABLE_HEADERS])}`));
		lines.push(pc.dim(`  ${divider}`));

		for (const row of rows) {
			const rowLine = formatRowLine([...rowToColumns(row)]);
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
