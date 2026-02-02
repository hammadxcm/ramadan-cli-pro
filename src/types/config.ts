/**
 * @module types/config
 * @description Configuration store types for persisted user preferences,
 * including location, prayer settings, and display options.
 */

/**
 * The full persisted configuration object written to disk.
 * All fields are optional — absent keys use application defaults.
 */
export interface RamadanConfigStore {
	/** Saved latitude in decimal degrees. */
	readonly latitude?: number | undefined;
	/** Saved longitude in decimal degrees. */
	readonly longitude?: number | undefined;
	/** Saved city name. */
	readonly city?: string | undefined;
	/** Saved country name. */
	readonly country?: string | undefined;
	/** Calculation method ID (0–23). */
	readonly method?: number | undefined;
	/** Juristic school ID (`0` = Shafi, `1` = Hanafi). */
	readonly school?: number | undefined;
	/** IANA timezone identifier. */
	readonly timezone?: string | undefined;
	/** Override date for the first roza in `YYYY-MM-DD` format. */
	readonly firstRozaDate?: string | undefined;
	/** Whether to display times in 24-hour format. */
	readonly format24h?: boolean | undefined;
	/** User locale for i18n (e.g. `"en"`, `"ar"`, `"ur"`). */
	readonly locale?: string | undefined;
	/** Whether desktop notifications are enabled. */
	readonly notificationsEnabled?: boolean | undefined;
	/** Whether to send a notification at sehar time. */
	readonly notifySehar?: boolean | undefined;
	/** Whether to send a notification at iftar time. */
	readonly notifyIftar?: boolean | undefined;
	/** Minutes before the event to fire a reminder notification. */
	readonly notifyMinutesBefore?: number | undefined;
}

/**
 * Subset of config representing a stored geographic location.
 */
export interface StoredLocation {
	/** City name. */
	readonly city?: string | undefined;
	/** Country name. */
	readonly country?: string | undefined;
	/** Latitude in decimal degrees. */
	readonly latitude?: number | undefined;
	/** Longitude in decimal degrees. */
	readonly longitude?: number | undefined;
}

/**
 * Subset of config representing stored prayer-calculation settings.
 */
export interface StoredPrayerSettings {
	/** Calculation method ID (0–23). */
	readonly method: number;
	/** Juristic school ID (`0` = Shafi, `1` = Hanafi). */
	readonly school: number;
	/** IANA timezone identifier, if explicitly set. */
	readonly timezone?: string | undefined;
}

/**
 * Default calculation method ID (ISNA).
 * @readonly
 */
export const DEFAULT_METHOD = 2;

/**
 * Default juristic school ID (Shafi).
 * @readonly
 */
export const DEFAULT_SCHOOL = 0;
