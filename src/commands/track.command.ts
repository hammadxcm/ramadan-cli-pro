/**
 * @module commands/track
 * @description Tracks daily prayer completion during Ramadan.
 */

import Conf from "conf";
import pc from "picocolors";
import type { ConfigRepository } from "../repositories/config.repository.js";

const PRAYERS = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;
type Prayer = (typeof PRAYERS)[number];

interface DayTrack {
	fajr: boolean;
	dhuhr: boolean;
	asr: boolean;
	maghrib: boolean;
	isha: boolean;
}

export interface TrackCommandOptions {
	readonly prayer?: Prayer | undefined;
	readonly show?: boolean | undefined;
	readonly date?: string | undefined;
}

const PRAYER_LABELS: Record<Prayer, string> = {
	fajr: "Fajr",
	dhuhr: "Dhuhr",
	asr: "Asr",
	maghrib: "Maghrib",
	isha: "Isha",
};

/**
 * Tracks daily prayer completion with persistent storage.
 */
export class TrackCommand {
	private readonly store: Conf<Record<string, DayTrack>>;

	constructor(_configRepository: ConfigRepository, storeCwd?: string) {
		const isTestRuntime = process.env.VITEST === "true" || process.env.NODE_ENV === "test";
		this.store = new Conf<Record<string, DayTrack>>({
			projectName: "ramadan-cli-pro-tracking",
			...(storeCwd ? { cwd: storeCwd } : isTestRuntime ? { cwd: "/tmp" } : {}),
		});
	}

	async execute(options: TrackCommandOptions): Promise<void> {
		const dateKey = options.date ?? this.getTodayKey();

		if (options.show || !options.prayer) {
			this.showStatus(dateKey);
			return;
		}

		const prayer = options.prayer;
		if (!PRAYERS.includes(prayer)) {
			console.error(pc.red(`Invalid prayer: ${prayer}. Use: ${PRAYERS.join(", ")}`));
			process.exit(1);
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
		track[prayer] = true;
		this.store.set(dateKey, track);
		console.log(pc.green(`\u2713 ${PRAYER_LABELS[prayer]} marked as complete for ${dateKey}`));
		this.showStatus(dateKey);
	}

	private showStatus(dateKey: string): void {
		const track = this.getDayTrack(dateKey);
		const completed = PRAYERS.filter((p) => track[p]).length;

		console.log("");
		console.log(pc.bold(`  Prayer Tracking - ${dateKey}`));
		console.log("");

		for (const prayer of PRAYERS) {
			const icon = track[prayer] ? pc.green("\u2713") : pc.dim("\u2717");
			const label = track[prayer] ? pc.green(PRAYER_LABELS[prayer]) : pc.dim(PRAYER_LABELS[prayer]);
			console.log(`  ${icon} ${label}`);
		}

		console.log("");
		console.log(pc.dim(`  ${completed}/${PRAYERS.length} prayers completed`));

		if (completed === PRAYERS.length) {
			console.log(pc.bold(pc.green("  All prayers completed! MashaAllah!")));
		}
		console.log("");
	}
}
