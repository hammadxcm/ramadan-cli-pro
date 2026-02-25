import { describe, expect, it } from "vitest";
import { ADHKAR_COLLECTIONS } from "../../../data/adhkar.js";
import type { AdhkarCollection, Dhikr } from "../../../data/adhkar.js";

describe("ADHKAR_COLLECTIONS", () => {
	it("should have exactly 5 collections", () => {
		expect(ADHKAR_COLLECTIONS).toHaveLength(5);
	});

	it('should have collection IDs "morning", "evening", "post-prayer", "before-sleep", "waking-up"', () => {
		const ids = ADHKAR_COLLECTIONS.map((c) => c.id);
		expect(ids).toContain("morning");
		expect(ids).toContain("evening");
		expect(ids).toContain("post-prayer");
		expect(ids).toContain("before-sleep");
		expect(ids).toContain("waking-up");
	});

	it("each collection should have a non-empty id", () => {
		for (const collection of ADHKAR_COLLECTIONS) {
			expect(typeof collection.id).toBe("string");
			expect(collection.id.trim().length).toBeGreaterThan(0);
		}
	});

	it("each collection should have a non-empty title", () => {
		for (const collection of ADHKAR_COLLECTIONS) {
			expect(typeof collection.title).toBe("string");
			expect(collection.title.trim().length).toBeGreaterThan(0);
		}
	});

	it("each collection should have at least 3 items", () => {
		for (const collection of ADHKAR_COLLECTIONS) {
			expect(
				collection.items.length,
				`Collection "${collection.id}" has fewer than 3 items`,
			).toBeGreaterThanOrEqual(3);
		}
	});

	it("each collection should have at most 10 items", () => {
		for (const collection of ADHKAR_COLLECTIONS) {
			expect(
				collection.items.length,
				`Collection "${collection.id}" has more than 10 items`,
			).toBeLessThanOrEqual(10);
		}
	});

	describe("each dhikr item", () => {
		const allItems: Array<{ collectionId: string; dhikr: Dhikr }> = [];
		for (const collection of ADHKAR_COLLECTIONS) {
			for (const dhikr of collection.items) {
				allItems.push({ collectionId: collection.id, dhikr });
			}
		}

		it("should have an arabic property", () => {
			for (const { collectionId, dhikr } of allItems) {
				expect(typeof dhikr.arabic, `Item in "${collectionId}" missing arabic`).toBe("string");
				expect(
					dhikr.arabic.trim().length,
					`Item in "${collectionId}" has empty arabic`,
				).toBeGreaterThan(0);
			}
		});

		it("should have a transliteration property", () => {
			for (const { collectionId, dhikr } of allItems) {
				expect(
					typeof dhikr.transliteration,
					`Item in "${collectionId}" missing transliteration`,
				).toBe("string");
				expect(
					dhikr.transliteration.trim().length,
					`Item in "${collectionId}" has empty transliteration`,
				).toBeGreaterThan(0);
			}
		});

		it("should have a translation property", () => {
			for (const { collectionId, dhikr } of allItems) {
				expect(typeof dhikr.translation, `Item in "${collectionId}" missing translation`).toBe(
					"string",
				);
				expect(
					dhikr.translation.trim().length,
					`Item in "${collectionId}" has empty translation`,
				).toBeGreaterThan(0);
			}
		});

		it("arabic text should contain Arabic characters", () => {
			const arabicRegex = /[\u0600-\u06FF]/;
			for (const { collectionId, dhikr } of allItems) {
				expect(
					arabicRegex.test(dhikr.arabic),
					`Item in "${collectionId}" arabic does not contain Arabic characters: ${dhikr.arabic}`,
				).toBe(true);
			}
		});

		it("count should be a positive number when present", () => {
			for (const { collectionId, dhikr } of allItems) {
				if (dhikr.count !== undefined) {
					expect(typeof dhikr.count).toBe("number");
					expect(dhikr.count, `Item in "${collectionId}" has non-positive count`).toBeGreaterThan(
						0,
					);
				}
			}
		});
	});

	describe("each collection satisfies the AdhkarCollection interface", () => {
		it("morning collection is valid", () => {
			const morning = ADHKAR_COLLECTIONS.find((c) => c.id === "morning") as AdhkarCollection;
			expect(morning).toBeDefined();
			expect(morning.id).toBe("morning");
			expect(morning.title).toBeDefined();
			expect(morning.items.length).toBeGreaterThan(0);
		});

		it("evening collection is valid", () => {
			const evening = ADHKAR_COLLECTIONS.find((c) => c.id === "evening") as AdhkarCollection;
			expect(evening).toBeDefined();
			expect(evening.id).toBe("evening");
			expect(evening.title).toBeDefined();
			expect(evening.items.length).toBeGreaterThan(0);
		});

		it("post-prayer collection is valid", () => {
			const postPrayer = ADHKAR_COLLECTIONS.find((c) => c.id === "post-prayer") as AdhkarCollection;
			expect(postPrayer).toBeDefined();
			expect(postPrayer.id).toBe("post-prayer");
			expect(postPrayer.title).toBeDefined();
			expect(postPrayer.items.length).toBeGreaterThan(0);
		});
	});

	it("should have no duplicate collection IDs", () => {
		const ids = ADHKAR_COLLECTIONS.map((c) => c.id);
		const uniqueIds = new Set(ids);
		expect(uniqueIds.size).toBe(ADHKAR_COLLECTIONS.length);
	});
});
