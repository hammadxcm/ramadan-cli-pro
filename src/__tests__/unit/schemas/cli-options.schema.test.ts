import { describe, expect, it } from "vitest";
import {
	ConfigCommandOptionsSchema,
	RamadanCommandOptionsSchema,
} from "../../../schemas/cli-options.schema.js";

describe("RamadanCommandOptionsSchema", () => {
	it("parses valid minimal options (empty object)", () => {
		const result = RamadanCommandOptionsSchema.safeParse({});
		expect(result.success).toBe(true);
	});

	it("parses valid full options", () => {
		const result = RamadanCommandOptionsSchema.safeParse({
			city: "Karachi",
			all: true,
			rozaNumber: 15,
			plain: false,
			json: true,
			status: false,
			tui: false,
			locale: "en",
			firstRozaDate: "2025-03-01",
			clearFirstRozaDate: false,
		});
		expect(result.success).toBe(true);
	});

	it("accepts rozaNumber of 1 (minimum)", () => {
		const result = RamadanCommandOptionsSchema.safeParse({ rozaNumber: 1 });
		expect(result.success).toBe(true);
	});

	it("accepts rozaNumber of 30 (maximum)", () => {
		const result = RamadanCommandOptionsSchema.safeParse({ rozaNumber: 30 });
		expect(result.success).toBe(true);
	});

	it("rejects rozaNumber of 0 (below minimum)", () => {
		const result = RamadanCommandOptionsSchema.safeParse({ rozaNumber: 0 });
		expect(result.success).toBe(false);
	});

	it("rejects rozaNumber of 31 (above maximum)", () => {
		const result = RamadanCommandOptionsSchema.safeParse({ rozaNumber: 31 });
		expect(result.success).toBe(false);
	});

	it("rejects non-integer rozaNumber", () => {
		const result = RamadanCommandOptionsSchema.safeParse({ rozaNumber: 5.5 });
		expect(result.success).toBe(false);
	});

	it("accepts firstRozaDate matching YYYY-MM-DD format", () => {
		const result = RamadanCommandOptionsSchema.safeParse({
			firstRozaDate: "2025-03-01",
		});
		expect(result.success).toBe(true);
	});

	it("rejects firstRozaDate not matching YYYY-MM-DD format", () => {
		const result = RamadanCommandOptionsSchema.safeParse({
			firstRozaDate: "03-01-2025",
		});
		expect(result.success).toBe(false);
	});

	it("rejects firstRozaDate with invalid format", () => {
		const result = RamadanCommandOptionsSchema.safeParse({
			firstRozaDate: "2025/03/01",
		});
		expect(result.success).toBe(false);
	});

	it("validates all and json as booleans", () => {
		const validResult = RamadanCommandOptionsSchema.safeParse({
			all: true,
			json: false,
		});
		expect(validResult.success).toBe(true);

		const invalidResult = RamadanCommandOptionsSchema.safeParse({
			all: "yes",
		});
		expect(invalidResult.success).toBe(false);
	});

	it("rejects json as a string", () => {
		const result = RamadanCommandOptionsSchema.safeParse({
			json: "true",
		});
		expect(result.success).toBe(false);
	});
});

describe("ConfigCommandOptionsSchema", () => {
	it("parses valid options", () => {
		const result = ConfigCommandOptionsSchema.safeParse({
			city: "Karachi",
			country: "Pakistan",
			latitude: "24.8607",
			longitude: "67.0011",
			method: "1",
			school: "1",
			timezone: "Asia/Karachi",
			show: true,
			clear: false,
		});
		expect(result.success).toBe(true);
	});

	it("all fields are optional (empty object parses)", () => {
		const result = ConfigCommandOptionsSchema.safeParse({});
		expect(result.success).toBe(true);
	});

	it("validates show as boolean", () => {
		const validResult = ConfigCommandOptionsSchema.safeParse({ show: true });
		expect(validResult.success).toBe(true);

		const invalidResult = ConfigCommandOptionsSchema.safeParse({
			show: "yes",
		});
		expect(invalidResult.success).toBe(false);
	});

	it("validates clear as boolean", () => {
		const validResult = ConfigCommandOptionsSchema.safeParse({ clear: false });
		expect(validResult.success).toBe(true);

		const invalidResult = ConfigCommandOptionsSchema.safeParse({
			clear: 1,
		});
		expect(invalidResult.success).toBe(false);
	});

	it("accepts partial options", () => {
		const result = ConfigCommandOptionsSchema.safeParse({
			city: "London",
			show: true,
		});
		expect(result.success).toBe(true);
	});
});
