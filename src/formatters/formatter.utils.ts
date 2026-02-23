/**
 * @module formatters/formatter-utils
 * @description Shared utilities for output formatters — title generation,
 * table grid rendering, and status label mapping.
 */

import type { RamadanOutput, RamadanRow } from "../types/ramadan.js";

/**
 * Column widths used by table and plain formatters.
 * @readonly
 */
export const TABLE_COLUMN_WIDTHS = [6, 8, 8, 14, 20] as const;

/**
 * Table header labels.
 * @readonly
 */
export const TABLE_HEADERS = ["Roza", "Sehar", "Iftar", "Date", "Hijri"] as const;

/**
 * Generates the title string for a given Ramadan output mode.
 *
 * @param output - The Ramadan output data.
 * @returns The title string.
 */
export const getFormatterTitle = (output: RamadanOutput): string => {
	if (output.mode === "all") {
		return `Ramadan ${output.hijriYear} (All Days)`;
	}
	if (output.mode === "number") {
		return `Roza ${output.rows[0]?.roza ?? ""} Sehar/Iftar`;
	}
	return "Today Sehar/Iftar";
};

/**
 * Pads a column value to its expected width.
 *
 * @param value - The string to pad.
 * @param index - Column index into {@link TABLE_COLUMN_WIDTHS}.
 * @returns The padded string.
 */
export const padColumn = (value: string, index: number): string =>
	value.padEnd(TABLE_COLUMN_WIDTHS[index] ?? value.length);

/**
 * Joins column values into a single row line.
 *
 * @param columns - Column values.
 * @returns A single formatted line.
 */
export const formatRowLine = (columns: ReadonlyArray<string>): string =>
	columns.map((column, index) => padColumn(column, index)).join("  ");

/**
 * Returns a divider line matching the header width.
 *
 * @returns A dashed divider string.
 */
export const getTableDivider = (): string => "-".repeat(formatRowLine([...TABLE_HEADERS]).length);

/**
 * Converts a row of Ramadan data into its column values.
 *
 * @param row - A single Ramadan row.
 * @returns Array of string column values.
 */
export const rowToColumns = (row: RamadanRow): ReadonlyArray<string> => [
	String(row.roza),
	row.sehar,
	row.iftar,
	row.date,
	row.hijri,
];

/**
 * Maps a "next event" label from highlight state to a concise status-line label.
 *
 * @param next - The next event label from highlight state.
 * @returns A concise label suitable for status bars.
 */
export const getStatusLabel = (next: string): string => {
	switch (next) {
		case "First Sehar":
		case "Next day Sehar":
			return "Sehar";
		case "Roza starts (Fajr)":
			return "Fast starts";
		default:
			return next;
	}
};
