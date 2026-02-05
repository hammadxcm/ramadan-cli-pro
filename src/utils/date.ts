/**
 * @module utils/date
 * @description Date parsing, formatting, and arithmetic utilities
 * used for prayer-time and Ramadan calendar calculations.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Formats a `Date` into the `DD-MM-YYYY` string required by the Aladhan API.
 *
 * @param date - The date to format.
 * @returns A date string in `DD-MM-YYYY` format.
 *
 * @example
 * ```ts
 * formatDateForApi(new Date(2025, 2, 1)); // "01-03-2025"
 * ```
 */
export const formatDateForApi = (date: Date): string => {
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();
	return `${day}-${month}-${year}`;
};

/**
 * Parses an ISO 8601 date string (`YYYY-MM-DD`) into a `Date`.
 *
 * @param value - The string to parse.
 * @returns A `Date` object, or `null` if the string is invalid.
 *
 * @example
 * ```ts
 * parseIsoDate("2025-03-01"); // Date
 * parseIsoDate("not-a-date"); // null
 * ```
 */
export const parseIsoDate = (value: string): Date | null => {
	const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
	if (!match) {
		return null;
	}

	const year = Number.parseInt(match[1] ?? "", 10);
	const month = Number.parseInt(match[2] ?? "", 10);
	const day = Number.parseInt(match[3] ?? "", 10);

	const date = new Date(year, month - 1, day);
	const isValid =
		date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;

	if (!isValid) {
		return null;
	}

	return date;
};

/**
 * Parses a Gregorian date string in `DD-MM-YYYY` format (as returned by the Aladhan API).
 *
 * @param value - The string to parse.
 * @returns A `Date` object, or `null` if the string is invalid.
 */
export const parseGregorianDate = (value: string): Date | null => {
	const match = value.match(/^(\d{2})-(\d{2})-(\d{4})$/);
	if (!match) {
		return null;
	}

	const day = Number.parseInt(match[1] ?? "", 10);
	const month = Number.parseInt(match[2] ?? "", 10);
	const year = Number.parseInt(match[3] ?? "", 10);

	const date = new Date(year, month - 1, day);
	const isValid =
		date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;

	if (!isValid) {
		return null;
	}

	return date;
};

/**
 * Returns a new `Date` that is `days` days after the given date.
 *
 * @param date - The starting date.
 * @param days - Number of days to add (may be negative).
 * @returns A new `Date` offset by `days`.
 */
export const addDays = (date: Date, days: number): Date => {
	const next = new Date(date);
	next.setDate(next.getDate() + days);
	return next;
};

/**
 * Returns the UTC-midnight timestamp in milliseconds for a given date,
 * stripping the time component for date-only comparisons.
 *
 * @param date - The date to convert.
 * @returns Milliseconds since Unix epoch at UTC midnight of that date.
 */
export const toUtcDateOnlyMs = (date: Date): number =>
	Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());

/**
 * Calculates the roza (fast) number given the first-roza date and a target date.
 *
 * @param firstRozaDate - The Gregorian date of the first roza.
 * @param targetDate - The date to calculate the roza number for.
 * @returns The 1-based roza number.
 */
export const getRozaNumberFromStartDate = (firstRozaDate: Date, targetDate: Date): number =>
	Math.floor((toUtcDateOnlyMs(targetDate) - toUtcDateOnlyMs(firstRozaDate)) / DAY_MS) + 1;

/**
 * Parses a `DD-MM-YYYY` string into its numeric `{ year, month, day }` components
 * without constructing a full `Date` object.
 *
 * @param value - The string to parse.
 * @returns An object with `year`, `month`, and `day`, or `null` if invalid.
 */
export const parseGregorianDay = (
	value: string,
): Readonly<{ year: number; month: number; day: number }> | null => {
	const match = value.match(/^(\d{2})-(\d{2})-(\d{4})$/);
	if (!match) {
		return null;
	}

	const day = Number.parseInt(match[1] ?? "", 10);
	const month = Number.parseInt(match[2] ?? "", 10);
	const year = Number.parseInt(match[3] ?? "", 10);
	const isInvalid =
		Number.isNaN(day) ||
		Number.isNaN(month) ||
		Number.isNaN(year) ||
		day < 1 ||
		day > 31 ||
		month < 1 ||
		month > 12;

	if (isInvalid) {
		return null;
	}

	return { year, month, day };
};
