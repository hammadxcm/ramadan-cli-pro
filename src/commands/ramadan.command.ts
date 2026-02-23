/**
 * @module commands/ramadan
 * @description The primary CLI command that fetches and displays Ramadan
 * timetables in various modes (today, all, specific roza) and formats
 * (table, JSON, plain, status-line).
 */

import type { Ora } from "ora";
import type { AppError } from "../errors/base.error.js";
import { CommandError } from "../errors/command.error.js";
import type { FormatterFactory } from "../formatters/formatter.factory.js";
import type { ConfigRepository } from "../repositories/config.repository.js";
import type { DateService } from "../services/date.service.js";
import type { HighlightService } from "../services/highlight.service.js";
import type { LocationService } from "../services/location.service.js";
import type { PrayerTimeService } from "../services/prayer-time.service.js";
import type { RamadanService } from "../services/ramadan.service.js";
import type { FirstRunSetup } from "../setup/first-run.setup.js";
import { canPromptInteractively } from "../setup/setup.utils.js";
import type { CommandContext } from "../types/command.js";
import type { PrayerData } from "../types/prayer.js";
import type {
	RamadanOutput,
	RamadanQuery,
	RamadanRow,
	RowAnnotationKind,
} from "../types/ramadan.js";
import { createSpinner } from "../ui/spinner.js";
import { getErrorMessage } from "../utils/error.js";
import type { ICommand } from "./command.interface.js";

interface JsonErrorPayload {
	readonly ok: false;
	readonly error: {
		readonly code: string;
		readonly message: string;
	};
}

const getJsonErrorCode = (message: string): string => {
	if (message.startsWith("Invalid first roza date")) return "INVALID_FIRST_ROZA_DATE";
	if (message.includes("Use either --all or --number")) return "INVALID_FLAG_COMBINATION";
	if (message.startsWith("Could not fetch prayer times.")) return "PRAYER_TIMES_FETCH_FAILED";
	if (message.startsWith("Could not fetch Ramadan calendar."))
		return "RAMADAN_CALENDAR_FETCH_FAILED";
	if (message.startsWith("Could not detect location.")) return "LOCATION_DETECTION_FAILED";
	if (message.startsWith("Could not find roza")) return "ROZA_NOT_FOUND";
	if (message === "unknown error") return "UNKNOWN_ERROR";
	return "RAMADAN_CLI_ERROR";
};

const toJsonErrorPayload = (error: unknown): JsonErrorPayload => {
	const message = getErrorMessage(error);
	return {
		ok: false,
		error: { code: getJsonErrorCode(message), message },
	};
};

/**
 * Main CLI command that fetches and renders Ramadan sehar/iftar timetables.
 * Supports today, all-days, and specific-roza modes with multiple output formats.
 */
export class RamadanCommand implements ICommand {
	constructor(
		private readonly configRepository: ConfigRepository,
		private readonly locationService: LocationService,
		private readonly prayerTimeService: PrayerTimeService,
		private readonly ramadanService: RamadanService,
		private readonly dateService: DateService,
		private readonly formatterFactory: FormatterFactory,
		private readonly firstRunSetup: FirstRunSetup,
	) {}

	validate(context: CommandContext): void {
		if (context.all && context.rozaNumber !== undefined) {
			throw new Error("Use either --all or --number, not both.");
		}
	}

	async execute(context: CommandContext): Promise<void> {
		const isSilent = context.json || context.status;
		const spinner = isSilent ? null : createSpinner("Fetching Ramadan timings...");

		if (context.status) {
			try {
				const query = await this.locationService.resolveQuery({
					city: context.city,
					allowInteractiveSetup: false,
				});
				const today = await this.prayerTimeService.fetchDay(query);
				const highlight = this.ramadanService.getHighlightState(today);
				if (highlight) {
					const formatter = this.formatterFactory.select({ status: true });
					console.log(
						formatter.format({
							output: {
								mode: "today",
								location: query.address,
								hijriYear: 0,
								rows: [],
							},
							highlight,
						}),
					);
				}
			} catch {
				// silent failure for status lines
			}
			return;
		}

		try {
			const configuredFirstRozaDate = this.getConfiguredFirstRozaDate(context);
			const query = await this.locationService.resolveQuery({
				city: context.city,
				allowInteractiveSetup: !context.json,
				onSetupNeeded: canPromptInteractively() ? () => this.firstRunSetup.run() : undefined,
			});

			spinner?.start();
			const today = await this.prayerTimeService.fetchDay(query);
			const todayGregorianDate = this.dateService.parseGregorian(today.date.gregorian.date);
			if (!todayGregorianDate) {
				throw new Error("Could not parse Gregorian date from prayer response.");
			}
			const targetYear = this.ramadanService.getTargetRamadanYear(today);
			const hasCustomFirstRozaDate = configuredFirstRozaDate !== null;

			if (context.rozaNumber !== undefined) {
				await this.handleRozaNumber(
					context,
					query,
					today,
					targetYear,
					configuredFirstRozaDate,
					hasCustomFirstRozaDate,
					spinner,
				);
				return;
			}

			if (!context.all) {
				await this.handleToday(
					context,
					query,
					today,
					todayGregorianDate,
					targetYear,
					configuredFirstRozaDate,
					hasCustomFirstRozaDate,
					spinner,
				);
				return;
			}

			await this.handleAll(
				context,
				query,
				today,
				todayGregorianDate,
				targetYear,
				configuredFirstRozaDate,
				hasCustomFirstRozaDate,
				spinner,
			);
		} catch (error) {
			if (context.json) {
				process.stderr.write(`${JSON.stringify(toJsonErrorPayload(error))}\n`);
			} else {
				spinner?.fail(error instanceof Error ? error.message : "Failed to fetch Ramadan timings");
			}
			throw new CommandError(
				error instanceof Error ? error.message : "Failed to fetch Ramadan timings",
			);
		}
	}

	private getConfiguredFirstRozaDate(context: CommandContext): Date | null {
		if (context.clearFirstRozaDate) {
			this.configRepository.clearStoredFirstRozaDate();
			return null;
		}

		if (context.firstRozaDate) {
			const parsedExplicit = this.dateService.parseIso(context.firstRozaDate);
			if (!parsedExplicit) {
				throw new Error("Invalid first roza date. Use YYYY-MM-DD.");
			}
			this.configRepository.setStoredFirstRozaDate(context.firstRozaDate);
			return parsedExplicit;
		}

		const storedDate = this.configRepository.getStoredFirstRozaDate();
		if (!storedDate) return null;

		const parsedStored = this.dateService.parseIso(storedDate);
		if (parsedStored) return parsedStored;

		this.configRepository.clearStoredFirstRozaDate();
		return null;
	}

	private async handleRozaNumber(
		context: CommandContext,
		query: RamadanQuery,
		today: PrayerData,
		targetYear: number,
		configuredFirstRozaDate: Date | null,
		hasCustomFirstRozaDate: boolean,
		spinner: Ora | null,
	): Promise<void> {
		// biome-ignore lint/style/noNonNullAssertion: rozaNumber is validated before calling this method
		const rozaNumber = context.rozaNumber!;
		let row: RamadanRow;
		let hijriYear = targetYear;
		let selectedDay: PrayerData;

		if (hasCustomFirstRozaDate && configuredFirstRozaDate) {
			const customDays = await this.prayerTimeService.fetchCustomDays(
				query,
				configuredFirstRozaDate,
			);
			row = this.ramadanService.getRowByRozaNumber(customDays, rozaNumber);
			selectedDay = this.ramadanService.getDayByRozaNumber(customDays, rozaNumber);
			hijriYear = this.ramadanService.getHijriYearFromRozaNumber(
				customDays,
				rozaNumber,
				targetYear,
			);
		} else {
			const calendar = await this.prayerTimeService.fetchCalendar(query, targetYear);
			row = this.ramadanService.getRowByRozaNumber(calendar, rozaNumber);
			selectedDay = this.ramadanService.getDayByRozaNumber(calendar, rozaNumber);
			hijriYear = this.ramadanService.getHijriYearFromRozaNumber(calendar, rozaNumber, targetYear);
		}

		const output: RamadanOutput = {
			mode: "number",
			location: query.address,
			hijriYear,
			rows: [row],
		};
		spinner?.stop();
		const formatter = this.formatterFactory.select({
			json: context.json,
			plain: context.plain,
		});
		console.log(
			formatter.format({
				output,
				highlight: this.ramadanService.getHighlightState(selectedDay),
				plain: context.plain,
			}),
		);
	}

	private async handleToday(
		context: CommandContext,
		query: RamadanQuery,
		today: PrayerData,
		todayGregorianDate: Date,
		targetYear: number,
		configuredFirstRozaDate: Date | null,
		hasCustomFirstRozaDate: boolean,
		spinner: Ora | null,
	): Promise<void> {
		let row: RamadanRow | null = null;
		let outputHijriYear = targetYear;
		let highlightDay: PrayerData | null = null;

		if (hasCustomFirstRozaDate && configuredFirstRozaDate) {
			const rozaNumber = this.dateService.getRozaNumber(
				configuredFirstRozaDate,
				todayGregorianDate,
			);

			if (rozaNumber < 1) {
				const firstRozaDay = await this.prayerTimeService.fetchDay(query, configuredFirstRozaDate);
				row = this.ramadanService.toRamadanRow(firstRozaDay, 1);
				highlightDay = firstRozaDay;
				outputHijriYear = Number.parseInt(firstRozaDay.date.hijri.year, 10);
			} else {
				row = this.ramadanService.toRamadanRow(today, rozaNumber);
				highlightDay = today;
				outputHijriYear = Number.parseInt(today.date.hijri.year, 10);
			}
		} else {
			const isRamadanNow = today.date.hijri.month.number === 9;
			if (isRamadanNow) {
				row = this.ramadanService.toRamadanRow(
					today,
					this.dateService.getRozaNumberFromHijriDay(today.date.hijri.day),
				);
				highlightDay = today;
			} else {
				const calendar = await this.prayerTimeService.fetchCalendar(query, targetYear);
				const firstRamadanDay = calendar[0];
				if (!firstRamadanDay) {
					throw new Error("Could not find the first day of Ramadan.");
				}
				row = this.ramadanService.toRamadanRow(firstRamadanDay, 1);
				highlightDay = firstRamadanDay;
				outputHijriYear = Number.parseInt(firstRamadanDay.date.hijri.year, 10);
			}
		}

		if (!row) {
			throw new Error("Could not determine roza number.");
		}

		const output: RamadanOutput = {
			mode: "today",
			location: query.address,
			hijriYear: outputHijriYear,
			rows: [row],
		};
		spinner?.stop();
		const formatter = this.formatterFactory.select({
			json: context.json,
			plain: context.plain,
		});
		console.log(
			formatter.format({
				output,
				highlight: this.ramadanService.getHighlightState(highlightDay ?? today),
				plain: context.plain,
			}),
		);
	}

	private async handleAll(
		context: CommandContext,
		query: RamadanQuery,
		today: PrayerData,
		todayGregorianDate: Date,
		targetYear: number,
		configuredFirstRozaDate: Date | null,
		hasCustomFirstRozaDate: boolean,
		spinner: Ora | null,
	): Promise<void> {
		let rows: ReadonlyArray<RamadanRow> = [];
		let hijriYear = targetYear;

		if (hasCustomFirstRozaDate && configuredFirstRozaDate) {
			const customDays = await this.prayerTimeService.fetchCustomDays(
				query,
				configuredFirstRozaDate,
			);
			rows = customDays.map((day, index) => this.ramadanService.toRamadanRow(day, index + 1));
			const firstCustomDay = customDays[0];
			if (firstCustomDay) {
				hijriYear = Number.parseInt(firstCustomDay.date.hijri.year, 10);
			}
		} else {
			const calendar = await this.prayerTimeService.fetchCalendar(query, targetYear);
			rows = calendar.map((day, index) => this.ramadanService.toRamadanRow(day, index + 1));
		}

		const output: RamadanOutput = {
			mode: "all",
			location: query.address,
			hijriYear,
			rows,
		};
		const allModeRowAnnotations = this.ramadanService.getAllModeRowAnnotations({
			today,
			todayGregorianDate,
			targetYear,
			configuredFirstRozaDate,
		});

		spinner?.stop();
		const formatter = this.formatterFactory.select({
			json: context.json,
			plain: context.plain,
		});
		console.log(
			formatter.format({
				output,
				highlight: this.ramadanService.getHighlightState(today),
				rowAnnotations: allModeRowAnnotations,
				plain: context.plain,
			}),
		);
	}
}
