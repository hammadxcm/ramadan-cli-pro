import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DateService } from "../../../services/date.service.js";
import { HighlightService } from "../../../services/highlight.service.js";
import { TimeFormatService } from "../../../services/time-format.service.js";
import type { PrayerData } from "../../../types/prayer.js";
import { samplePrayerData } from "../../helpers/fixtures.js";

/**
 * Helper to build a PrayerData object for a specific gregorian date string
 * and custom Fajr/Maghrib times.
 */
const makeDayData = (
	gregorianDate: string,
	fajr: string,
	maghrib: string,
	timezone = "Asia/Karachi",
): PrayerData => ({
	...samplePrayerData,
	timings: {
		...samplePrayerData.timings,
		Fajr: fajr,
		Maghrib: maghrib,
	},
	date: {
		...samplePrayerData.date,
		gregorian: {
			...samplePrayerData.date.gregorian,
			date: gregorianDate,
		},
	},
	meta: {
		...samplePrayerData.meta,
		timezone,
	},
});

describe("HighlightService (extended coverage)", () => {
	const dateService = new DateService();
	const timeFormatService = new TimeFormatService();
	const service = new HighlightService(dateService, timeFormatService);

	describe("null returns for unparseable times", () => {
		it("should return null when Fajr time is unparseable", () => {
			const day = makeDayData("01-01-2099", "invalid", "17:55 (PKT)");
			expect(service.getHighlightState(day)).toBeNull();
		});

		it("should return null when Maghrib time is unparseable", () => {
			const day = makeDayData("01-01-2099", "05:15 (PKT)", "invalid");
			expect(service.getHighlightState(day)).toBeNull();
		});

		it("should return null when both times are unparseable", () => {
			const day = makeDayData("01-01-2099", "bad", "bad");
			expect(service.getHighlightState(day)).toBeNull();
		});
	});

	describe("today branch paths using fake timers", () => {
		beforeEach(() => {
			vi.useFakeTimers();
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		it("should return 'Sehar window open' when current time is before Fajr", () => {
			// Set system time to 2026-03-15 03:00 UTC
			// Asia/Karachi is UTC+5, so local time = 08:00
			// But we need local time BEFORE Fajr (05:15 PKT)
			// So set UTC to 2026-03-14 23:00 => PKT 04:00 on March 15
			vi.setSystemTime(new Date("2026-03-14T23:00:00Z"));

			// Gregorian date DD-MM-YYYY for March 15, 2026
			const day = makeDayData("15-03-2026", "05:15 (PKT)", "17:55 (PKT)", "Asia/Karachi");

			const state = service.getHighlightState(day);
			expect(state).not.toBeNull();
			expect(state?.current).toBe("Sehar window open");
			expect(state?.next).toBe("Roza starts (Fajr)");
			expect(state?.countdown).toMatch(/\d+h \d+m|\d+m/);
		});

		it("should return 'Roza in progress' when current time is between Fajr and Maghrib", () => {
			// Set time to 2026-03-15 05:00 UTC => PKT 10:00
			// Fajr = 05:15 (300 min), now = 10:00 (600 min), Maghrib = 17:55 (1075 min)
			vi.setSystemTime(new Date("2026-03-15T05:00:00Z"));

			const day = makeDayData("15-03-2026", "05:15 (PKT)", "17:55 (PKT)", "Asia/Karachi");

			const state = service.getHighlightState(day);
			expect(state).not.toBeNull();
			expect(state?.current).toBe("Roza in progress");
			expect(state?.next).toBe("Iftar");
			expect(state?.countdown).toMatch(/\d+h \d+m|\d+m/);
		});

		it("should return 'Iftar time' when current time is after Maghrib", () => {
			// Set time to 2026-03-15 14:00 UTC => PKT 19:00
			// Fajr = 05:15 (315 min), Maghrib = 17:55 (1075 min), now = 19:00 (1140 min)
			vi.setSystemTime(new Date("2026-03-15T14:00:00Z"));

			const day = makeDayData("15-03-2026", "05:15 (PKT)", "17:55 (PKT)", "Asia/Karachi");

			const state = service.getHighlightState(day);
			expect(state).not.toBeNull();
			expect(state?.current).toBe("Iftar time");
			expect(state?.next).toBe("Next day Sehar");
			expect(state?.countdown).toMatch(/\d+h \d+m|\d+m/);
		});

		it("should include hours and minutes in countdown format", () => {
			// Set time to 2026-03-15 05:00 UTC => PKT 10:00 (600 min)
			// Maghrib at 17:55 (1075 min) => countdown = 1075 - 600 = 475 min = 7h 55m
			vi.setSystemTime(new Date("2026-03-15T05:00:00Z"));

			const day = makeDayData("15-03-2026", "05:15 (PKT)", "17:55 (PKT)", "Asia/Karachi");

			const state = service.getHighlightState(day);
			expect(state).not.toBeNull();
			expect(state?.countdown).toContain("h");
			expect(state?.countdown).toContain("m");
		});
	});

	describe("future day", () => {
		it("should return 'Before roza day' with 'First Sehar' for a future day", () => {
			const day = makeDayData("01-01-2099", "05:15 (PKT)", "17:55 (PKT)");

			const state = service.getHighlightState(day);
			expect(state).not.toBeNull();
			expect(state?.current).toBe("Before roza day");
			expect(state?.next).toBe("First Sehar");
			expect(state?.countdown).toBeDefined();
		});
	});

	describe("past day", () => {
		it("should return null for a past day", () => {
			const day = makeDayData("01-01-2020", "05:15 (PKT)", "17:55 (PKT)");

			const state = service.getHighlightState(day);
			expect(state).toBeNull();
		});
	});

	describe("getNowParts returns null", () => {
		it("should return null when timezone is invalid (getNowParts returns null)", () => {
			const day = makeDayData("01-01-2099", "05:15 (PKT)", "17:55 (PKT)", "Invalid/Timezone");

			const state = service.getHighlightState(day);
			expect(state).toBeNull();
		});
	});
});
