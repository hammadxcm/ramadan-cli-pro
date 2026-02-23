import { describe, expect, it } from "vitest";
import { ZakatService } from "../../../services/zakat.service.js";

/**
 * Internal constants used by ZakatService (from data/zakat-rates.ts):
 *   NISAB_SILVER_GRAMS = 612.36
 *   DEFAULT_SILVER_PRICE_PER_GRAM = 1.05
 *   NISAB_GOLD_GRAMS = 87.48
 *   DEFAULT_GOLD_PRICE_PER_GRAM = 85
 *   ZAKAT_RATE = 0.025
 *
 * Silver nisab threshold = 612.36 * 1.05 = 642.978
 */

describe("ZakatService", () => {
	const service = new ZakatService();

	it("calculateZakat with only cash: returns correct totalWealth, netWorth, zakatDue", () => {
		const result = service.calculateZakat({ cash: 1000 });
		expect(result.totalWealth).toBe(1000);
		expect(result.netWorth).toBe(1000);
		expect(result.isAboveNisab).toBe(true);
		expect(result.zakatDue).toBe(25); // 1000 * 0.025
		expect(result.totalDeductions).toBe(0);
	});

	it("calculateZakat with all inputs: gold, silver, investments, property, debts", () => {
		const result = service.calculateZakat({
			cash: 500,
			gold: 10, // 10g * 85 = 850
			silver: 100, // 100g * 1.05 = 105
			investments: 2000,
			property: 1000,
			debts: 500,
		});

		const expectedWealth = 500 + 850 + 105 + 2000 + 1000; // 4455
		const expectedNet = expectedWealth - 500; // 3955

		expect(result.totalWealth).toBe(expectedWealth);
		expect(result.totalDeductions).toBe(500);
		expect(result.netWorth).toBe(expectedNet);
		expect(result.isAboveNisab).toBe(true);
		expect(result.zakatDue).toBe(Math.round(expectedNet * 0.025 * 100) / 100);
	});

	it("calculateZakat below nisab: isAboveNisab=false, zakatDue=0", () => {
		// nisab silver = 642.978, so 600 cash is below
		const result = service.calculateZakat({ cash: 600 });
		expect(result.netWorth).toBe(600);
		expect(result.isAboveNisab).toBe(false);
		expect(result.zakatDue).toBe(0);
	});

	it("calculateZakat with zero inputs: returns zeroes", () => {
		const result = service.calculateZakat({});
		expect(result.totalWealth).toBe(0);
		expect(result.netWorth).toBe(0);
		expect(result.totalDeductions).toBe(0);
		expect(result.isAboveNisab).toBe(false);
		expect(result.zakatDue).toBe(0);
	});

	it("isAboveNisab: returns true/false correctly based on threshold", () => {
		// Nisab silver = 612.36 * 1.05 = 642.978
		// Nisab = 612.36 * 1.05 = 642.9780000000001 (floating point)
		expect(service.isAboveNisab(643)).toBe(true);
		expect(service.isAboveNisab(642)).toBe(false);
		expect(service.isAboveNisab(650)).toBe(true);
		expect(service.isAboveNisab(0)).toBe(false);
	});

	it("calculateZakat: throws error for negative cash", () => {
		expect(() => service.calculateZakat({ cash: -100 })).toThrow("Cash cannot be negative.");
	});

	it("calculateZakat: throws error for negative gold", () => {
		expect(() => service.calculateZakat({ gold: -10 })).toThrow("Gold cannot be negative.");
	});

	it("calculateZakat: throws error for negative silver", () => {
		expect(() => service.calculateZakat({ silver: -5 })).toThrow("Silver cannot be negative.");
	});

	it("calculateZakat: throws error for negative investments", () => {
		expect(() => service.calculateZakat({ investments: -200 })).toThrow(
			"Investments cannot be negative.",
		);
	});

	it("calculateZakat: throws error for negative property", () => {
		expect(() => service.calculateZakat({ property: -300 })).toThrow(
			"Property cannot be negative.",
		);
	});

	it("calculateZakat: throws error for negative debts", () => {
		expect(() => service.calculateZakat({ debts: -50 })).toThrow("Debts cannot be negative.");
	});
});
