/**
 * @module services/zakat
 * @description Zakat calculation service.
 */

import {
	DEFAULT_GOLD_PRICE_PER_GRAM,
	DEFAULT_SILVER_PRICE_PER_GRAM,
	NISAB_GOLD_GRAMS,
	NISAB_SILVER_GRAMS,
	ZAKAT_RATE,
} from "../data/zakat-rates.js";
import type { ZakatInput, ZakatResult } from "../types/zakat.js";

/**
 * Calculates Zakat based on wealth inputs and nisab thresholds.
 */
export class ZakatService {
	/**
	 * Calculates Zakat due based on provided wealth inputs.
	 */
	calculateZakat(input: ZakatInput): ZakatResult {
		if ((input.cash ?? 0) < 0) throw new Error("Cash cannot be negative.");
		if ((input.gold ?? 0) < 0) throw new Error("Gold cannot be negative.");
		if ((input.silver ?? 0) < 0) throw new Error("Silver cannot be negative.");
		if ((input.investments ?? 0) < 0) throw new Error("Investments cannot be negative.");
		if ((input.property ?? 0) < 0) throw new Error("Property cannot be negative.");
		if ((input.debts ?? 0) < 0) throw new Error("Debts cannot be negative.");
		const cash = input.cash ?? 0;
		const goldValue = (input.gold ?? 0) * DEFAULT_GOLD_PRICE_PER_GRAM;
		const silverValue = (input.silver ?? 0) * DEFAULT_SILVER_PRICE_PER_GRAM;
		const investments = input.investments ?? 0;
		const property = input.property ?? 0;
		const debts = input.debts ?? 0;

		const totalWealth = cash + goldValue + silverValue + investments + property;
		const netWorth = totalWealth - debts;
		const nisabGold = NISAB_GOLD_GRAMS * DEFAULT_GOLD_PRICE_PER_GRAM;
		const nisabSilver = NISAB_SILVER_GRAMS * DEFAULT_SILVER_PRICE_PER_GRAM;
		const isAbove = netWorth >= nisabSilver;

		return {
			totalWealth,
			totalDeductions: debts,
			netWorth,
			nisabGold,
			nisabSilver,
			isAboveNisab: isAbove,
			zakatDue: isAbove ? Math.round(netWorth * ZAKAT_RATE * 100) / 100 : 0,
		};
	}

	/**
	 * Checks if net worth exceeds the nisab threshold.
	 */
	isAboveNisab(netWorth: number): boolean {
		const nisabSilver = NISAB_SILVER_GRAMS * DEFAULT_SILVER_PRICE_PER_GRAM;
		return netWorth >= nisabSilver;
	}
}
