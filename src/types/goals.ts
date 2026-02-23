/**
 * @module types/goals
 * @description Types for Ramadan goal tracking.
 */

export interface Goal {
	readonly id: string;
	readonly title: string;
	readonly target: number;
	readonly current: number;
	readonly unit: string;
	readonly createdAt: string;
}

export interface GoalStore {
	readonly goals: ReadonlyArray<Goal>;
}
