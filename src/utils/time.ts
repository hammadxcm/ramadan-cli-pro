/**
 * @module utils/time
 * @description Time parsing, formatting, and timezone utilities
 * for prayer-time display and countdown calculations.
 */

/** Total minutes in a day (1440). */
const MINUTES_IN_DAY = 24 * 60;

/**
 * Converts a 24-hour time string (e.g. `"17:30"`) to 12-hour format (e.g. `"5:30 PM"`).
 * Any timezone suffix after a space is stripped before conversion.
 *
 * @param value - Time string in `"HH:mm"` or `"HH:mm (TZ)"` format.
 * @returns The time in 12-hour format, or the original string if parsing fails.
 *
 * @example
 * ```ts
 * to12HourTime("17:30");        // "5:30 PM"
 * to12HourTime("05:00 (PKT)"); // "5:00 AM"
 * ```
 */
export const to12HourTime = (value: string): string => {
	const cleanValue = value.split(" ")[0] ?? value;
	const match = cleanValue.match(/^(\d{1,2}):(\d{2})$/);
	if (!match) {
		return cleanValue;
	}

	const hour = Number.parseInt(match[1] ?? "", 10);
	const minute = Number.parseInt(match[2] ?? "", 10);
	const isInvalidTime =
		Number.isNaN(hour) ||
		Number.isNaN(minute) ||
		hour < 0 ||
		hour > 23 ||
		minute < 0 ||
		minute > 59;

	if (isInvalidTime) {
		return cleanValue;
	}

	const period = hour >= 12 ? "PM" : "AM";
	const twelveHour = hour % 12 || 12;
	return `${twelveHour}:${String(minute).padStart(2, "0")} ${period}`;
};

/**
 * Parses a prayer-time string into total minutes since midnight.
 * Any timezone suffix after a space is stripped before parsing.
 *
 * @param value - Time string in `"HH:mm"` or `"HH:mm (TZ)"` format.
 * @returns Total minutes since midnight, or `null` if parsing fails.
 *
 * @example
 * ```ts
 * parsePrayerTimeToMinutes("17:30"); // 1050
 * ```
 */
export const parsePrayerTimeToMinutes = (value: string): number | null => {
	const cleanValue = value.split(" ")[0] ?? value;
	const match = cleanValue.match(/^(\d{1,2}):(\d{2})$/);
	if (!match) {
		return null;
	}

	const hour = Number.parseInt(match[1] ?? "", 10);
	const minute = Number.parseInt(match[2] ?? "", 10);
	const isInvalid =
		Number.isNaN(hour) ||
		Number.isNaN(minute) ||
		hour < 0 ||
		hour > 23 ||
		minute < 0 ||
		minute > 59;

	if (isInvalid) {
		return null;
	}

	return hour * 60 + minute;
};

/**
 * Formats a duration in minutes into a human-readable countdown string.
 *
 * @param minutes - Duration in minutes (clamped to 0 if negative).
 * @returns A string like `"2h 15m"` or `"45m"`.
 *
 * @example
 * ```ts
 * formatCountdown(135); // "2h 15m"
 * formatCountdown(45);  // "45m"
 * ```
 */
export const formatCountdown = (minutes: number): string => {
	const safeMinutes = Math.max(minutes, 0);
	const hours = Math.floor(safeMinutes / 60);
	const remainingMinutes = safeMinutes % 60;

	if (hours === 0) {
		return `${remainingMinutes}m`;
	}

	return `${hours}h ${remainingMinutes}m`;
};

/**
 * Returns the current date and time-of-day in a given IANA timezone,
 * decomposed into year, month, day, and total minutes since midnight.
 *
 * @param timezone - IANA timezone identifier (e.g. `"Asia/Karachi"`).
 * @returns The decomposed date/time, or `null` if the timezone is invalid.
 */
export const nowInTimezoneParts = (
	timezone: string,
): Readonly<{
	year: number;
	month: number;
	day: number;
	minutes: number;
}> | null => {
	try {
		const formatter = new Intl.DateTimeFormat("en-GB", {
			timeZone: timezone,
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			hour12: false,
		});
		const parts = formatter.formatToParts(new Date());
		const toNumber = (type: Intl.DateTimeFormatPartTypes): number | null => {
			const part = parts.find((item) => item.type === type)?.value;
			if (!part) {
				return null;
			}
			const parsed = Number.parseInt(part, 10);
			if (Number.isNaN(parsed)) {
				return null;
			}
			return parsed;
		};

		const year = toNumber("year");
		const month = toNumber("month");
		const day = toNumber("day");
		let hour = toNumber("hour");
		const minute = toNumber("minute");

		if (year === null || month === null || day === null || hour === null || minute === null) {
			return null;
		}

		if (hour === 24) {
			hour = 0;
		}

		return {
			year,
			month,
			day,
			minutes: hour * 60 + minute,
		};
	} catch {
		return null;
	}
};

export { MINUTES_IN_DAY };
