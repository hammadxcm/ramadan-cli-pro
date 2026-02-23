/**
 * @module commands/stats
 * @description Displays Ramadan statistics summary.
 */

import pc from "picocolors";
import type { BadgeService } from "../services/badge.service.js";
import type { I18nService } from "../services/i18n.service.js";
import type { StatsService } from "../services/stats.service.js";
import { createConfStore } from "../utils/store.js";

interface DayTrack {
	fajr: boolean;
	dhuhr: boolean;
	asr: boolean;
	maghrib: boolean;
	isha: boolean;
	taraweeh?: boolean;
}

export interface StatsCommandOptions {
	readonly weekly?: boolean | undefined;
}

/**
 * CLI command for displaying Ramadan statistics.
 */
export class StatsCommand {
	private readonly i18n: I18nService | undefined;
	private readonly badge: BadgeService | undefined;

	constructor(
		private readonly statsService: StatsService,
		i18nService?: I18nService,
		badgeService?: BadgeService,
	) {
		this.i18n = i18nService;
		this.badge = badgeService;
	}

	private t(key: string, fallback: string, options?: Record<string, unknown>): string {
		return this.i18n ? this.i18n.t(key, options) : fallback;
	}

	async execute(options: StatsCommandOptions): Promise<void> {
		const trackStore = createConfStore<Record<string, DayTrack>>({
			projectName: "ramadan-cli-pro-tracking",
		});

		const trackData = trackStore.store as Record<string, DayTrack>;
		const summary = this.statsService.getOverallSummary(trackData);

		console.log("");
		console.log(pc.bold(pc.green(`  ${this.t("stats.title", "Ramadan Statistics")}`)));
		console.log("");

		console.log(
			`  ${pc.bold(this.t("stats.prayerCompletion", "Prayer Completion:"))} ${summary.prayerCompletionRate}%`,
		);
		console.log(
			`  ${pc.dim(this.t("stats.prayersCompleted", `${summary.totalPrayersCompleted}/${summary.totalPrayersExpected} prayers completed`, { completed: summary.totalPrayersCompleted, total: summary.totalPrayersExpected }))}`,
		);
		console.log("");

		console.log(
			`  ${pc.bold(this.t("stats.fastingStreak", "Fasting Streak:"))} ${pc.green(String(summary.currentFastingStreak))} days`,
		);
		console.log(
			`  ${pc.dim(this.t("stats.streakDetails", `Longest: ${summary.longestFastingStreak} days | Total fasted: ${summary.totalDaysFasted} days`, { longest: summary.longestFastingStreak, total: summary.totalDaysFasted }))}`,
		);
		console.log("");

		if (summary.goalsTotal > 0) {
			console.log(
				`  ${pc.bold(this.t("stats.goals", "Goals:"))} ${this.t("stats.goalsCompleted", `${summary.goalsCompleted}/${summary.goalsTotal} completed`, { completed: summary.goalsCompleted, total: summary.goalsTotal })}`,
			);
		} else {
			console.log(pc.dim(`  ${this.t("stats.noGoals", "No goals set.")}`));
		}

		console.log("");

		// Badge section
		if (this.badge) {
			const earned = this.badge.checkEarned(trackData);

			console.log(pc.bold(`  ${this.t("stats.badgesEarned", "Badges Earned:")}`));

			if (earned.length > 0) {
				const badgeLine = earned.map((b) => `${b.icon} ${b.title}`).join("  ");
				console.log(`  ${badgeLine}`);
			} else {
				console.log(pc.dim(`  ${this.t("stats.noBadges", "No badges earned yet.")}`));
			}

			console.log("");
		}
	}
}
