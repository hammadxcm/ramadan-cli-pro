import { describe, expect, it } from "vitest";
import { formatCountdown, parsePrayerTimeToMinutes, to12HourTime } from "../../../utils/time.js";

describe("to12HourTime", () => {
	it("converts 24h to 12h AM", () => {
		expect(to12HourTime("05:15")).toBe("5:15 AM");
	});

	it("converts 24h to 12h PM", () => {
		expect(to12HourTime("17:55")).toBe("5:55 PM");
	});

	it("handles midnight", () => {
		expect(to12HourTime("00:00")).toBe("12:00 AM");
	});

	it("handles noon", () => {
		expect(to12HourTime("12:00")).toBe("12:00 PM");
	});

	it("strips timezone suffix", () => {
		expect(to12HourTime("05:15 (PKT)")).toBe("5:15 AM");
	});

	it("returns input for invalid format", () => {
		expect(to12HourTime("invalid")).toBe("invalid");
	});
});

describe("parsePrayerTimeToMinutes", () => {
	it("parses valid time to minutes", () => {
		expect(parsePrayerTimeToMinutes("05:15")).toBe(315);
		expect(parsePrayerTimeToMinutes("17:55")).toBe(1075);
		expect(parsePrayerTimeToMinutes("00:00")).toBe(0);
	});

	it("strips timezone suffix", () => {
		expect(parsePrayerTimeToMinutes("05:15 (PKT)")).toBe(315);
	});

	it("returns null for invalid", () => {
		expect(parsePrayerTimeToMinutes("invalid")).toBeNull();
		expect(parsePrayerTimeToMinutes("25:00")).toBeNull();
	});
});

describe("formatCountdown", () => {
	it("formats hours and minutes", () => {
		expect(formatCountdown(125)).toBe("2h 5m");
	});

	it("formats minutes only when < 60", () => {
		expect(formatCountdown(45)).toBe("45m");
	});

	it("handles zero", () => {
		expect(formatCountdown(0)).toBe("0m");
	});

	it("handles negative (clamps to 0)", () => {
		expect(formatCountdown(-5)).toBe("0m");
	});
});
