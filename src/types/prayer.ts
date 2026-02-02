/**
 * @module types/prayer
 * @description Type definitions for prayer-time data returned by the Aladhan API,
 * including timings, Hijri/Gregorian dates, calculation methods, and Qibla direction.
 */

/**
 * Daily prayer timings as returned by the Aladhan API.
 * All values are time strings in `"HH:mm (TZ)"` format.
 */
export interface PrayerTimings {
	/** Fajr (pre-dawn) prayer time. */
	readonly Fajr: string;
	/** Sunrise time. */
	readonly Sunrise: string;
	/** Dhuhr (noon) prayer time. */
	readonly Dhuhr: string;
	/** Asr (afternoon) prayer time. */
	readonly Asr: string;
	/** Sunset time. */
	readonly Sunset: string;
	/** Maghrib (post-sunset) prayer time. */
	readonly Maghrib: string;
	/** Isha (night) prayer time. */
	readonly Isha: string;
	/** Imsak (pre-fajr abstinence) time. */
	readonly Imsak: string;
	/** Midnight time. */
	readonly Midnight: string;
	/** End of the first third of the night. */
	readonly Firstthird: string;
	/** Beginning of the last third of the night. */
	readonly Lastthird: string;
}

/**
 * Hijri (Islamic) calendar date from the Aladhan API.
 */
export interface HijriDate {
	/** Full date string, e.g. `"01-09-1446"`. */
	readonly date: string;
	/** Day of the month as a string. */
	readonly day: string;
	/** Hijri month information. */
	readonly month: {
		/** Numeric month (1–12). */
		readonly number: number;
		/** English month name, e.g. `"Ramadan"`. */
		readonly en: string;
		/** Arabic month name. */
		readonly ar: string;
	};
	/** Hijri year as a string. */
	readonly year: string;
	/** Day-of-week names. */
	readonly weekday: {
		/** English weekday name, e.g. `"Monday"`. */
		readonly en: string;
		/** Arabic weekday name. */
		readonly ar: string;
	};
}

/**
 * Gregorian calendar date from the Aladhan API.
 */
export interface GregorianDate {
	/** Full date string, e.g. `"01-03-2025"`. */
	readonly date: string;
	/** Day of the month as a string. */
	readonly day: string;
	/** Gregorian month information. */
	readonly month: {
		/** Numeric month (1–12). */
		readonly number: number;
		/** English month name, e.g. `"March"`. */
		readonly en: string;
	};
	/** Gregorian year as a string. */
	readonly year: string;
	/** Day-of-week names. */
	readonly weekday: {
		/** English weekday name, e.g. `"Monday"`. */
		readonly en: string;
	};
}

/**
 * Metadata about how prayer times were calculated.
 */
export interface PrayerMeta {
	/** Latitude used for calculation. */
	readonly latitude: number;
	/** Longitude used for calculation. */
	readonly longitude: number;
	/** IANA timezone identifier, e.g. `"Asia/Karachi"`. */
	readonly timezone: string;
	/** Calculation method used. */
	readonly method: {
		/** Numeric method identifier. */
		readonly id: number;
		/** Human-readable method name. */
		readonly name: string;
	};
	/** Juristic school used for Asr calculation. May be an object or a string. */
	readonly school:
		| {
				/** Numeric school identifier. */
				readonly id: number;
				/** Human-readable school name. */
				readonly name: string;
		  }
		| string;
}

/**
 * Complete prayer-time response for a single day.
 */
export interface PrayerData {
	/** Prayer timings for the day. */
	readonly timings: PrayerTimings;
	/** Date information (readable, timestamp, Hijri, Gregorian). */
	readonly date: {
		/** Human-readable date string. */
		readonly readable: string;
		/** Unix timestamp as a string. */
		readonly timestamp: string;
		/** Hijri calendar date. */
		readonly hijri: HijriDate;
		/** Gregorian calendar date. */
		readonly gregorian: GregorianDate;
	};
	/** Calculation metadata. */
	readonly meta: PrayerMeta;
}

/**
 * Extended prayer data that includes the next upcoming prayer.
 */
export interface NextPrayerData {
	/** Prayer timings for the day. */
	readonly timings: PrayerTimings;
	/** Date information. */
	readonly date: PrayerData["date"];
	/** Calculation metadata. */
	readonly meta: PrayerMeta;
	/** Name of the next upcoming prayer (e.g. `"Maghrib"`). */
	readonly nextPrayer: string;
	/** Time of the next upcoming prayer. */
	readonly nextPrayerTime: string;
}

/**
 * Definition of a prayer-time calculation method from the Aladhan API.
 */
export interface CalculationMethod {
	/** Numeric method identifier. */
	readonly id: number;
	/** Human-readable method name. */
	readonly name: string;
	/** Angle parameters for Fajr and Isha. */
	readonly params: {
		/** Fajr angle in degrees. */
		readonly Fajr: number;
		/** Isha angle in degrees, or a time-offset string. */
		readonly Isha: number | string;
	};
}

/**
 * Map of all available calculation methods keyed by method ID string.
 */
export type MethodsResponse = Readonly<Record<string, CalculationMethod>>;

/**
 * Qibla (direction of Mecca) data for a given location.
 */
export interface QiblaData {
	/** Latitude of the queried location. */
	readonly latitude: number;
	/** Longitude of the queried location. */
	readonly longitude: number;
	/** Compass bearing to the Kaaba in degrees from north. */
	readonly direction: number;
}
