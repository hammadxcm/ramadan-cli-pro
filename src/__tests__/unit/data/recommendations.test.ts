import { describe, expect, it } from "vitest";
import { getRecommendedMethod, getRecommendedSchool } from "../../../data/recommendations.js";

describe("getRecommendedMethod", () => {
	it("returns method for known country", () => {
		expect(getRecommendedMethod("Pakistan")).toBe(1);
		expect(getRecommendedMethod("United States")).toBe(2);
		expect(getRecommendedMethod("Turkey")).toBe(13);
	});

	it("matches case-insensitively", () => {
		expect(getRecommendedMethod("pakistan")).toBe(1);
		expect(getRecommendedMethod("TURKEY")).toBe(13);
	});

	it("returns null for unknown country", () => {
		expect(getRecommendedMethod("Atlantis")).toBeNull();
	});
});

describe("getRecommendedSchool", () => {
	it("returns 1 (Hanafi) for Hanafi countries", () => {
		expect(getRecommendedSchool("Pakistan")).toBe(1);
		expect(getRecommendedSchool("India")).toBe(1);
		expect(getRecommendedSchool("Turkey")).toBe(1);
	});

	it("returns 0 (Shafi) for non-Hanafi countries", () => {
		expect(getRecommendedSchool("United States")).toBe(0);
		expect(getRecommendedSchool("Saudi Arabia")).toBe(0);
	});

	it("matches case-insensitively", () => {
		expect(getRecommendedSchool("pakistan")).toBe(1);
	});
});
