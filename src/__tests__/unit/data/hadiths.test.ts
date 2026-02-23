import { describe, expect, it } from "vitest";
import { RAMADAN_HADITHS } from "../../../data/hadiths.js";
import type { Hadith } from "../../../data/hadiths.js";

describe("RAMADAN_HADITHS", () => {
	it("should have exactly 30 hadiths", () => {
		expect(RAMADAN_HADITHS).toHaveLength(30);
	});

	it("should have days numbered 1 through 30 sequentially", () => {
		for (let i = 0; i < 30; i++) {
			expect(RAMADAN_HADITHS[i]?.day).toBe(i + 1);
		}
	});

	it("each hadith should have a day property", () => {
		for (const hadith of RAMADAN_HADITHS) {
			expect(hadith).toHaveProperty("day");
			expect(typeof hadith.day).toBe("number");
		}
	});

	it("each hadith should have an arabic property", () => {
		for (const hadith of RAMADAN_HADITHS) {
			expect(hadith).toHaveProperty("arabic");
			expect(typeof hadith.arabic).toBe("string");
		}
	});

	it("each hadith should have a transliteration property", () => {
		for (const hadith of RAMADAN_HADITHS) {
			expect(hadith).toHaveProperty("transliteration");
			expect(typeof hadith.transliteration).toBe("string");
		}
	});

	it("each hadith should have a translation property", () => {
		for (const hadith of RAMADAN_HADITHS) {
			expect(hadith).toHaveProperty("translation");
			expect(typeof hadith.translation).toBe("string");
		}
	});

	it("each hadith should have a source property", () => {
		for (const hadith of RAMADAN_HADITHS) {
			expect(hadith).toHaveProperty("source");
			expect(typeof hadith.source).toBe("string");
		}
	});

	it("each hadith should have a narrator property", () => {
		for (const hadith of RAMADAN_HADITHS) {
			expect(hadith).toHaveProperty("narrator");
			expect(typeof hadith.narrator).toBe("string");
		}
	});

	it("no hadith should have an empty arabic string", () => {
		for (const hadith of RAMADAN_HADITHS) {
			expect(hadith.arabic.trim().length, `Day ${hadith.day} arabic is empty`).toBeGreaterThan(0);
		}
	});

	it("no hadith should have an empty transliteration string", () => {
		for (const hadith of RAMADAN_HADITHS) {
			expect(
				hadith.transliteration.trim().length,
				`Day ${hadith.day} transliteration is empty`,
			).toBeGreaterThan(0);
		}
	});

	it("no hadith should have an empty translation string", () => {
		for (const hadith of RAMADAN_HADITHS) {
			expect(
				hadith.translation.trim().length,
				`Day ${hadith.day} translation is empty`,
			).toBeGreaterThan(0);
		}
	});

	it("no hadith should have an empty source string", () => {
		for (const hadith of RAMADAN_HADITHS) {
			expect(hadith.source.trim().length, `Day ${hadith.day} source is empty`).toBeGreaterThan(0);
		}
	});

	it("no hadith should have an empty narrator string", () => {
		for (const hadith of RAMADAN_HADITHS) {
			expect(hadith.narrator.trim().length, `Day ${hadith.day} narrator is empty`).toBeGreaterThan(
				0,
			);
		}
	});

	it("arabic text should contain Arabic characters", () => {
		const arabicRegex = /[\u0600-\u06FF]/;
		for (const hadith of RAMADAN_HADITHS) {
			expect(
				arabicRegex.test(hadith.arabic),
				`Day ${hadith.day} arabic does not contain Arabic characters`,
			).toBe(true);
		}
	});

	it("should have no duplicate days", () => {
		const days = RAMADAN_HADITHS.map((h) => h.day);
		const uniqueDays = new Set(days);
		expect(uniqueDays.size).toBe(30);
	});

	it("each hadith should satisfy the Hadith interface", () => {
		for (const hadith of RAMADAN_HADITHS) {
			const validated: Hadith = hadith;
			expect(validated.day).toBeGreaterThanOrEqual(1);
			expect(validated.day).toBeLessThanOrEqual(30);
			expect(validated.arabic).toBeDefined();
			expect(validated.transliteration).toBeDefined();
			expect(validated.translation).toBeDefined();
			expect(validated.source).toBeDefined();
			expect(validated.narrator).toBeDefined();
		}
	});
});
