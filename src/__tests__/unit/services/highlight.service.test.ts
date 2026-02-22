import { describe, expect, it, vi } from "vitest";
import { DateService } from "../../../services/date.service.js";
import { HighlightService } from "../../../services/highlight.service.js";
import { TimeFormatService } from "../../../services/time-format.service.js";
import { samplePrayerData } from "../../helpers/fixtures.js";

describe("HighlightService", () => {
	const dateService = new DateService();
	const timeFormatService = new TimeFormatService();
	const service = new HighlightService(dateService, timeFormatService);

	it("should return null for unparseable dates", () => {
		const badDay = {
			...samplePrayerData,
			date: {
				...samplePrayerData.date,
				gregorian: { ...samplePrayerData.date.gregorian, date: "invalid" },
			},
		};
		expect(service.getHighlightState(badDay)).toBeNull();
	});

	it("should return null for past days", () => {
		const pastDay = {
			...samplePrayerData,
			date: {
				...samplePrayerData.date,
				gregorian: { ...samplePrayerData.date.gregorian, date: "01-01-2020" },
			},
		};
		expect(service.getHighlightState(pastDay)).toBeNull();
	});

	it("should return a highlight state for a future day", () => {
		const futureDay = {
			...samplePrayerData,
			date: {
				...samplePrayerData.date,
				gregorian: { ...samplePrayerData.date.gregorian, date: "01-01-2099" },
			},
		};
		const state = service.getHighlightState(futureDay);
		expect(state).not.toBeNull();
		expect(state?.current).toBe("Before roza day");
		expect(state?.next).toBe("First Sehar");
	});

	it("formatStatusLine should produce a readable string", () => {
		const state = {
			current: "Roza in progress",
			next: "Iftar",
			countdown: "2h 15m",
		};
		expect(service.formatStatusLine(state)).toBe("Iftar in 2h 15m");
	});

	it("formatStatusLine should use 'Sehar' for First Sehar", () => {
		const state = {
			current: "Before roza day",
			next: "First Sehar",
			countdown: "5h 30m",
		};
		expect(service.formatStatusLine(state)).toBe("Sehar in 5h 30m");
	});

	it("formatStatusLine should use 'Sehar' for Next day Sehar", () => {
		const state = {
			current: "Iftar time",
			next: "Next day Sehar",
			countdown: "8h 45m",
		};
		expect(service.formatStatusLine(state)).toBe("Sehar in 8h 45m");
	});

	it("formatStatusLine should use 'Fast starts' for Roza starts (Fajr)", () => {
		const state = {
			current: "Sehar window open",
			next: "Roza starts (Fajr)",
			countdown: "0h 30m",
		};
		expect(service.formatStatusLine(state)).toBe("Fast starts in 0h 30m");
	});
});
