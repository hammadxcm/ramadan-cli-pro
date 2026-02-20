import { describe, expect, it } from "vitest";
import { RozaNotFoundError } from "../../../errors/prayer.error.js";
import { DateService } from "../../../services/date.service.js";
import { HighlightService } from "../../../services/highlight.service.js";
import type { LocationService } from "../../../services/location.service.js";
import type { PrayerTimeService } from "../../../services/prayer-time.service.js";
import { RamadanService } from "../../../services/ramadan.service.js";
import { TimeFormatService } from "../../../services/time-format.service.js";
import { createPrayerDataForDay, samplePrayerData } from "../../helpers/fixtures.js";

describe("RamadanService", () => {
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

	it("toRamadanRow formats row correctly", () => {
		const row = service.toRamadanRow(samplePrayerData, 1);
		expect(row.roza).toBe(1);
		expect(row.sehar).toBe("5:15 AM");
		expect(row.iftar).toBe("5:55 PM");
		expect(row.date).toBe("01 Mar 2026");
		expect(row.hijri).toBe("1 Ramadan 1447");
	});

	it("getTargetRamadanYear delegates to dateService", () => {
		expect(service.getTargetRamadanYear(samplePrayerData)).toBe(1447);
	});

	it("getRowByRozaNumber returns correct row", () => {
		const days = [samplePrayerData, createPrayerDataForDay(2, "2")];
		const row = service.getRowByRozaNumber(days, 2);
		expect(row.roza).toBe(2);
	});

	it("getRowByRozaNumber throws for invalid number", () => {
		const days = [samplePrayerData];
		expect(() => service.getRowByRozaNumber(days, 5)).toThrow(RozaNotFoundError);
	});

	it("getDayByRozaNumber returns correct day", () => {
		const days = [samplePrayerData];
		expect(service.getDayByRozaNumber(days, 1)).toBe(samplePrayerData);
	});

	it("getHijriYearFromRozaNumber returns year from data", () => {
		const days = [samplePrayerData];
		expect(service.getHijriYearFromRozaNumber(days, 1, 0)).toBe(1447);
	});

	it("getHijriYearFromRozaNumber returns fallback for missing", () => {
		expect(service.getHijriYearFromRozaNumber([], 5, 1400)).toBe(1400);
	});
});
