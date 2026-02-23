/**
 * @module types/stats
 * @description Types for Ramadan statistics summary.
 */

export interface WeeklySummary {
	readonly week: number;
	readonly prayersCompleted: number;
	readonly prayersTotal: number;
	readonly fastingDays: number;
}

export interface OverallSummary {
	readonly totalPrayersCompleted: number;
	readonly totalPrayersExpected: number;
	readonly prayerCompletionRate: number;
	readonly currentFastingStreak: number;
	readonly longestFastingStreak: number;
	readonly totalDaysFasted: number;
	readonly goalsCompleted: number;
	readonly goalsTotal: number;
}
