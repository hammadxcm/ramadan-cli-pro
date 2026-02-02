/**
 * @module types/ramadan
 * @description Types for the Ramadan schedule output, including daily rows,
 * display modes, highlight state, and query parameters.
 */

/**
 * A single row in the Ramadan timetable representing one day's fast.
 */
export interface RamadanRow {
	/** Roza (fast) number, 1–30. */
	readonly roza: number;
	/** Sehar (suhoor) time string. */
	readonly sehar: string;
	/** Iftar time string. */
	readonly iftar: string;
	/** Gregorian date string for this roza. */
	readonly date: string;
	/** Hijri date string for this roza. */
	readonly hijri: string;
}

/**
 * The complete output produced by the Ramadan service, ready for formatting.
 */
export interface RamadanOutput {
	/** Display mode: `"today"` for current roza, `"all"` for full month, `"number"` for a specific roza. */
	readonly mode: "today" | "all" | "number";
	/** Human-readable location label (e.g. `"Karachi, Pakistan"`). */
	readonly location: string;
	/** Hijri year of the Ramadan calendar. */
	readonly hijriYear: number;
	/** Array of roza rows to display. */
	readonly rows: ReadonlyArray<RamadanRow>;
}

/**
 * Current highlight state for the dashboard, indicating active and upcoming events.
 */
export interface HighlightState {
	/** Label for the currently active event (e.g. `"Sehar"` or `"Iftar"`). */
	readonly current: string;
	/** Label for the next upcoming event. */
	readonly next: string;
	/** Formatted countdown string until the next event (e.g. `"02:15:30"`). */
	readonly countdown: string;
}

/**
 * Discriminator for annotating a {@link RamadanRow} as current or next.
 */
export type RowAnnotationKind = "current" | "next";

/**
 * Query parameters for fetching a Ramadan timetable.
 */
export interface RamadanQuery {
	/** Address string to geocode (e.g. city name). */
	readonly address: string;
	/** Optional city name override. */
	readonly city?: string | undefined;
	/** Optional country name override. */
	readonly country?: string | undefined;
	/** Optional latitude override in decimal degrees. */
	readonly latitude?: number | undefined;
	/** Optional longitude override in decimal degrees. */
	readonly longitude?: number | undefined;
	/** Optional calculation method ID (0–23). */
	readonly method?: number | undefined;
	/** Optional juristic school ID (`0` = Shafi, `1` = Hanafi). */
	readonly school?: number | undefined;
	/** Optional IANA timezone override. */
	readonly timezone?: string | undefined;
}
