/**
 * @module types/streak
 * @description Types for fasting streak tracking.
 */

export interface StreakData {
	readonly currentStreak: number;
	readonly longestStreak: number;
	readonly lastFastedDate?: string | undefined;
	readonly totalDaysFasted: number;
}

export interface StreakStore {
	readonly [date: string]: boolean;
}
