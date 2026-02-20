import { describe, expect, it } from "vitest";
import {
	toLatitude,
	toLongitude,
	toMethodId,
	toRozaNumber,
	toSchoolId,
} from "../../types/branded.js";

describe("Branded types", () => {
	describe("toLatitude", () => {
		it("accepts valid latitudes", () => {
			expect(toLatitude(0)).toBe(0);
			expect(toLatitude(90)).toBe(90);
			expect(toLatitude(-90)).toBe(-90);
			expect(toLatitude(31.5)).toBe(31.5);
		});

		it("rejects out of range", () => {
			expect(() => toLatitude(91)).toThrow(RangeError);
			expect(() => toLatitude(-91)).toThrow(RangeError);
		});
	});

	describe("toLongitude", () => {
		it("accepts valid longitudes", () => {
			expect(toLongitude(0)).toBe(0);
			expect(toLongitude(180)).toBe(180);
			expect(toLongitude(-180)).toBe(-180);
		});

		it("rejects out of range", () => {
			expect(() => toLongitude(181)).toThrow(RangeError);
		});
	});

	describe("toMethodId", () => {
		it("accepts 0-23", () => {
			expect(toMethodId(0)).toBe(0);
			expect(toMethodId(23)).toBe(23);
		});

		it("rejects invalid", () => {
			expect(() => toMethodId(-1)).toThrow(RangeError);
			expect(() => toMethodId(24)).toThrow(RangeError);
			expect(() => toMethodId(1.5)).toThrow(RangeError);
		});
	});

	describe("toSchoolId", () => {
		it("accepts 0 or 1", () => {
			expect(toSchoolId(0)).toBe(0);
			expect(toSchoolId(1)).toBe(1);
		});

		it("rejects other values", () => {
			expect(() => toSchoolId(2)).toThrow(RangeError);
		});
	});

	describe("toRozaNumber", () => {
		it("accepts 1-30", () => {
			expect(toRozaNumber(1)).toBe(1);
			expect(toRozaNumber(30)).toBe(30);
		});

		it("rejects invalid", () => {
			expect(() => toRozaNumber(0)).toThrow(RangeError);
			expect(() => toRozaNumber(31)).toThrow(RangeError);
		});
	});
});
