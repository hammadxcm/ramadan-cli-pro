import { describe, expect, it } from "vitest";
import { HijriEventService } from "../../../services/hijri-event.service.js";

describe("HijriEventService", () => {
	const service = new HijriEventService();

	describe("getEventsForDay", () => {
		it("returns events for day 27", () => {
			const events = service.getEventsForDay(27);
			expect(events.length).toBeGreaterThanOrEqual(1);
			expect(events[0]?.day).toBe(27);
			expect(events[0]?.isSpecialNight).toBe(true);
		});

		it("returns events for day 1", () => {
			const events = service.getEventsForDay(1);
			expect(events.length).toBeGreaterThanOrEqual(1);
			expect(events[0]?.day).toBe(1);
		});

		it("returns empty array for day with no events", () => {
			const events = service.getEventsForDay(5);
			expect(events).toEqual([]);
		});

		it("returns empty array for day 2", () => {
			const events = service.getEventsForDay(2);
			expect(events).toEqual([]);
		});

		it("returns empty array for day 10", () => {
			const events = service.getEventsForDay(10);
			expect(events).toEqual([]);
		});
	});

	describe("isSpecialNight", () => {
		it("returns true for day 21", () => {
			expect(service.isSpecialNight(21)).toBe(true);
		});

		it("returns true for day 23", () => {
			expect(service.isSpecialNight(23)).toBe(true);
		});

		it("returns true for day 25", () => {
			expect(service.isSpecialNight(25)).toBe(true);
		});

		it("returns true for day 27", () => {
			expect(service.isSpecialNight(27)).toBe(true);
		});

		it("returns true for day 29", () => {
			expect(service.isSpecialNight(29)).toBe(true);
		});

		it("returns false for day 2", () => {
			expect(service.isSpecialNight(2)).toBe(false);
		});

		it("returns false for day 10", () => {
			expect(service.isSpecialNight(10)).toBe(false);
		});

		it("returns false for day 15", () => {
			expect(service.isSpecialNight(15)).toBe(false);
		});

		it("returns false for day 20", () => {
			expect(service.isSpecialNight(20)).toBe(false);
		});

		it("returns false for day 30", () => {
			expect(service.isSpecialNight(30)).toBe(false);
		});
	});

	describe("getUpcomingEvents", () => {
		it("returns events after currentRoza", () => {
			const events = service.getUpcomingEvents(1);
			expect(events.length).toBeGreaterThan(0);
			for (const event of events) {
				expect(event.day).toBeGreaterThan(1);
			}
		});

		it("returns events sorted by day ascending", () => {
			const events = service.getUpcomingEvents(1);
			for (let i = 1; i < events.length; i++) {
				const prev = events[i - 1];
				const curr = events[i];
				expect(prev?.day).toBeLessThanOrEqual(curr?.day ?? 0);
			}
		});

		it("respects count parameter", () => {
			const events = service.getUpcomingEvents(1, 3);
			expect(events.length).toBeLessThanOrEqual(3);
		});

		it("returns empty array when currentRoza is 30", () => {
			const events = service.getUpcomingEvents(30);
			expect(events).toEqual([]);
		});

		it("returns only events after day 20", () => {
			const events = service.getUpcomingEvents(20);
			for (const event of events) {
				expect(event.day).toBeGreaterThan(20);
			}
		});

		it("returns 1 event when count is 1", () => {
			const events = service.getUpcomingEvents(1, 1);
			expect(events).toHaveLength(1);
		});
	});
});
