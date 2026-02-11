/**
 * @module services/highlight
 * @description Determines the current Ramadan "highlight state" — which phase
 * of the day we're in (sehar window, fasting, iftar) and the countdown to
 * the next event.
 */

import type { PrayerData } from "../types/prayer.js";
import type { HighlightState } from "../types/ramadan.js";
import type { DateService } from "./date.service.js";
import type { TimeFormatService } from "./time-format.service.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const MINUTES_IN_DAY = 24 * 60;

/**
 * Computes real-time highlight state and status-line summaries for the dashboard.
 */
export class HighlightService {
	/**
	 * @param dateService - For parsing Gregorian dates.
	 * @param timeFormatService - For parsing prayer times and formatting countdowns.
	 */
	constructor(
		private readonly dateService: DateService,
		private readonly timeFormatService: TimeFormatService,
	) {}

	/**
	 * Computes the highlight state for a given prayer day.
	 * Returns `null` if the day is in the past or data cannot be parsed.
	 *
	 * @param day - A single day's prayer data.
	 * @returns The highlight state, or `null`.
	 */
	getHighlightState(day: PrayerData): HighlightState | null {
		const dayParts = this.dateService.parseGregorianDay(day.date.gregorian.date);
		if (!dayParts) {
			return null;
		}

		const seharMinutes = this.timeFormatService.toMinutes(day.timings.Fajr);
		const iftarMinutes = this.timeFormatService.toMinutes(day.timings.Maghrib);
		if (seharMinutes === null || iftarMinutes === null) {
			return null;
		}

		const nowParts = this.timeFormatService.getNowParts(day.meta.timezone);
		if (!nowParts) {
			return null;
		}

		const nowDateUtc = Date.UTC(nowParts.year, nowParts.month - 1, nowParts.day);
		const targetDateUtc = Date.UTC(dayParts.year, dayParts.month - 1, dayParts.day);
		const dayDiff = Math.floor((targetDateUtc - nowDateUtc) / DAY_MS);

		if (dayDiff > 0) {
			const minutesUntilSehar = dayDiff * MINUTES_IN_DAY + (seharMinutes - nowParts.minutes);
			return {
				current: "Before roza day",
				next: "First Sehar",
				countdown: this.timeFormatService.formatCountdown(minutesUntilSehar),
			};
		}

		if (dayDiff < 0) {
			return null;
		}

		if (nowParts.minutes < seharMinutes) {
			return {
				current: "Sehar window open",
				next: "Roza starts (Fajr)",
				countdown: this.timeFormatService.formatCountdown(seharMinutes - nowParts.minutes),
			};
		}

		if (nowParts.minutes < iftarMinutes) {
			return {
				current: "Roza in progress",
				next: "Iftar",
				countdown: this.timeFormatService.formatCountdown(iftarMinutes - nowParts.minutes),
			};
		}

		const minutesUntilNextSehar = MINUTES_IN_DAY - nowParts.minutes + seharMinutes;
		return {
			current: "Iftar time",
			next: "Next day Sehar",
			countdown: this.timeFormatService.formatCountdown(minutesUntilNextSehar),
		};
	}

	/**
	 * Formats a highlight state into a single status-line string.
	 *
	 * @param highlight - The highlight state to format.
	 * @returns A concise status string (e.g. `"Iftar in 2h 15m"`).
	 */
	formatStatusLine(highlight: HighlightState): string {
		const label = (() => {
			switch (highlight.next) {
				case "First Sehar":
				case "Next day Sehar":
					return "Sehar";
				case "Roza starts (Fajr)":
					return "Fast starts";
				default:
					return highlight.next;
			}
		})();
		return `${label} in ${highlight.countdown}`;
	}
}
