/**
 * @module services/goal
 * @description Ramadan goal tracking service with persistent storage.
 */

import type { Goal } from "../types/goals.js";
import { createConfStore } from "../utils/store.js";

interface GoalStoreData {
	goals: Array<Goal>;
	[key: string]: unknown;
}

/**
 * CRUD operations for Ramadan goals with progress tracking.
 */
export class GoalService {
	private readonly store;

	constructor(storeCwd?: string) {
		this.store = createConfStore<GoalStoreData>({
			projectName: "ramadan-cli-pro-goals",
			cwd: storeCwd,
			defaults: { goals: [] },
		});
	}

	/**
	 * Adds a new goal.
	 */
	addGoal(title: string, target: number, unit: string): Goal {
		if (!title.trim()) throw new Error("Goal title cannot be empty.");
		if (target <= 0) throw new Error("Goal target must be greater than zero.");
		const goal: Goal = {
			id: Date.now().toString(36),
			title,
			target,
			current: 0,
			unit,
			createdAt: new Date().toISOString(),
		};
		const goals = [...this.store.get("goals")];
		goals.push(goal);
		this.store.set("goals", goals);
		return goal;
	}

	/**
	 * Updates a goal's progress.
	 */
	updateGoal(id: string, progress: number): Goal | null {
		if (progress < 0) throw new Error("Progress cannot be negative.");
		const goals = [...this.store.get("goals")];
		const index = goals.findIndex((g) => g.id === id);
		if (index === -1) return null;

		const updated: Goal = { ...(goals[index] as Goal), current: progress };
		goals[index] = updated;
		this.store.set("goals", goals);
		return updated;
	}

	/**
	 * Deletes a goal by ID.
	 */
	deleteGoal(id: string): boolean {
		const goals = this.store.get("goals");
		const filtered = goals.filter((g) => g.id !== id);
		if (filtered.length === goals.length) return false;
		this.store.set("goals", filtered);
		return true;
	}

	/**
	 * Returns all goals.
	 */
	listGoals(): ReadonlyArray<Goal> {
		return this.store.get("goals");
	}

	/**
	 * Returns a single goal by ID.
	 */
	getGoal(id: string): Goal | undefined {
		return this.store.get("goals").find((g) => g.id === id);
	}
}
