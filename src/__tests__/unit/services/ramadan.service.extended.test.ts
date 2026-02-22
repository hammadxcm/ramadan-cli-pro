import { describe, expect, it, vi } from "vitest";
import { RozaNotFoundError } from "../../../errors/prayer.error.js";
import { DateService } from "../../../services/date.service.js";
import { HighlightService } from "../../../services/highlight.service.js";
import type { LocationService } from "../../../services/location.service.js";
import type { PrayerTimeService } from "../../../services/prayer-time.service.js";
import { RamadanService } from "../../../services/ramadan.service.js";
import { TimeFormatService } from "../../../services/time-format.service.js";
import type { PrayerData } from "../../../types/prayer.js";
import { createPrayerDataForDay, samplePrayerData } from "../../helpers/fixtures.js";

describe("RamadanService (extended)", () => {
	const dateService = new DateService();
	const timeFormatService = new TimeFormatService();
	const highlightService = new HighlightService(dateService, timeFormatService);

	const service = new RamadanService(
		{} as PrayerTimeService,
		{} as LocationService,
		highlightService,
		dateService,
		timeFormatService,
	);

	describe("toRamadanRow", () => {
		it("formats sehar from Fajr timing", () => {
			const row = service.toRamadanRow(samplePrayerData, 1);
			expect(row.sehar).toBe("5:15 AM");
		});

		it("formats iftar from Maghrib timing", () => {
			const row = service.toRamadanRow(samplePrayerData, 1);
			expect(row.iftar).toBe("5:55 PM");
		});

		it("uses the readable date", () => {
			const row = service.toRamadanRow(samplePrayerData, 1);
			expect(row.date).toBe("01 Mar 2026");
		});

		it("builds hijri string from day, month en, and year", () => {
			const row = service.toRamadanRow(samplePrayerData, 1);
			expect(row.hijri).toBe("1 Ramadan 1447");
		});

		it("preserves the roza number passed as parameter", () => {
			const row = service.toRamadanRow(samplePrayerData, 15);
			expect(row.roza).toBe(15);
		});

		it("works with different day data", () => {
			const day2 = createPrayerDataForDay(2, "2");
			const row = service.toRamadanRow(day2, 2);
			expect(row.roza).toBe(2);
			expect(row.hijri).toContain("2 Ramadan");
		});
	});

	describe("getRowByRozaNumber", () => {
		const days = [samplePrayerData, createPrayerDataForDay(2, "2"), createPrayerDataForDay(3, "3")];

		it("returns the first roza correctly", () => {
			const row = service.getRowByRozaNumber(days, 1);
			expect(row.roza).toBe(1);
			expect(row.sehar).toBe("5:15 AM");
		});

		it("returns the last available roza", () => {
			const row = service.getRowByRozaNumber(days, 3);
			expect(row.roza).toBe(3);
		});

		it("throws RozaNotFoundError for roza 0", () => {
			expect(() => service.getRowByRozaNumber(days, 0)).toThrow(RozaNotFoundError);
		});

		it("throws RozaNotFoundError for roza beyond array length", () => {
			expect(() => service.getRowByRozaNumber(days, 4)).toThrow(RozaNotFoundError);
		});

		it("throws RozaNotFoundError for negative roza", () => {
			expect(() => service.getRowByRozaNumber(days, -1)).toThrow(RozaNotFoundError);
		});

		it("throws RozaNotFoundError on empty array", () => {
			expect(() => service.getRowByRozaNumber([], 1)).toThrow(RozaNotFoundError);
		});

		it("RozaNotFoundError includes the roza number", () => {
			try {
				service.getRowByRozaNumber(days, 99);
			} catch (error) {
				expect(error).toBeInstanceOf(RozaNotFoundError);
				expect((error as RozaNotFoundError).rozaNumber).toBe(99);
			}
		});
	});

	describe("getAllModeRowAnnotations", () => {
		const makePrayerDataWithHijri = (
			hijriMonth: number,
			hijriDay: string,
			hijriYear: string,
		): PrayerData => ({
			...samplePrayerData,
			date: {
				...samplePrayerData.date,
				hijri: {
					...samplePrayerData.date.hijri,
					day: hijriDay,
					month: {
						...samplePrayerData.date.hijri.month,
						number: hijriMonth,
					},
					year: hijriYear,
				},
			},
		});

		it("marks roza 1 as next when not Ramadan", () => {
			const today = makePrayerDataWithHijri(8, "15", "1447");
			const result = service.getAllModeRowAnnotations({
				today,
				todayGregorianDate: new Date("2026-02-15"),
				targetYear: 1447,
				configuredFirstRozaDate: null,
			});

			expect(result[1]).toBe("next");
			expect(Object.keys(result)).toHaveLength(1);
		});

		it("marks current roza and next during Ramadan", () => {
			const today = makePrayerDataWithHijri(9, "10", "1447");
			const result = service.getAllModeRowAnnotations({
				today,
				todayGregorianDate: new Date("2026-03-10"),
				targetYear: 1447,
				configuredFirstRozaDate: null,
			});

			expect(result[10]).toBe("current");
			expect(result[11]).toBe("next");
		});

		it("marks roza 1 as next when hijri year differs from target", () => {
			const today = makePrayerDataWithHijri(9, "5", "1446");
			const result = service.getAllModeRowAnnotations({
				today,
				todayGregorianDate: new Date("2026-03-05"),
				targetYear: 1447,
				configuredFirstRozaDate: null,
			});

			expect(result[1]).toBe("next");
		});

		it("handles roza 30 as current without invalid next annotation", () => {
			const today = makePrayerDataWithHijri(9, "30", "1447");
			const result = service.getAllModeRowAnnotations({
				today,
				todayGregorianDate: new Date("2026-03-30"),
				targetYear: 1447,
				configuredFirstRozaDate: null,
			});

			expect(result[30]).toBe("current");
			// roza 31 should not be annotated (out of 1-30 range)
			expect(result[31]).toBeUndefined();
		});

		it("handles roza 1 as current during Ramadan", () => {
			const today = makePrayerDataWithHijri(9, "1", "1447");
			const result = service.getAllModeRowAnnotations({
				today,
				todayGregorianDate: new Date("2026-03-01"),
				targetYear: 1447,
				configuredFirstRozaDate: null,
			});

			expect(result[1]).toBe("current");
			expect(result[2]).toBe("next");
		});

		describe("with configuredFirstRozaDate", () => {
			it("marks roza 1 as next when today is before first roza date", () => {
				const today = makePrayerDataWithHijri(8, "28", "1447");
				const result = service.getAllModeRowAnnotations({
					today,
					todayGregorianDate: new Date("2026-02-25"),
					targetYear: 1447,
					configuredFirstRozaDate: new Date("2026-03-01"),
				});

				expect(result[1]).toBe("next");
				expect(Object.keys(result)).toHaveLength(1);
			});

			it("marks current and next using configured first roza date", () => {
				const today = makePrayerDataWithHijri(9, "5", "1447");
				const firstRozaDate = new Date("2026-03-01");
				const todayDate = new Date("2026-03-05");

				const result = service.getAllModeRowAnnotations({
					today,
					todayGregorianDate: todayDate,
					targetYear: 1447,
					configuredFirstRozaDate: firstRozaDate,
				});

				expect(result[5]).toBe("current");
				expect(result[6]).toBe("next");
			});

			it("does not annotate next beyond roza 30 with configured date", () => {
				const today = makePrayerDataWithHijri(9, "30", "1447");
				const firstRozaDate = new Date("2026-03-01");
				const todayDate = new Date("2026-03-30");

				const result = service.getAllModeRowAnnotations({
					today,
					todayGregorianDate: todayDate,
					targetYear: 1447,
					configuredFirstRozaDate: firstRozaDate,
				});

				expect(result[30]).toBe("current");
				expect(result[31]).toBeUndefined();
			});
		});
	});

	describe("getTargetRamadanYear", () => {
		it("returns current hijri year when month is Ramadan (9)", () => {
			const data = {
				...samplePrayerData,
				date: {
					...samplePrayerData.date,
					hijri: {
						...samplePrayerData.date.hijri,
						year: "1447",
						month: {
							...samplePrayerData.date.hijri.month,
							number: 9,
						},
					},
				},
			};
			expect(service.getTargetRamadanYear(data)).toBe(1447);
		});

		it("returns current hijri year when month is before Ramadan", () => {
			const data = {
				...samplePrayerData,
				date: {
					...samplePrayerData.date,
					hijri: {
						...samplePrayerData.date.hijri,
						year: "1447",
						month: {
							...samplePrayerData.date.hijri.month,
							number: 5,
						},
					},
				},
			};
			expect(service.getTargetRamadanYear(data)).toBe(1447);
		});

		it("returns next hijri year when month is after Ramadan", () => {
			const data = {
				...samplePrayerData,
				date: {
					...samplePrayerData.date,
					hijri: {
						...samplePrayerData.date.hijri,
						year: "1447",
						month: {
							...samplePrayerData.date.hijri.month,
							number: 10,
						},
					},
				},
			};
			expect(service.getTargetRamadanYear(data)).toBe(1448);
		});

		it("returns next hijri year when month is 12", () => {
			const data = {
				...samplePrayerData,
				date: {
					...samplePrayerData.date,
					hijri: {
						...samplePrayerData.date.hijri,
						year: "1447",
						month: {
							...samplePrayerData.date.hijri.month,
							number: 12,
						},
					},
				},
			};
			expect(service.getTargetRamadanYear(data)).toBe(1448);
		});
	});

	describe("getHijriYearFromRozaNumber", () => {
		const days = [samplePrayerData, createPrayerDataForDay(2, "2")];

		it("returns year from the prayer data at that roza", () => {
			expect(service.getHijriYearFromRozaNumber(days, 1, 0)).toBe(1447);
		});

		it("returns year from second roza", () => {
			expect(service.getHijriYearFromRozaNumber(days, 2, 0)).toBe(1447);
		});

		it("returns fallback for out-of-range roza number", () => {
			expect(service.getHijriYearFromRozaNumber(days, 5, 1400)).toBe(1400);
		});

		it("returns fallback for roza 0", () => {
			expect(service.getHijriYearFromRozaNumber(days, 0, 1400)).toBe(1400);
		});

		it("returns fallback for empty array", () => {
			expect(service.getHijriYearFromRozaNumber([], 1, 1446)).toBe(1446);
		});

		it("returns fallback for negative roza", () => {
			expect(service.getHijriYearFromRozaNumber(days, -1, 9999)).toBe(9999);
		});
	});

	describe("getHighlightState", () => {
		it("delegates to highlightService and returns a HighlightState for a past day", () => {
			// samplePrayerData has a date in 2026 — for a past date, highlight returns null
			const pastDay: PrayerData = {
				...samplePrayerData,
				date: {
					...samplePrayerData.date,
					gregorian: {
						...samplePrayerData.date.gregorian,
						date: "01-01-2020",
					},
				},
			};
			const result = service.getHighlightState(pastDay);
			expect(result).toBeNull();
		});

		it("delegates to highlightService and returns state for a future day", () => {
			const futureDay: PrayerData = {
				...samplePrayerData,
				date: {
					...samplePrayerData.date,
					gregorian: {
						...samplePrayerData.date.gregorian,
						date: "01-01-2099",
					},
				},
			};
			const result = service.getHighlightState(futureDay);
			expect(result).not.toBeNull();
			expect(result?.current).toBe("Before roza day");
		});
	});

	describe("formatStatusLine", () => {
		it("delegates to highlightService and returns a formatted status string", () => {
			const result = service.formatStatusLine({
				current: "Roza in progress",
				next: "Iftar",
				countdown: "2h 15m",
			});
			expect(result).toBe("Iftar in 2h 15m");
		});

		it("formats First Sehar as Sehar", () => {
			const result = service.formatStatusLine({
				current: "Before roza day",
				next: "First Sehar",
				countdown: "5h 30m",
			});
			expect(result).toBe("Sehar in 5h 30m");
		});

		it("formats Next day Sehar as Sehar", () => {
			const result = service.formatStatusLine({
				current: "Iftar time",
				next: "Next day Sehar",
				countdown: "10h 15m",
			});
			expect(result).toBe("Sehar in 10h 15m");
		});

		it("formats Roza starts (Fajr) as Fast starts", () => {
			const result = service.formatStatusLine({
				current: "Sehar window open",
				next: "Roza starts (Fajr)",
				countdown: "1h 5m",
			});
			expect(result).toBe("Fast starts in 1h 5m");
		});
	});

	describe("getDayByRozaNumber", () => {
		const days = [samplePrayerData, createPrayerDataForDay(2, "2")];

		it("returns the correct PrayerData for roza 1", () => {
			expect(service.getDayByRozaNumber(days, 1)).toBe(samplePrayerData);
		});

		it("returns the correct PrayerData for roza 2", () => {
			const result = service.getDayByRozaNumber(days, 2);
			expect(result.date.hijri.day).toBe("2");
		});

		it("throws RozaNotFoundError for out-of-range roza", () => {
			expect(() => service.getDayByRozaNumber(days, 3)).toThrow(RozaNotFoundError);
		});

		it("throws RozaNotFoundError for roza 0", () => {
			expect(() => service.getDayByRozaNumber(days, 0)).toThrow(RozaNotFoundError);
		});
	});
});
