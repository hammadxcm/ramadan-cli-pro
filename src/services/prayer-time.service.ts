/**
 * @module services/prayer-time
 * @description Service for fetching daily prayer times and Ramadan calendars
 * from the Aladhan API with multi-strategy fallback (address → city → coords).
 */

import { PrayerTimeFetchError, RamadanCalendarError } from "../errors/prayer.error.js";
import type { PrayerApiRepository } from "../repositories/prayer-api.repository.js";
import type { PrayerData } from "../types/prayer.js";
import type { RamadanQuery } from "../types/ramadan.js";
import type { CacheService } from "./cache.service.js";
import { CACHE_TTL } from "./cache.service.js";

const getErrorMessage = (error: unknown): string => {
	if (error instanceof Error) {
		return error.message;
	}
	return "unknown error";
};

/**
 * Fetches prayer times using a cascade of API strategies.
 * Tries address-based, then city-based, then coordinate-based lookups.
 */
export class PrayerTimeService {
	/**
	 * @param prayerApiRepository - The Aladhan API client.
	 * @param cacheService - For caching API responses.
	 */
	constructor(
		private readonly prayerApiRepository: PrayerApiRepository,
		private readonly cacheService: CacheService,
	) {}

	/**
	 * Fetches prayer data for a single day, trying multiple API strategies.
	 *
	 * @param query - The Ramadan query with location and settings.
	 * @param date - Optional date override (defaults to today).
	 * @returns The prayer data for the requested day.
	 * @throws {PrayerTimeFetchError} If all strategies fail.
	 */
	async fetchDay(query: RamadanQuery, date?: Date): Promise<PrayerData> {
		const errors: Array<string> = [];

		const addressOptions = {
			address: query.address,
			method: query.method,
			school: query.school,
			date,
		};

		try {
			return await this.prayerApiRepository.fetchTimingsByAddress(addressOptions);
		} catch (error) {
			errors.push(`timingsByAddress failed: ${getErrorMessage(error)}`);
		}

		if (query.city && query.country) {
			try {
				return await this.prayerApiRepository.fetchTimingsByCity({
					city: query.city,
					country: query.country,
					method: query.method,
					school: query.school,
					date,
				});
			} catch (error) {
				errors.push(`timingsByCity failed: ${getErrorMessage(error)}`);
			}
		}

		if (query.latitude !== undefined && query.longitude !== undefined) {
			try {
				return await this.prayerApiRepository.fetchTimingsByCoords({
					latitude: query.latitude,
					longitude: query.longitude,
					method: query.method,
					school: query.school,
					timezone: query.timezone,
					date,
				});
			} catch (error) {
				errors.push(`timingsByCoords failed: ${getErrorMessage(error)}`);
			}
		}

		throw new PrayerTimeFetchError(`Could not fetch prayer times. ${errors.join(" | ")}`, errors);
	}

	/**
	 * Fetches the full Ramadan Hijri calendar for a given year.
	 *
	 * @param query - The Ramadan query with location and settings.
	 * @param year - The Hijri year to fetch Ramadan (month 9) for.
	 * @returns Array of prayer data for each day in Ramadan.
	 * @throws {RamadanCalendarError} If all strategies fail.
	 */
	async fetchCalendar(query: RamadanQuery, year: number): Promise<ReadonlyArray<PrayerData>> {
		const errors: Array<string> = [];

		try {
			return await this.prayerApiRepository.fetchHijriCalendarByAddress({
				address: query.address,
				year,
				month: 9,
				method: query.method,
				school: query.school,
			});
		} catch (error) {
			errors.push(`hijriCalendarByAddress failed: ${getErrorMessage(error)}`);
		}

		if (query.city && query.country) {
			try {
				return await this.prayerApiRepository.fetchHijriCalendarByCity({
					city: query.city,
					country: query.country,
					year,
					month: 9,
					method: query.method,
					school: query.school,
				});
			} catch (error) {
				errors.push(`hijriCalendarByCity failed: ${getErrorMessage(error)}`);
			}
		}

		throw new RamadanCalendarError(`Could not fetch Ramadan calendar. ${errors.join(" | ")}`);
	}

	/**
	 * Fetches prayer data for a custom date range starting from a first-roza date.
	 * Used when the user has overridden the first roza date.
	 *
	 * @param query - The Ramadan query with location and settings.
	 * @param firstRozaDate - The start date.
	 * @param totalDays - Number of days to fetch (defaults to 30).
	 * @returns Array of prayer data for each day.
	 */
	async fetchCustomDays(
		query: RamadanQuery,
		firstRozaDate: Date,
		totalDays = 30,
	): Promise<ReadonlyArray<PrayerData>> {
		const days = Array.from({ length: totalDays }, (_, index) => {
			const d = new Date(firstRozaDate);
			d.setDate(d.getDate() + index);
			return d;
		});
		return Promise.all(days.map(async (dayDate) => this.fetchDay(query, dayDate)));
	}
}
