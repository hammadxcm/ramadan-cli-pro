/**
 * @module formatters/formatter-utils
 * @description Shared utilities for output formatters — title generation,
 * table grid rendering, and status label mapping.
 */

import i18next from "i18next";
import type { RamadanOutput, RamadanRow } from "../types/ramadan.js";
import { stringWidth, visualPadEnd } from "../utils/visual-width.js";

/**
 * Default column widths used by table and plain formatters.
 * @readonly
 */
export const TABLE_COLUMN_WIDTHS = [6, 8, 8, 14, 20] as const;

/**
 * Wider column widths for RTL locales (Arabic, Urdu, Farsi) where
 * Arabic script with tashkeel occupies more visual space.
 * @readonly
 */
const RTL_COLUMN_WIDTHS = [8, 10, 10, 16, 22] as const;

const RTL_LOCALES = new Set(["ar", "ur", "fa"]);

/**
 * Returns the appropriate column widths for the current locale.
 */
export const getColumnWidths = (): ReadonlyArray<number> => {
	if (i18next.isInitialized && RTL_LOCALES.has(i18next.language)) {
		return RTL_COLUMN_WIDTHS;
	}
	return TABLE_COLUMN_WIDTHS;
};

/**
 * Table header labels (English fallbacks, used when i18n is not initialized).
 * @readonly
 */
export const TABLE_HEADERS = ["Roza", "Sehar", "Iftar", "Date", "Hijri"] as const;

/**
 * Returns translated table header labels, falling back to English defaults.
 */
export const getTableHeaders = (): ReadonlyArray<string> => {
	if (!i18next.isInitialized) return TABLE_HEADERS;
	return [
		i18next.t("table.roza"),
		i18next.t("table.sehar"),
		i18next.t("table.iftar"),
		i18next.t("table.date"),
		i18next.t("table.hijri"),
	];
};

/**
 * Generates the title string for a given Ramadan output mode.
 *
 * @param output - The Ramadan output data.
 * @returns The title string.
 */
export const getFormatterTitle = (output: RamadanOutput): string => {
	if (output.mode === "all") {
		return i18next.isInitialized
			? i18next.t("mode.all", { year: output.hijriYear })
			: `Ramadan ${output.hijriYear} (All Days)`;
	}
	if (output.mode === "number") {
		return i18next.isInitialized
			? i18next.t("mode.number", { roza: output.rows[0]?.roza ?? "" })
			: `Roza ${output.rows[0]?.roza ?? ""} Sehar/Iftar`;
	}
	return i18next.isInitialized ? i18next.t("mode.today") : "Today Sehar/Iftar";
};

/**
 * Pads a column value to its expected visual width, correctly handling
 * Arabic diacritics and other zero-width combining characters.
 *
 * @param value - The string to pad.
 * @param index - Column index into the active column widths.
 * @returns The padded string.
 */
export const padColumn = (value: string, index: number): string => {
	const widths = getColumnWidths();
	return visualPadEnd(value, widths[index] ?? value.length);
};

/**
 * Joins column values into a single row line.
 *
 * @param columns - Column values.
 * @returns A single formatted line.
 */
export const formatRowLine = (columns: ReadonlyArray<string>): string =>
	columns.map((column, index) => padColumn(column, index)).join("  ");

/**
 * Returns a divider line matching the header visual width.
 *
 * @returns A dashed divider string.
 */
export const getTableDivider = (): string => {
	const headerLine = formatRowLine([...getTableHeaders()]);
	return "-".repeat(stringWidth(headerLine));
};

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
			return i18next.isInitialized ? i18next.t("table.sehar") : "Sehar";
		case "Roza starts (Fajr)":
			return i18next.isInitialized ? i18next.t("status.rozaStartsFajr") : "Fast starts";
		default:
			return translateHighlightString(next);
	}
};

/**
 * Mapping from English highlight state strings to i18n keys.
 */
const HIGHLIGHT_KEY_MAP: Readonly<Record<string, string>> = {
	"Before roza day": "status.beforeRozaDay",
	"First Sehar": "status.firstSehar",
	"Sehar window open": "status.seharWindowOpen",
	"Roza starts (Fajr)": "status.rozaStartsFajr",
	"Roza in progress": "status.rozaInProgress",
	"Iftar time": "status.iftarTime",
	"Next day Sehar": "status.nextDaySehar",
	Iftar: "table.iftar",
};

/**
 * Translates a known highlight state string using i18n, falling back to the original.
 */
export const translateHighlightString = (value: string): string => {
	if (!i18next.isInitialized) return value;
	const key = HIGHLIGHT_KEY_MAP[value];
	return key ? i18next.t(key) : value;
};

/**
 * Returns the translated highlight "status" label.
 */
export const getHighlightStatusLabel = (): string =>
	i18next.isInitialized ? i18next.t("highlight.status") : "Status:";

/**
 * Returns the translated highlight "up next" label.
 */
export const getHighlightUpNextLabel = (): string =>
	i18next.isInitialized ? i18next.t("highlight.upNext") : "Up next:";

/**
 * Returns the translated highlight "in" preposition.
 */
export const getHighlightInLabel = (): string =>
	i18next.isInitialized ? i18next.t("highlight.in") : "in";

/**
 * Returns the translated footer note.
 */
export const getFooterNote = (): string =>
	i18next.isInitialized ? i18next.t("footer.note") : "Sehar uses Fajr. Iftar uses Maghrib.";
