/**
 * @module services/stats
 * @description Aggregates prayer tracking, streak, and goal data into summaries.
 */

import type { OverallSummary } from "../types/stats.js";
import type { GoalService } from "./goal.service.js";
import type { StreakService } from "./streak.service.js";

interface DayTrack {
	fajr: boolean;
	dhuhr: boolean;
	asr: boolean;
	maghrib: boolean;
	isha: boolean;
	taraweeh?: boolean;
}

/**
 * Computes aggregate statistics from prayer tracking, streaks, and goals.
 */
export class StatsService {
	constructor(
		private readonly streakService: StreakService,
		private readonly goalService: GoalService,
	) {}

	/**
	 * Computes overall summary from a tracking store.
	 */
	getOverallSummary(trackData: Readonly<Record<string, DayTrack>>): OverallSummary {
		const days = Object.values(trackData);
		const prayers = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;

		let totalCompleted = 0;
		const totalExpected = days.length * prayers.length;

		for (const day of days) {
			for (const prayer of prayers) {
				if (day[prayer]) totalCompleted++;
			}
		}

		const rate = totalExpected > 0 ? Math.round((totalCompleted / totalExpected) * 100) : 0;

		const streakData = this.streakService.getStreakData();
		const goals = this.goalService.listGoals();
		const goalsCompleted = goals.filter((g) => g.current >= g.target).length;

		return {
			totalPrayersCompleted: totalCompleted,
			totalPrayersExpected: totalExpected,
			prayerCompletionRate: rate,
			currentFastingStreak: streakData.currentStreak,
			longestFastingStreak: streakData.longestStreak,
			totalDaysFasted: streakData.totalDaysFasted,
			goalsCompleted,
			goalsTotal: goals.length,
		};
	}
}
