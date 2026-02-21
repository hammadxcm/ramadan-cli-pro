import { describe, expect, it } from "vitest";
import {
	addDays,
	formatDateForApi,
	getRozaNumberFromStartDate,
	parseGregorianDate,
	parseGregorianDay,
	parseIsoDate,
} from "../../../utils/date.js";

describe("formatDateForApi", () => {
	it("formats date as DD-MM-YYYY", () => {
		const date = new Date(2026, 2, 1); // March 1, 2026
		expect(formatDateForApi(date)).toBe("01-03-2026");
	});

	it("pads single-digit day and month", () => {
		const date = new Date(2026, 0, 5); // Jan 5
		expect(formatDateForApi(date)).toBe("05-01-2026");
	});
});

describe("parseIsoDate", () => {
	it("parses valid YYYY-MM-DD", () => {
		const result = parseIsoDate("2026-03-01");
		expect(result).not.toBeNull();
		expect(result?.getFullYear()).toBe(2026);
		expect(result?.getMonth()).toBe(2);
		expect(result?.getDate()).toBe(1);
	});

	it("returns null for invalid format", () => {
		expect(parseIsoDate("01-03-2026")).toBeNull();
		expect(parseIsoDate("not-a-date")).toBeNull();
		expect(parseIsoDate("")).toBeNull();
	});

	it("returns null for invalid date values", () => {
		expect(parseIsoDate("2026-13-01")).toBeNull();
		expect(parseIsoDate("2026-02-30")).toBeNull();
	});
});

describe("parseGregorianDate", () => {
	it("parses valid DD-MM-YYYY", () => {
		const result = parseGregorianDate("01-03-2026");
		expect(result).not.toBeNull();
		expect(result?.getFullYear()).toBe(2026);
		expect(result?.getMonth()).toBe(2);
		expect(result?.getDate()).toBe(1);
	});

	it("returns null for invalid format", () => {
		expect(parseGregorianDate("2026-03-01")).toBeNull();
	});
});

describe("addDays", () => {
	it("adds positive days", () => {
		const base = new Date(2026, 2, 1);
		const result = addDays(base, 5);
		expect(result.getDate()).toBe(6);
	});

	it("does not mutate original date", () => {
		const base = new Date(2026, 2, 1);
		addDays(base, 5);
		expect(base.getDate()).toBe(1);
	});
});

describe("getRozaNumberFromStartDate", () => {
	it("returns 1 on first day", () => {
		const start = new Date(2026, 2, 1);
		const target = new Date(2026, 2, 1);
		expect(getRozaNumberFromStartDate(start, target)).toBe(1);
	});

	it("returns correct number for later days", () => {
		const start = new Date(2026, 2, 1);
		const target = new Date(2026, 2, 15);
		expect(getRozaNumberFromStartDate(start, target)).toBe(15);
	});

	it("returns 0 for day before start", () => {
		const start = new Date(2026, 2, 2);
		const target = new Date(2026, 2, 1);
		expect(getRozaNumberFromStartDate(start, target)).toBe(0);
	});
});

describe("parseGregorianDate – invalid date values", () => {
	it("returns null for Feb 30 (invalid day for month)", () => {
		expect(parseGregorianDate("30-02-2026")).toBeNull();
	});

	it("returns null for month 13 (invalid month)", () => {
		expect(parseGregorianDate("15-13-2026")).toBeNull();
	});

	it("returns null for day 31 in a 30-day month", () => {
		// April has 30 days
		expect(parseGregorianDate("31-04-2026")).toBeNull();
	});

	it("returns null for Feb 29 in a non-leap year", () => {
		expect(parseGregorianDate("29-02-2025")).toBeNull();
	});

	it("accepts Feb 29 in a leap year", () => {
		const result = parseGregorianDate("29-02-2024");
		expect(result).not.toBeNull();
		expect(result?.getDate()).toBe(29);
		expect(result?.getMonth()).toBe(1);
	});
});

describe("parseGregorianDay", () => {
	it("parses valid DD-MM-YYYY to parts", () => {
		const result = parseGregorianDay("15-03-2026");
		expect(result).toEqual({ year: 2026, month: 3, day: 15 });
	});

	it("returns null for invalid input", () => {
		expect(parseGregorianDay("invalid")).toBeNull();
		expect(parseGregorianDay("2026-03-15")).toBeNull();
	});

	it("returns null when day exceeds 31", () => {
		expect(parseGregorianDay("32-03-2026")).toBeNull();
	});

	it("returns null when month exceeds 12", () => {
		expect(parseGregorianDay("15-13-2026")).toBeNull();
	});

	it("returns null when day is 0", () => {
		expect(parseGregorianDay("00-03-2026")).toBeNull();
	});

	it("returns null when month is 0", () => {
		expect(parseGregorianDay("15-00-2026")).toBeNull();
	});
});
