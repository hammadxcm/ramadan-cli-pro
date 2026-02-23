import { describe, expect, it } from "vitest";
import { RAMADAN_EVENTS } from "../../../data/hijri-events.js";
import type { HijriEvent } from "../../../data/hijri-events.js";

describe("RAMADAN_EVENTS", () => {
	it("should have at least 9 entries", () => {
		expect(RAMADAN_EVENTS.length).toBeGreaterThanOrEqual(9);
	});

	it("each event should have a day property of type number", () => {
		for (const event of RAMADAN_EVENTS) {
			expect(typeof event.day).toBe("number");
		}
	});

	it("each event should have a title property of type string", () => {
		for (const event of RAMADAN_EVENTS) {
			expect(typeof event.title).toBe("string");
			expect(event.title.trim().length).toBeGreaterThan(0);
		}
	});

	it("each event should have a description property of type string", () => {
		for (const event of RAMADAN_EVENTS) {
			expect(typeof event.description).toBe("string");
			expect(event.description.trim().length).toBeGreaterThan(0);
		}
	});

	it("each event should have an isSpecialNight property of type boolean", () => {
		for (const event of RAMADAN_EVENTS) {
			expect(typeof event.isSpecialNight).toBe("boolean");
		}
	});

	it("all days should be within the 1-30 range", () => {
		for (const event of RAMADAN_EVENTS) {
			expect(event.day).toBeGreaterThanOrEqual(1);
			expect(event.day).toBeLessThanOrEqual(30);
		}
	});

	it("should include an event for day 1", () => {
		const day1 = RAMADAN_EVENTS.find((e) => e.day === 1);
		expect(day1).toBeDefined();
	});

	it("should include an event for day 27 (Laylat al-Qadr)", () => {
		const day27 = RAMADAN_EVENTS.find((e) => e.day === 27);
		expect(day27).toBeDefined();
		expect(day27?.isSpecialNight).toBe(true);
	});

	it("should include an event for day 30 (last day)", () => {
		const day30 = RAMADAN_EVENTS.find((e) => e.day === 30);
		expect(day30).toBeDefined();
	});

	it("each event should satisfy the HijriEvent interface", () => {
		for (const event of RAMADAN_EVENTS) {
			const validated: HijriEvent = event;
			expect(validated.day).toBeGreaterThanOrEqual(1);
			expect(validated.day).toBeLessThanOrEqual(30);
			expect(validated.title).toBeDefined();
			expect(validated.description).toBeDefined();
			expect(typeof validated.isSpecialNight).toBe("boolean");
		}
	});

	it("special nights should only be odd nights in the last ten days", () => {
		const specialNights = RAMADAN_EVENTS.filter((e) => e.isSpecialNight);
		for (const event of specialNights) {
			expect(event.day).toBeGreaterThanOrEqual(21);
			expect(event.day % 2).toBe(1); // odd
		}
	});
});
