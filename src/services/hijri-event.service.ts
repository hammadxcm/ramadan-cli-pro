/**
 * @module services/hijri-event
 * @description Provides look-ups for notable Ramadan events and special nights.
 */

import type { HijriEvent } from "../data/hijri-events.js";
import { RAMADAN_EVENTS } from "../data/hijri-events.js";

/**
 * Query layer over the static {@link RAMADAN_EVENTS} dataset.
 */
export class HijriEventService {
	/**
	 * Returns all events that fall on a given Ramadan day.
	 *
	 * @param rozaNumber - The Ramadan day (1-30).
	 * @returns Matching events, or an empty array if none exist.
	 */
	getEventsForDay(rozaNumber: number): HijriEvent[] {
		return RAMADAN_EVENTS.filter((e) => e.day === rozaNumber);
	}

	/**
	 * Returns upcoming events that fall *after* the current Ramadan day,
	 * sorted by day ascending.
	 *
	 * @param currentRoza - The current Ramadan day (1-30).
	 * @param count - Maximum number of events to return. Defaults to all.
	 * @returns Upcoming events in chronological order.
	 */
	getUpcomingEvents(currentRoza: number, count?: number): HijriEvent[] {
		const upcoming = RAMADAN_EVENTS.filter((e) => e.day > currentRoza).sort(
			(a, b) => a.day - b.day,
		);
		return count !== undefined ? upcoming.slice(0, count) : upcoming;
	}

	/**
	 * Returns `true` if the given day is one of the special odd nights
	 * in the last ten days of Ramadan.
	 *
	 * @param rozaNumber - The Ramadan day (1-30).
	 */
	isSpecialNight(rozaNumber: number): boolean {
		return RAMADAN_EVENTS.some((e) => e.day === rozaNumber && e.isSpecialNight);
	}
}
