import { describe, expect, it } from "vitest";
import { QURAN_VERSES } from "../../../data/quran-verses.js";
import type { QuranVerse } from "../../../data/quran-verses.js";

describe("QURAN_VERSES", () => {
	it("should have exactly 30 verses", () => {
		expect(QURAN_VERSES).toHaveLength(30);
	});

	it("should have days numbered 1 through 30 sequentially", () => {
		for (let i = 0; i < 30; i++) {
			expect(QURAN_VERSES[i]?.day).toBe(i + 1);
		}
	});

	it("each verse should have a day property", () => {
		for (const verse of QURAN_VERSES) {
			expect(verse).toHaveProperty("day");
			expect(typeof verse.day).toBe("number");
		}
	});

	it("each verse should have an arabic property", () => {
		for (const verse of QURAN_VERSES) {
			expect(verse).toHaveProperty("arabic");
			expect(typeof verse.arabic).toBe("string");
		}
	});

	it("each verse should have a transliteration property", () => {
		for (const verse of QURAN_VERSES) {
			expect(verse).toHaveProperty("transliteration");
			expect(typeof verse.transliteration).toBe("string");
		}
	});

	it("each verse should have a translation property", () => {
		for (const verse of QURAN_VERSES) {
			expect(verse).toHaveProperty("translation");
			expect(typeof verse.translation).toBe("string");
		}
	});

	it("each verse should have a surah property", () => {
		for (const verse of QURAN_VERSES) {
			expect(verse).toHaveProperty("surah");
			expect(typeof verse.surah).toBe("string");
		}
	});

	it("each verse should have an ayah property", () => {
		for (const verse of QURAN_VERSES) {
			expect(verse).toHaveProperty("ayah");
			expect(typeof verse.ayah).toBe("number");
		}
	});

	it("no verse should have an empty arabic string", () => {
		for (const verse of QURAN_VERSES) {
			expect(verse.arabic.trim().length, `Day ${verse.day} arabic is empty`).toBeGreaterThan(0);
		}
	});

	it("no verse should have an empty transliteration string", () => {
		for (const verse of QURAN_VERSES) {
			expect(
				verse.transliteration.trim().length,
				`Day ${verse.day} transliteration is empty`,
			).toBeGreaterThan(0);
		}
	});

	it("no verse should have an empty translation string", () => {
		for (const verse of QURAN_VERSES) {
			expect(
				verse.translation.trim().length,
				`Day ${verse.day} translation is empty`,
			).toBeGreaterThan(0);
		}
	});

	it("no verse should have an empty surah string", () => {
		for (const verse of QURAN_VERSES) {
			expect(verse.surah.trim().length, `Day ${verse.day} surah is empty`).toBeGreaterThan(0);
		}
	});

	it("arabic text should contain Arabic characters", () => {
		const arabicRegex = /[\u0600-\u06FF]/;
		for (const verse of QURAN_VERSES) {
			expect(
				arabicRegex.test(verse.arabic),
				`Day ${verse.day} arabic does not contain Arabic characters`,
			).toBe(true);
		}
	});

	it("transliterations should contain Latin characters", () => {
		const latinRegex = /[a-zA-Z]/;
		for (const verse of QURAN_VERSES) {
			expect(
				latinRegex.test(verse.transliteration),
				`Day ${verse.day} transliteration does not contain Latin characters`,
			).toBe(true);
		}
	});

	it("should have no duplicate days", () => {
		const days = QURAN_VERSES.map((v) => v.day);
		const uniqueDays = new Set(days);
		expect(uniqueDays.size).toBe(30);
	});

	it("each verse should satisfy the QuranVerse interface", () => {
		for (const verse of QURAN_VERSES) {
			const validated: QuranVerse = verse;
			expect(validated.day).toBeGreaterThanOrEqual(1);
			expect(validated.day).toBeLessThanOrEqual(30);
			expect(validated.arabic).toBeDefined();
			expect(validated.transliteration).toBeDefined();
			expect(validated.translation).toBeDefined();
			expect(validated.surah).toBeDefined();
			expect(validated.ayah).toBeDefined();
		}
	});
});
