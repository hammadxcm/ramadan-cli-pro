/**
 * @module errors/prayer
 * @description Error classes for prayer-time and Ramadan-calendar failures.
 */

import { AppError } from "./base.error.js";

/**
 * Thrown when fetching prayer times from the API fails after all retry attempts.
 *
 * @example
 * ```ts
 * throw new PrayerTimeFetchError("All attempts failed", ["timeout", "500"]);
 * ```
 */
export class PrayerTimeFetchError extends AppError {
	/** Descriptions of each failed attempt. */
	readonly attempts: ReadonlyArray<string>;

	/**
	 * @param message - Summary of the fetch failure.
	 * @param attempts - List of individual attempt failure descriptions.
	 */
	constructor(message: string, attempts: ReadonlyArray<string> = []) {
		super(message, "PRAYER_TIME_FETCH_ERROR");
		this.name = "PrayerTimeFetchError";
		this.attempts = attempts;
	}
}

/**
 * Thrown when building the Ramadan calendar fails (e.g. no data for the month).
 *
 * @example
 * ```ts
 * throw new RamadanCalendarError("No Ramadan data found for 1446");
 * ```
 */
export class RamadanCalendarError extends AppError {
	/**
	 * @param message - Description of the calendar error.
	 */
	constructor(message: string) {
		super(message, "RAMADAN_CALENDAR_ERROR");
		this.name = "RamadanCalendarError";
	}
}

/**
 * Thrown when a specific roza number cannot be found in the calendar.
 *
 * @example
 * ```ts
 * throw new RozaNotFoundError(31);
 * ```
 */
export class RozaNotFoundError extends AppError {
	/** The roza number that was requested but not found. */
	readonly rozaNumber: number;

	/**
	 * @param rozaNumber - The roza number that was not found (1–30).
	 */
	constructor(rozaNumber: number) {
		super(`Could not find roza ${rozaNumber} timings.`, "ROZA_NOT_FOUND");
		this.name = "RozaNotFoundError";
		this.rozaNumber = rozaNumber;
	}
}
