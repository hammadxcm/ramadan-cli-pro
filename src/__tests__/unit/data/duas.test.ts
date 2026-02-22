import { describe, expect, it } from "vitest";
import { RAMADAN_DUAS } from "../../../data/duas.js";
import type { Dua } from "../../../data/duas.js";

describe("RAMADAN_DUAS", () => {
	it("should have exactly 30 duas", () => {
		expect(RAMADAN_DUAS).toHaveLength(30);
	});

	it("should have days numbered 1 through 30 sequentially", () => {
		for (let i = 0; i < 30; i++) {
			expect(RAMADAN_DUAS[i]?.day).toBe(i + 1);
		}
	});

	it("each dua should have a day property", () => {
		for (const dua of RAMADAN_DUAS) {
			expect(dua).toHaveProperty("day");
			expect(typeof dua.day).toBe("number");
		}
	});

	it("each dua should have an arabic property", () => {
		for (const dua of RAMADAN_DUAS) {
			expect(dua).toHaveProperty("arabic");
			expect(typeof dua.arabic).toBe("string");
		}
	});

	it("each dua should have a transliteration property", () => {
		for (const dua of RAMADAN_DUAS) {
			expect(dua).toHaveProperty("transliteration");
			expect(typeof dua.transliteration).toBe("string");
		}
	});

	it("each dua should have a translation property", () => {
		for (const dua of RAMADAN_DUAS) {
			expect(dua).toHaveProperty("translation");
			expect(typeof dua.translation).toBe("string");
		}
	});

	it("no dua should have an empty arabic string", () => {
		for (const dua of RAMADAN_DUAS) {
			expect(dua.arabic.trim().length, `Day ${dua.day} arabic is empty`).toBeGreaterThan(0);
		}
	});

	it("no dua should have an empty transliteration string", () => {
		for (const dua of RAMADAN_DUAS) {
			expect(
				dua.transliteration.trim().length,
				`Day ${dua.day} transliteration is empty`,
			).toBeGreaterThan(0);
		}
	});

	it("no dua should have an empty translation string", () => {
		for (const dua of RAMADAN_DUAS) {
			expect(dua.translation.trim().length, `Day ${dua.day} translation is empty`).toBeGreaterThan(
				0,
			);
		}
	});

	it("days should start at 1", () => {
		expect(RAMADAN_DUAS[0]?.day).toBe(1);
	});

	it("days should end at 30", () => {
		expect(RAMADAN_DUAS[29]?.day).toBe(30);
	});

	it("should have no duplicate days", () => {
		const days = RAMADAN_DUAS.map((d) => d.day);
		const uniqueDays = new Set(days);
		expect(uniqueDays.size).toBe(30);
	});

	it("each dua should satisfy the Dua interface", () => {
		for (const dua of RAMADAN_DUAS) {
			const validated: Dua = dua;
			expect(validated.day).toBeGreaterThanOrEqual(1);
			expect(validated.day).toBeLessThanOrEqual(30);
			expect(validated.arabic).toBeDefined();
			expect(validated.transliteration).toBeDefined();
			expect(validated.translation).toBeDefined();
		}
	});

	it("arabic text should contain Arabic characters", () => {
		const arabicRegex = /[\u0600-\u06FF]/;
		for (const dua of RAMADAN_DUAS) {
			expect(
				arabicRegex.test(dua.arabic),
				`Day ${dua.day} arabic does not contain Arabic characters`,
			).toBe(true);
		}
	});

	it("transliterations should contain Latin characters", () => {
		const latinRegex = /[a-zA-Z]/;
		for (const dua of RAMADAN_DUAS) {
			expect(
				latinRegex.test(dua.transliteration),
				`Day ${dua.day} transliteration does not contain Latin characters`,
			).toBe(true);
		}
	});

	it("translations should be in English (contain Latin characters)", () => {
		const latinRegex = /[a-zA-Z]/;
		for (const dua of RAMADAN_DUAS) {
			expect(
				latinRegex.test(dua.translation),
				`Day ${dua.day} translation does not contain Latin characters`,
			).toBe(true);
		}
	});
});
