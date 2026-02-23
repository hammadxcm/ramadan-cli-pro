import { describe, expect, it } from "vitest";
import { BADGES } from "../../../data/badges.js";

describe("BADGES", () => {
	it("should have exactly 12 badges", () => {
		expect(BADGES).toHaveLength(12);
	});

	it("each badge should have an id property", () => {
		for (const badge of BADGES) {
			expect(badge).toHaveProperty("id");
			expect(typeof badge.id).toBe("string");
			expect(badge.id.trim().length).toBeGreaterThan(0);
		}
	});

	it("each badge should have a title property", () => {
		for (const badge of BADGES) {
			expect(badge).toHaveProperty("title");
			expect(typeof badge.title).toBe("string");
			expect(badge.title.trim().length).toBeGreaterThan(0);
		}
	});

	it("each badge should have a description property", () => {
		for (const badge of BADGES) {
			expect(badge).toHaveProperty("description");
			expect(typeof badge.description).toBe("string");
			expect(badge.description.trim().length).toBeGreaterThan(0);
		}
	});

	it("each badge should have an icon property", () => {
		for (const badge of BADGES) {
			expect(badge).toHaveProperty("icon");
			expect(typeof badge.icon).toBe("string");
			expect(badge.icon.trim().length).toBeGreaterThan(0);
		}
	});

	it("each badge should have a condition property", () => {
		for (const badge of BADGES) {
			expect(badge).toHaveProperty("condition");
			expect(typeof badge.condition).toBe("string");
			expect(badge.condition.trim().length).toBeGreaterThan(0);
		}
	});

	it("all badge IDs should be unique", () => {
		const ids = BADGES.map((b) => b.id);
		const uniqueIds = new Set(ids);
		expect(uniqueIds.size).toBe(BADGES.length);
	});

	it("should contain the expected badge IDs", () => {
		const ids = BADGES.map((b) => b.id);
		expect(ids).toContain("first-fast");
		expect(ids).toContain("week-warrior");
		expect(ids).toContain("prayer-perfect");
		expect(ids).toContain("generous-soul");
		expect(ids).toContain("goal-setter");
		expect(ids).toContain("goal-achiever");
		expect(ids).toContain("streak-master");
		expect(ids).toContain("full-month");
		expect(ids).toContain("big-giver");
		expect(ids).toContain("taraweeh-regular");
		expect(ids).toContain("early-bird");
		expect(ids).toContain("halfway-hero");
	});
});
