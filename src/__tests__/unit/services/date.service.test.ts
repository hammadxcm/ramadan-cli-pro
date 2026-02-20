import { describe, expect, it } from "vitest";
import { DateService } from "../../../services/date.service.js";

describe("DateService", () => {
	const service = new DateService();

	it("formatForApi returns DD-MM-YYYY", () => {
		const date = new Date(2026, 2, 1);
		expect(service.formatForApi(date)).toBe("01-03-2026");
	});

	it("parseIso returns Date for valid ISO", () => {
		expect(service.parseIso("2026-03-01")).not.toBeNull();
	});

	it("parseGregorian returns Date for DD-MM-YYYY", () => {
		expect(service.parseGregorian("01-03-2026")).not.toBeNull();
	});

	it("addDays adds correctly", () => {
		const base = new Date(2026, 2, 1);
		const result = service.addDays(base, 10);
		expect(result.getDate()).toBe(11);
	});

	it("getRozaNumber returns 1 on first day", () => {
		const first = new Date(2026, 2, 1);
		expect(service.getRozaNumber(first, first)).toBe(1);
	});

	it("getRozaNumberFromHijriDay parses correctly", () => {
		expect(service.getRozaNumberFromHijriDay("15")).toBe(15);
		expect(service.getRozaNumberFromHijriDay("bad")).toBe(1);
	});

	it("getTargetRamadanYear returns next year if past Ramadan", () => {
		expect(service.getTargetRamadanYear("1447", 10)).toBe(1448);
		expect(service.getTargetRamadanYear("1447", 8)).toBe(1447);
		expect(service.getTargetRamadanYear("1447", 9)).toBe(1447);
	});
});
