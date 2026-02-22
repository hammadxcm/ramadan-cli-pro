import { describe, expect, it } from "vitest";
import { CITY_ALIAS_MAP, normalizeCityAlias } from "../../../data/city-aliases.js";

describe("CITY_ALIAS_MAP", () => {
	it("should contain at least 50 aliases", () => {
		expect(Object.keys(CITY_ALIAS_MAP).length).toBeGreaterThanOrEqual(50);
	});

	it("should have all values as non-empty strings", () => {
		for (const [alias, city] of Object.entries(CITY_ALIAS_MAP)) {
			expect(city, `alias "${alias}" has empty city`).toBeTruthy();
			expect(typeof city).toBe("string");
		}
	});

	it("should have all keys as lowercase", () => {
		for (const alias of Object.keys(CITY_ALIAS_MAP)) {
			expect(alias).toBe(alias.toLowerCase());
		}
	});

	it("should contain key regional aliases", () => {
		const expected: Record<string, string> = {
			sf: "San Francisco",
			khi: "Karachi",
			ruh: "Riyadh",
			mak: "Makkah, Saudi Arabia",
			makkah: "Makkah, Saudi Arabia",
			mecca: "Makkah, Saudi Arabia",
			mad: "Madinah, Saudi Arabia",
			madinah: "Madinah, Saudi Arabia",
			medina: "Madinah, Saudi Arabia",
			doh: "Doha",
			lag: "Lagos",
			par: "Paris",
			sg: "Singapore",
			syd: "Sydney",
			tor: "Toronto",
			tsh: "Tashkent",
			dhk: "Dhaka",
		};

		for (const [alias, city] of Object.entries(expected)) {
			expect(CITY_ALIAS_MAP[alias], `alias "${alias}"`).toBe(city);
		}
	});
});

describe("normalizeCityAlias", () => {
	it("should resolve known aliases case-insensitively", () => {
		expect(normalizeCityAlias("khi")).toBe("Karachi");
		expect(normalizeCityAlias("KHI")).toBe("Karachi");
		expect(normalizeCityAlias("Khi")).toBe("Karachi");
	});

	it("should return the input unchanged for unknown aliases", () => {
		expect(normalizeCityAlias("Berlin")).toBe("Berlin");
		expect(normalizeCityAlias("Unknown City")).toBe("Unknown City");
	});

	it("should trim whitespace", () => {
		expect(normalizeCityAlias("  khi  ")).toBe("Karachi");
	});

	it("should resolve all Middle East aliases", () => {
		expect(normalizeCityAlias("ruh")).toBe("Riyadh");
		expect(normalizeCityAlias("doh")).toBe("Doha");
		expect(normalizeCityAlias("kwt")).toBe("Kuwait City");
		expect(normalizeCityAlias("mus")).toBe("Muscat");
		expect(normalizeCityAlias("amm")).toBe("Amman");
		expect(normalizeCityAlias("bgd")).toBe("Baghdad");
		expect(normalizeCityAlias("bei")).toBe("Beirut");
		expect(normalizeCityAlias("dam")).toBe("Damascus");
	});

	it("should resolve all European aliases", () => {
		expect(normalizeCityAlias("par")).toBe("Paris");
		expect(normalizeCityAlias("ber")).toBe("Berlin");
		expect(normalizeCityAlias("ams")).toBe("Amsterdam");
		expect(normalizeCityAlias("bru")).toBe("Brussels");
		expect(normalizeCityAlias("osl")).toBe("Oslo");
		expect(normalizeCityAlias("sto")).toBe("Stockholm");
	});
});
