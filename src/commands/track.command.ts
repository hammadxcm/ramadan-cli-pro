/**
 * @module commands/track
 * @description Tracks daily prayer completion and fasting during Ramadan.
 */

import pc from "picocolors";
import { CommandError } from "../errors/command.error.js";
import type { ConfigRepository } from "../repositories/config.repository.js";
import type { I18nService } from "../services/i18n.service.js";
import type { StreakService } from "../services/streak.service.js";
import { createConfStore } from "../utils/store.js";

const PRAYERS = ["fajr", "dhuhr", "asr", "maghrib", "isha", "taraweeh"] as const;
type Prayer = (typeof PRAYERS)[number];

interface DayTrack {
	fajr: boolean;
	dhuhr: boolean;
	asr: boolean;
	maghrib: boolean;
	isha: boolean;
	taraweeh?: boolean;
}

export interface TrackCommandOptions {
	readonly prayer?: Prayer | undefined;
	readonly show?: boolean | undefined;
	readonly date?: string | undefined;
	readonly fasted?: boolean | undefined;
	readonly vacation?: boolean | undefined;
}

const PRAYER_LABELS: Record<Prayer, string> = {
	fajr: "Fajr",
	dhuhr: "Dhuhr",
	asr: "Asr",
	maghrib: "Maghrib",
	isha: "Isha",
	taraweeh: "Taraweeh",
};

/**
 * Tracks daily prayer completion and fasting with persistent storage.
 */
export class TrackCommand {
	private readonly store;
	private readonly streakService: StreakService | null;
	private readonly i18n: I18nService | undefined;

	constructor(
		_configRepository: ConfigRepository,
		streakService?: StreakService,
		storeCwd?: string,
		i18nService?: I18nService,
	) {
		this.streakService = streakService ?? null;
		this.i18n = i18nService;
		this.store = createConfStore<Record<string, DayTrack>>({
			projectName: "ramadan-cli-pro-tracking",
			cwd: storeCwd,
		});
	}

	private t(key: string, fallback: string, options?: Record<string, unknown>): string {
		return this.i18n ? this.i18n.t(key, options) : fallback;
	}

	async execute(options: TrackCommandOptions): Promise<void> {
		const dateKey = options.date ?? this.getTodayKey();

		if (options.vacation) {
			this.markVacation(dateKey);
			return;
		}

		if (options.fasted) {
			this.markFasted(dateKey);
			return;
		}

		if (options.show || !options.prayer) {
			this.showStatus(dateKey);
			return;
		}

		const prayer = options.prayer;
		if (!PRAYERS.includes(prayer)) {
			throw new CommandError(
				this.t("track.invalidPrayer", `Invalid prayer: ${prayer}. Use: ${PRAYERS.join(", ")}`, {
					prayer,
					list: PRAYERS.join(", "),
				}),
			);
		}

		this.markPrayer(dateKey, prayer);
	}

	private getTodayKey(): string {
		const now = new Date();
		return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
	}

	private getDayTrack(dateKey: string): DayTrack {
		const existing = this.store.get(dateKey);
		if (existing) return existing;
		return { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false };
	}

	private markPrayer(dateKey: string, prayer: Prayer): void {
		const track = this.getDayTrack(dateKey);
		if (prayer === "taraweeh") {
			(track as { taraweeh?: boolean }).taraweeh = true;
		} else {
			track[prayer] = true;
		}
		this.store.set(dateKey, track);
		console.log(
			pc.green(
				`\u2713 ${this.t("track.marked", `${PRAYER_LABELS[prayer]} marked as complete for ${dateKey}`, { prayer: PRAYER_LABELS[prayer], date: dateKey })}`,
			),
		);
		this.showStatus(dateKey);
	}

	private markFasted(dateKey: string): void {
		if (this.streakService) {
			this.streakService.markDay(dateKey);
			const streak = this.streakService.getCurrentStreak();
			console.log(
				pc.green(
					`\u2713 ${this.t("track.fastingMarked", `Fasting marked for ${dateKey}`, { date: dateKey })}`,
				),
			);
			if (streak > 0) {
				console.log(
					pc.dim(
						`  ${this.t("track.streak", `Current streak: ${streak} days`, { count: streak })}`,
					),
				);
			}
		} else {
			console.log(
				pc.green(
					`\u2713 ${this.t("track.fastingMarked", `Fasting marked for ${dateKey}`, { date: dateKey })}`,
				),
			);
		}
	}

	private markVacation(dateKey: string): void {
		if (this.streakService) {
			this.streakService.markVacation(dateKey);
		}
		console.log(
			pc.green(
				`\u2713 ${this.t("track.vacationMarked", `Vacation marked for ${dateKey} (streak preserved)`, { date: dateKey })}`,
			),
		);
	}

	private showStatus(dateKey: string): void {
		const track = this.getDayTrack(dateKey);
		const mainPrayers = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;
		const completed = mainPrayers.filter((p) => track[p]).length;

		console.log("");
		console.log(
			pc.bold(`  ${this.t("track.title", `Prayer Tracking - ${dateKey}`, { date: dateKey })}`),
		);
		console.log("");

		for (const prayer of PRAYERS) {
			const isDone = prayer === "taraweeh" ? track.taraweeh === true : track[prayer];
			const icon = isDone ? pc.green("\u2713") : pc.dim("\u2717");
			const label = isDone ? pc.green(PRAYER_LABELS[prayer]) : pc.dim(PRAYER_LABELS[prayer]);
			console.log(`  ${icon} ${label}`);
		}

		console.log("");
		console.log(
			pc.dim(
				`  ${this.t("track.completed", `${completed}/${mainPrayers.length} prayers completed`, { completed, total: mainPrayers.length })}`,
			),
		);

		if (completed === mainPrayers.length) {
			console.log(
				pc.bold(pc.green(`  ${this.t("track.allComplete", "All prayers completed! MashaAllah!")}`)),
			);
		}
		console.log("");
	}
}
