/**
 * @module repositories/prayer-api
 * @description Repository for the Aladhan prayer-times REST API. Provides typed
 * methods for fetching daily timings, Hijri/Gregorian calendars, calculation
 * methods, and Qibla direction.
 */

import { z } from "zod";
import { ApiError, ApiValidationError } from "../errors/api.error.js";
import { ApiEnvelopeSchema } from "../schemas/api-envelope.schema.js";
import {
	CalculationMethodSchema,
	PrayerDataSchema,
	QiblaDataSchema,
} from "../schemas/prayer.schema.js";
import type {
	FetchByAddressOptions,
	FetchByCityOptions,
	FetchByCoordsOptions,
	FetchCalendarByAddressOptions,
	FetchCalendarByCityOptions,
	FetchHijriCalendarByAddressOptions,
	FetchHijriCalendarByCityOptions,
} from "../types/prayer-api-options.js";
import type { CalculationMethod, MethodsResponse, PrayerData, QiblaData } from "../types/prayer.js";

export type {
	FetchByAddressOptions,
	FetchByCityOptions,
	FetchByCoordsOptions,
	FetchCalendarByAddressOptions,
	FetchCalendarByCityOptions,
	FetchHijriCalendarByAddressOptions,
	FetchHijriCalendarByCityOptions,
};

const API_BASE = "https://api.aladhan.com/v1";

const formatDate = (date: Date): string => {
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();
	return `${day}-${month}-${year}`;
};

const parseApiResponse = <T extends z.ZodTypeAny>(payload: unknown, dataSchema: T): z.infer<T> => {
	const parsedEnvelope = ApiEnvelopeSchema.safeParse(payload);

	if (!parsedEnvelope.success) {
		throw new ApiValidationError(
			`Invalid API response: ${parsedEnvelope.error.issues[0]?.message ?? "Unknown schema mismatch"}`,
			parsedEnvelope.error.issues.map((i) => i.message),
		);
	}

	if (parsedEnvelope.data.code !== 200) {
		throw new ApiError(`API ${parsedEnvelope.data.code}: ${parsedEnvelope.data.status}`);
	}

	if (typeof parsedEnvelope.data.data === "string") {
		throw new ApiError(`API returned message: ${parsedEnvelope.data.data}`);
	}

	const parsedData = dataSchema.safeParse(parsedEnvelope.data.data);
	if (!parsedData.success) {
		throw new ApiValidationError(
			`Invalid API response: ${parsedData.error.issues[0]?.message ?? "Unknown schema mismatch"}`,
			parsedData.error.issues.map((i) => i.message),
		);
	}

	return parsedData.data;
};

const fetchAndParse = async <T extends z.ZodTypeAny>(
	url: string,
	dataSchema: T,
): Promise<z.infer<T>> => {
	const response = await fetch(url);
	const json = (await response.json()) as unknown;
	return parseApiResponse(json, dataSchema);
};

/**
 * Typed client for the Aladhan prayer-times REST API.
 * All responses are validated against Zod schemas before being returned.
 */
export class PrayerApiRepository {
	/**
	 * Fetches prayer timings for a specific date by city and country.
	 *
	 * @param opts - City, country, and optional method/school/date.
	 * @returns Validated prayer data for the requested day.
	 */
	async fetchTimingsByCity(opts: FetchByCityOptions): Promise<PrayerData> {
		const date = formatDate(opts.date ?? new Date());
		const params = new URLSearchParams({
			city: opts.city,
			country: opts.country,
		});
		if (opts.method !== undefined) params.set("method", String(opts.method));
		if (opts.school !== undefined) params.set("school", String(opts.school));

		return fetchAndParse(`${API_BASE}/timingsByCity/${date}?${params}`, PrayerDataSchema);
	}

	/**
	 * Fetches prayer timings for a specific date by address string.
	 *
	 * @param opts - Address and optional method/school/date.
	 * @returns Validated prayer data for the requested day.
	 */
	async fetchTimingsByAddress(opts: FetchByAddressOptions): Promise<PrayerData> {
		const date = formatDate(opts.date ?? new Date());
		const params = new URLSearchParams({ address: opts.address });
		if (opts.method !== undefined) params.set("method", String(opts.method));
		if (opts.school !== undefined) params.set("school", String(opts.school));

		return fetchAndParse(`${API_BASE}/timingsByAddress/${date}?${params}`, PrayerDataSchema);
	}

	/**
	 * Fetches prayer timings for a specific date by geographic coordinates.
	 *
	 * @param opts - Latitude, longitude, and optional method/school/timezone/date.
	 * @returns Validated prayer data for the requested day.
	 */
	async fetchTimingsByCoords(opts: FetchByCoordsOptions): Promise<PrayerData> {
		const date = formatDate(opts.date ?? new Date());
		const params = new URLSearchParams({
			latitude: String(opts.latitude),
			longitude: String(opts.longitude),
		});
		if (opts.method !== undefined) params.set("method", String(opts.method));
		if (opts.school !== undefined) params.set("school", String(opts.school));
		if (opts.timezone) params.set("timezonestring", opts.timezone);

		return fetchAndParse(`${API_BASE}/timings/${date}?${params}`, PrayerDataSchema);
	}

	/**
	 * Fetches a full Hijri-month calendar by address.
	 *
	 * @param opts - Address, Hijri year/month, and optional method/school.
	 * @returns Array of prayer data for each day in the Hijri month.
	 */
	async fetchHijriCalendarByAddress(
		opts: FetchHijriCalendarByAddressOptions,
	): Promise<ReadonlyArray<PrayerData>> {
		const params = new URLSearchParams({ address: opts.address });
		if (opts.method !== undefined) params.set("method", String(opts.method));
		if (opts.school !== undefined) params.set("school", String(opts.school));

		return fetchAndParse(
			`${API_BASE}/hijriCalendarByAddress/${opts.year}/${opts.month}?${params}`,
			z.array(PrayerDataSchema),
		);
	}

	/**
	 * Fetches a full Hijri-month calendar by city and country.
	 *
	 * @param opts - City, country, Hijri year/month, and optional method/school.
	 * @returns Array of prayer data for each day in the Hijri month.
	 */
	async fetchHijriCalendarByCity(
		opts: FetchHijriCalendarByCityOptions,
	): Promise<ReadonlyArray<PrayerData>> {
		const params = new URLSearchParams({
			city: opts.city,
			country: opts.country,
		});
		if (opts.method !== undefined) params.set("method", String(opts.method));
		if (opts.school !== undefined) params.set("school", String(opts.school));

		return fetchAndParse(
			`${API_BASE}/hijriCalendarByCity/${opts.year}/${opts.month}?${params}`,
			z.array(PrayerDataSchema),
		);
	}

	/**
	 * Fetches a Gregorian calendar by city and country.
	 *
	 * @param opts - City, country, year, and optional month/method/school.
	 * @returns Array of prayer data for each day in the range.
	 */
	async fetchCalendarByCity(opts: FetchCalendarByCityOptions): Promise<ReadonlyArray<PrayerData>> {
		const params = new URLSearchParams({
			city: opts.city,
			country: opts.country,
		});
		if (opts.method !== undefined) params.set("method", String(opts.method));
		if (opts.school !== undefined) params.set("school", String(opts.school));

		const path = opts.month ? `${opts.year}/${opts.month}` : String(opts.year);
		return fetchAndParse(`${API_BASE}/calendarByCity/${path}?${params}`, z.array(PrayerDataSchema));
	}

	/**
	 * Fetches all available calculation methods.
	 *
	 * @returns A map of method ID strings to calculation method definitions.
	 */
	async fetchMethods(): Promise<MethodsResponse> {
		return fetchAndParse(`${API_BASE}/methods`, z.record(z.string(), CalculationMethodSchema));
	}

	/**
	 * Fetches the Qibla direction for a given location.
	 *
	 * @param latitude - Latitude in decimal degrees.
	 * @param longitude - Longitude in decimal degrees.
	 * @returns Qibla direction data.
	 */
	async fetchQibla(latitude: number, longitude: number): Promise<QiblaData> {
		return fetchAndParse(`${API_BASE}/qibla/${latitude}/${longitude}`, QiblaDataSchema);
	}
}
