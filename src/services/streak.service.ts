/**
 * @module services/streak
 * @description Fasting streak tracking service with persistent storage.
 */

import type { StreakData } from "../types/streak.js";
import { createConfStore } from "../utils/store.js";

type StreakStore = Record<string, boolean>;

const VACATION_PREFIX = "vacation:";

/**
 * Tracks daily fasting and computes streak statistics.
 */
export class StreakService {
	private readonly store;

	constructor(storeCwd?: string) {
		this.store = createConfStore<StreakStore>({
			projectName: "ramadan-cli-pro-streaks",
			cwd: storeCwd,
		});
	}

	/**
	 * Marks a day as fasted.
	 */
	markDay(date: string): void {
		if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
			throw new Error("Invalid date format. Use YYYY-MM-DD.");
		}
		this.store.set(date, true);
	}

	/**
	 * Unmarks a day.
	 */
	unmarkDay(date: string): void {
		if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
			throw new Error("Invalid date format. Use YYYY-MM-DD.");
		}
		this.store.delete(date);
	}

	/**
	 * Marks a day as a vacation day.
	 * Vacation days don't break streaks but don't count toward them.
	 */
	markVacation(date: string): void {
		if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
			throw new Error("Invalid date format. Use YYYY-MM-DD.");
		}
		this.store.set(`${VACATION_PREFIX}${date}`, true);
	}

	/**
	 * Checks if a day is marked as vacation.
	 */
	isVacation(date: string): boolean {
		return this.store.get(`${VACATION_PREFIX}${date}`) === true;
	}

	/**
	 * Returns the current consecutive streak ending today.
	 * Vacation days are skipped (they don't break or count toward the streak).
	 */
	getCurrentStreak(): number {
		const today = new Date();
		let streak = 0;
		const current = new Date(today);

		while (true) {
			const key = this.formatDate(current);
			if (this.store.get(key)) {
				streak++;
				current.setDate(current.getDate() - 1);
			} else if (this.isVacation(key)) {
				// Vacation day: skip it without breaking the streak
				current.setDate(current.getDate() - 1);
			} else {
				break;
			}
		}

		return streak;
	}

	/**
	 * Returns the longest consecutive streak ever.
	 * Vacation days are skipped (they don't break or count toward the streak).
	 */
	getLongestStreak(): number {
		const allDates = this.getSortedDates();
		if (allDates.length === 0) return 0;

		let longest = 1;
		let current = 1;

		for (let i = 1; i < allDates.length; i++) {
			const prev = new Date(allDates[i - 1] as string);
			const curr = new Date(allDates[i] as string);
			const diffDays = Math.round((curr.getTime() - prev.getTime()) / (24 * 60 * 60 * 1000));

			if (diffDays === 1) {
				current++;
				if (current > longest) longest = current;
			} else if (this.areAllDaysBetweenVacation(prev, curr)) {
				// All gap days are vacation, so the streak continues
				current++;
				if (current > longest) longest = current;
			} else {
				current = 1;
			}
		}

		return longest;
	}

	/**
	 * Returns the total number of days fasted.
	 */
	getTotalDaysFasted(): number {
		return this.getSortedDates().length;
	}

	/**
	 * Returns aggregated streak data.
	 */
	getStreakData(): StreakData {
		const sortedDates = this.getSortedDates();
		return {
			currentStreak: this.getCurrentStreak(),
			longestStreak: this.getLongestStreak(),
			lastFastedDate: sortedDates[sortedDates.length - 1],
			totalDaysFasted: sortedDates.length,
		};
	}

	/**
	 * Checks if all days between two dates (exclusive) are vacation days.
	 */
	private areAllDaysBetweenVacation(start: Date, end: Date): boolean {
		const cursor = new Date(start);
		cursor.setDate(cursor.getDate() + 1);

		while (cursor < end) {
			const key = this.formatDate(cursor);
			if (!this.isVacation(key)) {
				return false;
			}
			cursor.setDate(cursor.getDate() + 1);
		}

		return true;
	}

	private getSortedDates(): ReadonlyArray<string> {
		const store = this.store.store as Record<string, unknown>;
		return Object.keys(store)
			.filter((key) => !key.startsWith(VACATION_PREFIX) && store[key] === true)
			.sort();
	}

	private formatDate(date: Date): string {
		return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
	}
}
