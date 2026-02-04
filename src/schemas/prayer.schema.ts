/**
 * @module schemas/prayer
 * @description Zod schemas for validating Aladhan API prayer-time responses.
 * @see {@link import("../types/prayer.js")} for the corresponding TypeScript interfaces.
 */

import { z } from "zod";

/**
 * Validates the daily prayer timings object from the Aladhan API.
 * @see {@link import("../types/prayer.js").PrayerTimings}
 */
export const PrayerTimingsSchema = z.object({
	Fajr: z.string(),
	Sunrise: z.string(),
	Dhuhr: z.string(),
	Asr: z.string(),
	Sunset: z.string(),
	Maghrib: z.string(),
	Isha: z.string(),
	Imsak: z.string(),
	Midnight: z.string(),
	Firstthird: z.string(),
	Lastthird: z.string(),
});

/**
 * Validates a Hijri (Islamic) calendar date from the Aladhan API.
 * @see {@link import("../types/prayer.js").HijriDate}
 */
export const HijriDateSchema = z.object({
	date: z.string(),
	day: z.string(),
	month: z.object({
		number: z.number(),
		en: z.string(),
		ar: z.string(),
	}),
	year: z.string(),
	weekday: z.object({
		en: z.string(),
		ar: z.string(),
	}),
});

/**
 * Validates a Gregorian calendar date from the Aladhan API.
 * @see {@link import("../types/prayer.js").GregorianDate}
 */
export const GregorianDateSchema = z.object({
	date: z.string(),
	day: z.string(),
	month: z.object({
		number: z.number(),
		en: z.string(),
	}),
	year: z.string(),
	weekday: z.object({
		en: z.string(),
	}),
});

/**
 * Validates the prayer-calculation metadata from the Aladhan API.
 * @see {@link import("../types/prayer.js").PrayerMeta}
 */
export const PrayerMetaSchema = z.object({
	latitude: z.number(),
	longitude: z.number(),
	timezone: z.string(),
	method: z.object({
		id: z.number(),
		name: z.string(),
	}),
	school: z.union([
		z.object({
			id: z.number(),
			name: z.string(),
		}),
		z.string(),
	]),
});

/**
 * Validates a complete single-day prayer data response.
 * @see {@link import("../types/prayer.js").PrayerData}
 */
export const PrayerDataSchema = z.object({
	timings: PrayerTimingsSchema,
	date: z.object({
		readable: z.string(),
		timestamp: z.string(),
		hijri: HijriDateSchema,
		gregorian: GregorianDateSchema,
	}),
	meta: PrayerMetaSchema,
});

/**
 * Validates a prayer data response that includes next-prayer information.
 * @see {@link import("../types/prayer.js").NextPrayerData}
 */
export const NextPrayerDataSchema = z.object({
	timings: PrayerTimingsSchema,
	date: z.object({
		readable: z.string(),
		timestamp: z.string(),
		hijri: HijriDateSchema,
		gregorian: GregorianDateSchema,
	}),
	meta: PrayerMetaSchema,
	nextPrayer: z.string(),
	nextPrayerTime: z.string(),
});

/**
 * Validates a calculation method definition from the Aladhan API.
 * @see {@link import("../types/prayer.js").CalculationMethod}
 */
export const CalculationMethodSchema = z.object({
	id: z.number(),
	name: z.string(),
	params: z.object({
		Fajr: z.number(),
		Isha: z.union([z.number(), z.string()]),
	}),
});

/**
 * Validates Qibla direction data from the Aladhan API.
 * @see {@link import("../types/prayer.js").QiblaData}
 */
export const QiblaDataSchema = z.object({
	latitude: z.number(),
	longitude: z.number(),
	direction: z.number(),
});
