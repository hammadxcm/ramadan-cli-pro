/**
 * @module services/ramadan
 * @description Main orchestrator service for building Ramadan timetable output.
 * Converts raw prayer data into display-ready rows, computes highlight state,
 * and annotates rows for the "all days" view.
 */

import { RozaNotFoundError } from "../errors/prayer.error.js";
import type { PrayerData } from "../types/prayer.js";
import type {
	HighlightState,
	RamadanOutput,
	RamadanRow,
	RowAnnotationKind,
} from "../types/ramadan.js";
import type { DateService } from "./date.service.js";
import type { HighlightService } from "./highlight.service.js";
import type { LocationService } from "./location.service.js";
import type { PrayerTimeService } from "./prayer-time.service.js";
import type { TimeFormatService } from "./time-format.service.js";

/**
 * Central service that ties together prayer-time fetching, date calculations,
 * highlight state, and row formatting.
 */
export class RamadanService {
	/**
	 * @param prayerTimeService - For fetching prayer data.
	 * @param locationService - For resolving locations.
	 * @param highlightService - For computing real-time highlight state.
	 * @param dateService - For date parsing and roza calculations.
	 * @param timeFormatService - For formatting prayer times.
	 */
	constructor(
		private readonly prayerTimeService: PrayerTimeService,
		private readonly locationService: LocationService,
		private readonly highlightService: HighlightService,
		private readonly dateService: DateService,
		private readonly timeFormatService: TimeFormatService,
	) {}

	/**
	 * Converts a single day's prayer data into a display-ready {@link RamadanRow}.
	 *
	 * @param day - Raw prayer data for one day.
	 * @param roza - The roza number (1–30).
	 * @returns A formatted row.
	 */
	toRamadanRow(day: PrayerData, roza: number): RamadanRow {
		return {
			roza,
			sehar: this.timeFormatService.to12Hour(day.timings.Fajr),
			iftar: this.timeFormatService.to12Hour(day.timings.Maghrib),
			date: day.date.readable,
			hijri: `${day.date.hijri.day} ${day.date.hijri.month.en} ${day.date.hijri.year}`,
		};
	}

	/**
	 * Computes the current highlight state for a given day.
	 *
	 * @param day - Prayer data for the day to highlight.
	 * @returns The highlight state, or `null` if not applicable.
	 */
	getHighlightState(day: PrayerData): HighlightState | null {
		return this.highlightService.getHighlightState(day);
	}

	/**
	 * Formats a highlight state into a single status-line string.
	 *
	 * @param highlight - The highlight state to format.
	 * @returns A concise status string.
	 */
	formatStatusLine(highlight: HighlightState): string {
		return this.highlightService.formatStatusLine(highlight);
	}

	/**
	 * Determines the target Hijri year for the Ramadan calendar.
	 *
	 * @param today - Today's prayer data (used for the current Hijri date).
	 * @returns The Hijri year to query.
	 */
	getTargetRamadanYear(today: PrayerData): number {
		return this.dateService.getTargetRamadanYear(
			today.date.hijri.year,
			today.date.hijri.month.number,
		);
	}

	/**
	 * Retrieves a specific roza's row from the calendar.
	 *
	 * @param days - Full Ramadan calendar data.
	 * @param rozaNumber - The 1-based roza number.
	 * @returns The formatted row.
	 * @throws {RozaNotFoundError} If the roza number is out of range.
	 */
	getRowByRozaNumber(days: ReadonlyArray<PrayerData>, rozaNumber: number): RamadanRow {
		const day = days[rozaNumber - 1];
		if (!day) {
			throw new RozaNotFoundError(rozaNumber);
		}
		return this.toRamadanRow(day, rozaNumber);
	}

	/**
	 * Retrieves raw prayer data for a specific roza number.
	 *
	 * @param days - Full Ramadan calendar data.
	 * @param rozaNumber - The 1-based roza number.
	 * @returns The prayer data for that day.
	 * @throws {RozaNotFoundError} If the roza number is out of range.
	 */
	getDayByRozaNumber(days: ReadonlyArray<PrayerData>, rozaNumber: number): PrayerData {
		const day = days[rozaNumber - 1];
		if (!day) {
			throw new RozaNotFoundError(rozaNumber);
		}
		return day;
	}

	/**
	 * Extracts the Hijri year from a specific roza day, with a fallback.
	 *
	 * @param days - Full Ramadan calendar data.
	 * @param rozaNumber - The 1-based roza number.
	 * @param fallbackYear - Year to return if the roza is not found.
	 * @returns The Hijri year.
	 */
	getHijriYearFromRozaNumber(
		days: ReadonlyArray<PrayerData>,
		rozaNumber: number,
		fallbackYear: number,
	): number {
		const day = days[rozaNumber - 1];
		if (!day) {
			return fallbackYear;
		}
		return Number.parseInt(day.date.hijri.year, 10);
	}

	/**
	 * Builds row annotations (current/next markers) for the "all days" view.
	 *
	 * @param input - Today's data, the target year, and optional first-roza date override.
	 * @returns A map of roza numbers to their annotation kind.
	 */
	getAllModeRowAnnotations(input: {
		readonly today: PrayerData;
		readonly todayGregorianDate: Date;
		readonly targetYear: number;
		readonly configuredFirstRozaDate: Date | null;
	}): Readonly<Record<number, RowAnnotationKind>> {
		const annotations: Record<number, RowAnnotationKind> = {};

		const setAnnotation = (roza: number, kind: RowAnnotationKind): void => {
			if (roza >= 1 && roza <= 30) {
				annotations[roza] = kind;
			}
		};

		if (input.configuredFirstRozaDate) {
			const currentRoza = this.dateService.getRozaNumber(
				input.configuredFirstRozaDate,
				input.todayGregorianDate,
			);

			if (currentRoza < 1) {
				setAnnotation(1, "next");
				return annotations;
			}

			setAnnotation(currentRoza, "current");
			setAnnotation(currentRoza + 1, "next");
			return annotations;
		}

		const todayHijriYear = Number.parseInt(input.today.date.hijri.year, 10);
		const isRamadanNow =
			input.today.date.hijri.month.number === 9 && todayHijriYear === input.targetYear;
		if (!isRamadanNow) {
			setAnnotation(1, "next");
			return annotations;
		}

		const currentRoza = this.dateService.getRozaNumberFromHijriDay(input.today.date.hijri.day);
		setAnnotation(currentRoza, "current");
		setAnnotation(currentRoza + 1, "next");
		return annotations;
	}
}
