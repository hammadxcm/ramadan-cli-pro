import { describe, expect, it } from "vitest";
import { normalize, toNonEmptyString } from "../../../utils/string.js";

describe("normalize", () => {
	it("trims and lowercases", () => {
		expect(normalize("  Lahore  ")).toBe("lahore");
	});
});

describe("toNonEmptyString", () => {
	it("returns trimmed string", () => {
		expect(toNonEmptyString("  hello  ")).toBe("hello");
	});

	it("returns null for empty string", () => {
		expect(toNonEmptyString("")).toBeNull();
		expect(toNonEmptyString("   ")).toBeNull();
	});

	it("returns null for non-string", () => {
		expect(toNonEmptyString(123)).toBeNull();
		expect(toNonEmptyString(null)).toBeNull();
		expect(toNonEmptyString(undefined)).toBeNull();
	});
});
