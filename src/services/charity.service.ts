/**
 * @module services/charity
 * @description Charity/sadaqah tracking service with persistent storage.
 */

import type { CharityEntry } from "../types/charity.js";
import { createConfStore } from "../utils/store.js";

interface CharityStoreData {
	entries: Array<CharityEntry>;
	[key: string]: unknown;
}

/**
 * CRUD operations for charity entries with summaries.
 */
export class CharityService {
	private readonly store;

	constructor(storeCwd?: string) {
		this.store = createConfStore<CharityStoreData>({
			projectName: "ramadan-cli-pro-charity",
			cwd: storeCwd,
			defaults: { entries: [] },
		});
	}

	/**
	 * Adds a new charity entry.
	 */
	addEntry(amount: number, description: string, category: string): CharityEntry {
		if (amount <= 0) throw new Error("Charity amount must be greater than zero.");
		if (!description.trim()) throw new Error("Charity description cannot be empty.");
		const entry: CharityEntry = {
			id: Date.now().toString(36),
			date: new Date().toISOString().slice(0, 10),
			amount,
			description,
			category,
		};
		const entries = [...this.store.get("entries")];
		entries.push(entry);
		this.store.set("entries", entries);
		return entry;
	}

	/**
	 * Deletes an entry by ID.
	 */
	deleteEntry(id: string): boolean {
		const entries = this.store.get("entries");
		const filtered = entries.filter((e) => e.id !== id);
		if (filtered.length === entries.length) return false;
		this.store.set("entries", filtered);
		return true;
	}

	/**
	 * Returns all entries.
	 */
	listEntries(): ReadonlyArray<CharityEntry> {
		return this.store.get("entries");
	}

	/**
	 * Returns entries for a specific date.
	 */
	getDailySummary(date: string): ReadonlyArray<CharityEntry> {
		return this.store.get("entries").filter((e) => e.date === date);
	}

	/**
	 * Returns the total amount donated.
	 */
	getTotalAmount(): number {
		return this.store.get("entries").reduce((sum, e) => sum + e.amount, 0);
	}
}
