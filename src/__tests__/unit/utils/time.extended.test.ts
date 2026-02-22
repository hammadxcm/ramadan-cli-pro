import { afterEach, describe, expect, it, vi } from "vitest";
import { nowInTimezoneParts, parsePrayerTimeToMinutes, to12HourTime } from "../../../utils/time.js";

describe("to12HourTime – edge cases", () => {
	it("returns the raw value when hour exceeds 23", () => {
		expect(to12HourTime("24:00")).toBe("24:00");
	});

	it("returns the raw value when minute exceeds 59", () => {
		expect(to12HourTime("12:99")).toBe("12:99");
	});

	it("returns the raw value for negative-looking but regex-matched input", () => {
		// These won't match the regex (dash before digit), so they return as-is
		expect(to12HourTime("-1:00")).toBe("-1:00");
	});
});

describe("parsePrayerTimeToMinutes – edge cases", () => {
	it("returns null when minute exceeds 59", () => {
		expect(parsePrayerTimeToMinutes("12:60")).toBeNull();
	});

	it("returns null when hour is 24", () => {
		expect(parsePrayerTimeToMinutes("24:00")).toBeNull();
	});
});

describe("nowInTimezoneParts", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("returns valid date parts for a known timezone", () => {
		const result = nowInTimezoneParts("Asia/Karachi");
		expect(result).not.toBeNull();
		expect(result).toHaveProperty("year");
		expect(result).toHaveProperty("month");
		expect(result).toHaveProperty("day");
		expect(result).toHaveProperty("minutes");
		expect(typeof result?.year).toBe("number");
		expect(typeof result?.month).toBe("number");
		expect(typeof result?.day).toBe("number");
		expect(typeof result?.minutes).toBe("number");
		expect(result?.minutes).toBeGreaterThanOrEqual(0);
		expect(result?.minutes).toBeLessThan(1440);
	});

	it("returns null for an invalid timezone (catch block)", () => {
		const result = nowInTimezoneParts("Invalid/Timezone_That_Does_Not_Exist");
		expect(result).toBeNull();
	});

	it("normalizes hour 24 to 0", () => {
		const mockParts: Intl.DateTimeFormatPart[] = [
			{ type: "day", value: "15" },
			{ type: "literal", value: "/" },
			{ type: "month", value: "03" },
			{ type: "literal", value: "/" },
			{ type: "year", value: "2026" },
			{ type: "literal", value: ", " },
			{ type: "hour", value: "24" },
			{ type: "literal", value: ":" },
			{ type: "minute", value: "00" },
		];

		const mockFormatter = {
			formatToParts: vi.fn().mockReturnValue(mockParts),
		};

		vi.spyOn(Intl, "DateTimeFormat").mockReturnValue(
			mockFormatter as unknown as Intl.DateTimeFormat,
		);

		const result = nowInTimezoneParts("UTC");
		expect(result).not.toBeNull();
		expect(result?.year).toBe(2026);
		expect(result?.month).toBe(3);
		expect(result?.day).toBe(15);
		// hour=24 normalised to 0 → 0*60 + 0 = 0
		expect(result?.minutes).toBe(0);
	});

	it("returns null when a required date part is missing", () => {
		const mockParts: Intl.DateTimeFormatPart[] = [
			{ type: "day", value: "15" },
			{ type: "month", value: "03" },
			// year is missing
			{ type: "hour", value: "10" },
			{ type: "minute", value: "30" },
		];

		const mockFormatter = {
			formatToParts: vi.fn().mockReturnValue(mockParts),
		};

		vi.spyOn(Intl, "DateTimeFormat").mockReturnValue(
			mockFormatter as unknown as Intl.DateTimeFormat,
		);

		const result = nowInTimezoneParts("UTC");
		expect(result).toBeNull();
	});

	it("returns null when a date part value is not a valid number (NaN branch)", () => {
		const mockParts: Intl.DateTimeFormatPart[] = [
			{ type: "day", value: "15" },
			{ type: "month", value: "03" },
			{ type: "year", value: "abc" }, // non-numeric value triggers Number.isNaN
			{ type: "hour", value: "10" },
			{ type: "minute", value: "30" },
		];

		const mockFormatter = {
			formatToParts: vi.fn().mockReturnValue(mockParts),
		};

		vi.spyOn(Intl, "DateTimeFormat").mockReturnValue(
			mockFormatter as unknown as Intl.DateTimeFormat,
		);

		const result = nowInTimezoneParts("UTC");
		expect(result).toBeNull();
	});

	it("returns null when formatToParts throws an exception", () => {
		const mockFormatter = {
			formatToParts: vi.fn().mockImplementation(() => {
				throw new Error("Intl formatting error");
			}),
		};

		vi.spyOn(Intl, "DateTimeFormat").mockReturnValue(
			mockFormatter as unknown as Intl.DateTimeFormat,
		);

		const result = nowInTimezoneParts("UTC");
		expect(result).toBeNull();
	});
});
