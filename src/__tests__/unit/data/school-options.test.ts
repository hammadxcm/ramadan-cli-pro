import { describe, expect, it } from "vitest";
import { SCHOOL_HANAFI, SCHOOL_SHAFI, getSchoolOptions } from "../../../data/school-options.js";

describe("school constants", () => {
	it("SCHOOL_SHAFI equals 0", () => {
		expect(SCHOOL_SHAFI).toBe(0);
	});

	it("SCHOOL_HANAFI equals 1", () => {
		expect(SCHOOL_HANAFI).toBe(1);
	});
});

describe("getSchoolOptions", () => {
	it("returns both school options", () => {
		const options = getSchoolOptions(SCHOOL_SHAFI);
		expect(options).toHaveLength(2);
	});

	it("puts Hanafi first when recommendedSchool is 1", () => {
		const options = getSchoolOptions(SCHOOL_HANAFI);
		expect(options[0]?.value).toBe(SCHOOL_HANAFI);
		expect(options[0]?.label).toContain("Hanafi");
		expect(options[0]?.label).toContain("Recommended");
		expect(options[1]?.value).toBe(SCHOOL_SHAFI);
		expect(options[1]?.label).toBe("Shafi");
	});

	it("puts Shafi first when recommendedSchool is 0", () => {
		const options = getSchoolOptions(SCHOOL_SHAFI);
		expect(options[0]?.value).toBe(SCHOOL_SHAFI);
		expect(options[0]?.label).toContain("Shafi");
		expect(options[0]?.label).toContain("Recommended");
		expect(options[1]?.value).toBe(SCHOOL_HANAFI);
		expect(options[1]?.label).toBe("Hanafi");
	});

	it("each option has value, label, and hint properties", () => {
		const options = getSchoolOptions(SCHOOL_SHAFI);
		for (const option of options) {
			expect(typeof option.value).toBe("number");
			expect(typeof option.label).toBe("string");
			expect(typeof option.hint).toBe("string");
		}
	});

	it("Hanafi option has 'Later Asr timing' hint", () => {
		const options = getSchoolOptions(SCHOOL_SHAFI);
		const hanafi = options.find((o) => o.value === SCHOOL_HANAFI);
		expect(hanafi).toBeDefined();
		expect(hanafi?.hint).toBe("Later Asr timing");
	});

	it("Shafi option has 'Standard Asr timing' hint", () => {
		const options = getSchoolOptions(SCHOOL_HANAFI);
		const shafi = options.find((o) => o.value === SCHOOL_SHAFI);
		expect(shafi).toBeDefined();
		expect(shafi?.hint).toBe("Standard Asr timing");
	});

	it("defaults to Shafi first for unknown recommendedSchool value", () => {
		const options = getSchoolOptions(99);
		expect(options[0]?.value).toBe(SCHOOL_SHAFI);
		expect(options[0]?.label).toContain("Recommended");
	});
});
