/**
 * Options for fetching prayer timings by city and country.
 */
export interface FetchByCityOptions {
	/** City name. */
	readonly city: string;
	/** Country name. */
	readonly country: string;
	/** Calculation method ID. */
	readonly method?: number | undefined;
	/** Juristic school ID. */
	readonly school?: number | undefined;
	/** Date to fetch timings for (defaults to today). */
	readonly date?: Date | undefined;
}

/**
 * Options for fetching prayer timings by address string.
 */
export interface FetchByAddressOptions {
	/** Free-form address string. */
	readonly address: string;
	/** Calculation method ID. */
	readonly method?: number | undefined;
	/** Juristic school ID. */
	readonly school?: number | undefined;
	/** Date to fetch timings for (defaults to today). */
	readonly date?: Date | undefined;
}

/**
 * Options for fetching prayer timings by geographic coordinates.
 */
export interface FetchByCoordsOptions {
	/** Latitude in decimal degrees. */
	readonly latitude: number;
	/** Longitude in decimal degrees. */
	readonly longitude: number;
	/** Calculation method ID. */
	readonly method?: number | undefined;
	/** Juristic school ID. */
	readonly school?: number | undefined;
	/** IANA timezone override. */
	readonly timezone?: string | undefined;
	/** Date to fetch timings for (defaults to today). */
	readonly date?: Date | undefined;
}

/**
 * Options for fetching a Gregorian calendar by city.
 */
export interface FetchCalendarByCityOptions {
	/** City name. */
	readonly city: string;
	/** Country name. */
	readonly country: string;
	/** Gregorian year. */
	readonly year: number;
	/** Gregorian month (1–12). If omitted, fetches the whole year. */
	readonly month?: number | undefined;
	/** Calculation method ID. */
	readonly method?: number | undefined;
	/** Juristic school ID. */
	readonly school?: number | undefined;
}

/**
 * Options for fetching a Gregorian calendar by address.
 */
export interface FetchCalendarByAddressOptions {
	/** Free-form address string. */
	readonly address: string;
	/** Gregorian year. */
	readonly year: number;
	/** Gregorian month (1–12). If omitted, fetches the whole year. */
	readonly month?: number | undefined;
	/** Calculation method ID. */
	readonly method?: number | undefined;
	/** Juristic school ID. */
	readonly school?: number | undefined;
}

/**
 * Options for fetching a Hijri calendar by address.
 */
export interface FetchHijriCalendarByAddressOptions {
	/** Free-form address string. */
	readonly address: string;
	/** Hijri year. */
	readonly year: number;
	/** Hijri month (1–12). */
	readonly month: number;
	/** Calculation method ID. */
	readonly method?: number | undefined;
	/** Juristic school ID. */
	readonly school?: number | undefined;
}

/**
 * Options for fetching a Hijri calendar by city and country.
 */
export interface FetchHijriCalendarByCityOptions {
	/** City name. */
	readonly city: string;
	/** Country name. */
	readonly country: string;
	/** Hijri year. */
	readonly year: number;
	/** Hijri month (1–12). */
	readonly month: number;
	/** Calculation method ID. */
	readonly method?: number | undefined;
	/** Juristic school ID. */
	readonly school?: number | undefined;
}
