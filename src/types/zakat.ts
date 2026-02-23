/**
 * @module types/zakat
 * @description Types for Zakat calculation.
 */

export interface ZakatInput {
	readonly cash?: number | undefined;
	readonly gold?: number | undefined;
	readonly silver?: number | undefined;
	readonly investments?: number | undefined;
	readonly property?: number | undefined;
	readonly debts?: number | undefined;
}

export interface ZakatResult {
	readonly totalWealth: number;
	readonly totalDeductions: number;
	readonly netWorth: number;
	readonly nisabGold: number;
	readonly nisabSilver: number;
	readonly isAboveNisab: boolean;
	readonly zakatDue: number;
}
