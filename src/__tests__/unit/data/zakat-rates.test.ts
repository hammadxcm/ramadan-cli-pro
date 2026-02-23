import { describe, expect, it } from "vitest";
import {
	DEFAULT_GOLD_PRICE_PER_GRAM,
	DEFAULT_SILVER_PRICE_PER_GRAM,
	NISAB_GOLD_GRAMS,
	NISAB_SILVER_GRAMS,
	ZAKAT_RATE,
} from "../../../data/zakat-rates.js";

describe("Zakat rate constants", () => {
	it("NISAB_GOLD_GRAMS should be 87.48", () => {
		expect(NISAB_GOLD_GRAMS).toBe(87.48);
	});

	it("NISAB_SILVER_GRAMS should be 612.36", () => {
		expect(NISAB_SILVER_GRAMS).toBe(612.36);
	});

	it("ZAKAT_RATE should be 0.025 (2.5%)", () => {
		expect(ZAKAT_RATE).toBe(0.025);
	});

	it("DEFAULT_GOLD_PRICE_PER_GRAM should be a positive number", () => {
		expect(typeof DEFAULT_GOLD_PRICE_PER_GRAM).toBe("number");
		expect(DEFAULT_GOLD_PRICE_PER_GRAM).toBeGreaterThan(0);
	});

	it("DEFAULT_SILVER_PRICE_PER_GRAM should be a positive number", () => {
		expect(typeof DEFAULT_SILVER_PRICE_PER_GRAM).toBe("number");
		expect(DEFAULT_SILVER_PRICE_PER_GRAM).toBeGreaterThan(0);
	});

	it("gold price should be greater than silver price", () => {
		expect(DEFAULT_GOLD_PRICE_PER_GRAM).toBeGreaterThan(DEFAULT_SILVER_PRICE_PER_GRAM);
	});
});
