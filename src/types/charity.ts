/**
 * @module types/charity
 * @description Types for charity/sadaqah tracking.
 */

export interface CharityEntry {
	readonly id: string;
	readonly date: string;
	readonly amount: number;
	readonly description: string;
	readonly category: string;
}

export interface CharityStore {
	readonly entries: ReadonlyArray<CharityEntry>;
}
