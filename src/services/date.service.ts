/**
 * @module services/date
 * @description Service layer for date parsing, formatting, and Ramadan-specific
 * date calculations. Delegates to pure utility functions.
 */

import {
	addDays,
	formatDateForApi,
	getRozaNumberFromStartDate,
	parseGregorianDate,
	parseGregorianDay,
	parseIsoDate,
} from "../utils/date.js";

/**
 * Encapsulates date operations needed by the Ramadan service layer.
 */
export class DateService {
	/**
	 * Formats a `Date` for the Aladhan API (`DD-MM-YYYY`).
	 *
	 * @param date - The date to format.
	 * @returns Formatted date string.
	 */
	formatForApi(date: Date): string {
		return formatDateForApi(date);
	}

	/**
	 * Parses an ISO 8601 date string (`YYYY-MM-DD`).
	 *
	 * @param value - The string to parse.
	 * @returns A `Date` or `null` if invalid.
	 */
	parseIso(value: string): Date | null {
		return parseIsoDate(value);
	}

	/**
	 * Parses a Gregorian date string in `DD-MM-YYYY` format.
	 *
	 * @param value - The string to parse.
	 * @returns A `Date` or `null` if invalid.
	 */
	parseGregorian(value: string): Date | null {
		return parseGregorianDate(value);
	}

	/**
	 * Parses a `DD-MM-YYYY` string into numeric components without creating a `Date`.
	 *
	 * @param value - The string to parse.
	 * @returns An object with `year`, `month`, `day`, or `null`.
	 */
	parseGregorianDay(value: string): Readonly<{ year: number; month: number; day: number }> | null {
		return parseGregorianDay(value);
	}

	/**
	 * Adds a number of days to a date.
	 *
	 * @param date - Starting date.
	 * @param days - Days to add (may be negative).
	 * @returns A new `Date`.
	 */
	addDays(date: Date, days: number): Date {
		return addDays(date, days);
	}

	/**
	 * Calculates the 1-based roza number from a start date and a target date.
	 *
	 * @param firstRozaDate - Date of the first roza.
	 * @param targetDate - Date to calculate the roza number for.
	 * @returns The roza number.
	 */
	getRozaNumber(firstRozaDate: Date, targetDate: Date): number {
		return getRozaNumberFromStartDate(firstRozaDate, targetDate);
	}

	/**
	 * Derives the roza number directly from a Hijri day string.
	 *
	 * @param hijriDay - The Hijri day-of-month as a string (e.g. `"15"`).
	 * @returns The roza number (defaults to 1 if parsing fails).
	 */
	getRozaNumberFromHijriDay(hijriDay: string): number {
		const parsed = Number.parseInt(hijriDay, 10);
		if (Number.isNaN(parsed)) {
			return 1;
		}
		return parsed;
	}

	/**
	 * Determines the target Hijri Ramadan year based on the current Hijri date.
	 * If the current Hijri month is past Ramadan (month 9), targets the next year.
	 *
	 * @param hijriYear - Current Hijri year as a string.
	 * @param hijriMonth - Current Hijri month number.
	 * @returns The Hijri year to use for Ramadan lookups.
	 */
	getTargetRamadanYear(hijriYear: string, hijriMonth: number): number {
		const year = Number.parseInt(hijriYear, 10);
		if (hijriMonth > 9) {
			return year + 1;
		}
		return year;
	}
}
