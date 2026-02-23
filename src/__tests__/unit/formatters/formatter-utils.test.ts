import { describe, expect, it } from "vitest";
import {
	TABLE_COLUMN_WIDTHS,
	getStatusLabel,
	getTableDivider,
	padColumn,
} from "../../../formatters/formatter.utils.js";

describe("getStatusLabel", () => {
	it("should return 'Sehar' for 'First Sehar'", () => {
		expect(getStatusLabel("First Sehar")).toBe("Sehar");
	});

	it("should return 'Sehar' for 'Next day Sehar'", () => {
		expect(getStatusLabel("Next day Sehar")).toBe("Sehar");
	});

	it("should return 'Fast starts' for 'Roza starts (Fajr)'", () => {
		expect(getStatusLabel("Roza starts (Fajr)")).toBe("Fast starts");
	});

	it("should return the input string for unrecognized keys", () => {
		expect(getStatusLabel("Iftar")).toBe("Iftar");
	});

	it("should return the input string as-is for any other value", () => {
		expect(getStatusLabel("Custom Label")).toBe("Custom Label");
	});
});

describe("padColumn", () => {
	it("should pad a short string to the column width", () => {
		// Column index 0 has width 6 (TABLE_COLUMN_WIDTHS[0])
		const result = padColumn("Hi", 0);
		expect(result).toHaveLength(TABLE_COLUMN_WIDTHS[0]);
		expect(result).toBe("Hi    ");
	});

	it("should not truncate a string longer than the column width", () => {
		// Column index 0 has width 6
		const longText = "VeryLongText";
		const result = padColumn(longText, 0);
		expect(result).toBe(longText);
	});

	it("should return the string unchanged when it matches the column width exactly", () => {
		// Column index 1 has width 8
		const exactText = "12345678";
		const result = padColumn(exactText, 1);
		expect(result).toBe(exactText);
	});

	it("should use the string length when column index is out of bounds", () => {
		const text = "test";
		const result = padColumn(text, 999);
		expect(result).toBe(text);
	});
});

describe("getTableDivider", () => {
	it("should return a string of dashes", () => {
		const divider = getTableDivider();
		expect(divider).toMatch(/^-+$/);
	});

	it("should have a length greater than zero", () => {
		const divider = getTableDivider();
		expect(divider.length).toBeGreaterThan(0);
	});

	it("should consist only of dash characters", () => {
		const divider = getTableDivider();
		for (const char of divider) {
			expect(char).toBe("-");
		}
	});
});
