import { describe, expect, it } from "vitest";
import { METHOD_OPTIONS, findMethodLabel } from "../../../data/calculation-methods.js";

describe("METHOD_OPTIONS", () => {
	it("is an array", () => {
		expect(Array.isArray(METHOD_OPTIONS)).toBe(true);
	});

	it("contains 23 entries (IDs 0-5 and 7-23, skipping 6)", () => {
		expect(METHOD_OPTIONS).toHaveLength(23);
	});

	it("each option has value, label, and optional hint", () => {
		for (const option of METHOD_OPTIONS) {
			expect(typeof option.value).toBe("number");
			expect(typeof option.label).toBe("string");
			expect(option.label.length).toBeGreaterThan(0);
			if (option.hint !== undefined) {
				expect(typeof option.hint).toBe("string");
			}
		}
	});

	it("contains known method IDs", () => {
		const values = METHOD_OPTIONS.map((o) => o.value);
		expect(values).toContain(0);
		expect(values).toContain(1);
		expect(values).toContain(2);
		expect(values).toContain(3);
		expect(values).toContain(23);
	});

	it("does not contain method ID 6", () => {
		const values = METHOD_OPTIONS.map((o) => o.value);
		expect(values).not.toContain(6);
	});
});

describe("findMethodLabel", () => {
	it("returns correct label for Jafari (method 0)", () => {
		expect(findMethodLabel(0)).toBe("Jafari (Shia Ithna-Ashari)");
	});

	it("returns correct label for Karachi (method 1)", () => {
		expect(findMethodLabel(1)).toBe("Karachi (Pakistan)");
	});

	it("returns correct label for ISNA (method 2)", () => {
		expect(findMethodLabel(2)).toBe("ISNA (North America)");
	});

	it("returns correct label for MWL (method 3)", () => {
		expect(findMethodLabel(3)).toBe("MWL (Muslim World League)");
	});

	it("returns correct label for Jordan (method 23)", () => {
		expect(findMethodLabel(23)).toBe("Jordan");
	});

	it("returns 'Method {id}' for unknown method ID", () => {
		expect(findMethodLabel(99)).toBe("Method 99");
	});

	it("returns 'Method {id}' for negative method ID", () => {
		expect(findMethodLabel(-1)).toBe("Method -1");
	});

	it("returns 'Method {id}' for method ID 6 (not in list)", () => {
		expect(findMethodLabel(6)).toBe("Method 6");
	});
});
