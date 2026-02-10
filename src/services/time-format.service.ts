/**
 * @module services/time-format
 * @description Service layer for time formatting, parsing, and timezone-aware
 * current-time resolution. Delegates to pure utility functions.
 */

import {
	formatCountdown,
	nowInTimezoneParts,
	parsePrayerTimeToMinutes,
	to12HourTime,
} from "../utils/time.js";

/**
 * Encapsulates time formatting and parsing operations.
 */
export class TimeFormatService {
	/**
	 * Converts a 24-hour time string to 12-hour format.
	 *
	 * @param value - Time string in `"HH:mm"` or `"HH:mm (TZ)"` format.
	 * @returns The time in 12-hour format (e.g. `"5:30 PM"`).
	 */
	to12Hour(value: string): string {
		return to12HourTime(value);
	}

	/**
	 * Parses a prayer-time string to total minutes since midnight.
	 *
	 * @param value - Time string in `"HH:mm"` or `"HH:mm (TZ)"` format.
	 * @returns Minutes since midnight, or `null` if parsing fails.
	 */
	toMinutes(value: string): number | null {
		return parsePrayerTimeToMinutes(value);
	}

	/**
	 * Formats a duration in minutes as a human-readable countdown.
	 *
	 * @param minutes - Duration in minutes.
	 * @returns Formatted string (e.g. `"2h 15m"`).
	 */
	formatCountdown(minutes: number): string {
		return formatCountdown(minutes);
	}

	/**
	 * Returns the current date/time decomposed into year, month, day, and minutes
	 * for a given IANA timezone.
	 *
	 * @param timezone - IANA timezone identifier.
	 * @returns Decomposed date/time, or `null` if the timezone is invalid.
	 */
	getNowParts(timezone: string): Readonly<{
		year: number;
		month: number;
		day: number;
		minutes: number;
	}> | null {
		return nowInTimezoneParts(timezone);
	}
}
