import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getBanner } from "../../../ui/banner.js";

describe("getBanner", () => {
	const originalColumns = process.stdout.columns;

	afterEach(() => {
		Object.defineProperty(process.stdout, "columns", {
			value: originalColumns,
			writable: true,
			configurable: true,
		});
	});

	it("returns a string", () => {
		const result = getBanner();
		expect(typeof result).toBe("string");
	});

	it("contains moon emoji", () => {
		const result = getBanner();
		expect(result).toContain("\u{1F319}");
	});

	it("contains tagline text", () => {
		const result = getBanner();
		expect(result).toContain("Ramadan CLI Pro");
	});

	it("contains the sehar/iftar tagline", () => {
		const result = getBanner();
		expect(result).toContain("Sehar");
		expect(result).toContain("Iftar");
	});

	it("uses wide banner for wide terminal (columns >= 120)", () => {
		Object.defineProperty(process.stdout, "columns", {
			value: 120,
			writable: true,
			configurable: true,
		});
		const result = getBanner();
		// The wide ANSI_SHADOW banner uses box-drawing characters like ╗ and ╔
		expect(result).toContain("\u2557");
		expect(result).toContain("\u2554");
	});

	it("uses compact banner for narrow terminal (columns < 120)", () => {
		Object.defineProperty(process.stdout, "columns", {
			value: 80,
			writable: true,
			configurable: true,
		});
		const result = getBanner();
		// The compact banner does NOT contain box-drawing characters like ╗ and ╔
		expect(result).not.toContain("\u2557");
		expect(result).not.toContain("\u2554");
	});

	it("uses compact banner when columns is undefined (defaults to 80)", () => {
		Object.defineProperty(process.stdout, "columns", {
			value: undefined,
			writable: true,
			configurable: true,
		});
		const result = getBanner();
		// Should default to 80 which is < 120, so compact
		expect(result).not.toContain("\u2557");
		expect(result).not.toContain("\u2554");
	});

	it("output contains newlines", () => {
		const result = getBanner();
		expect(result).toContain("\n");
		// The banner has multiple newlines from the ASCII art
		const newlineCount = (result.match(/\n/g) ?? []).length;
		expect(newlineCount).toBeGreaterThan(3);
	});

	it("wide banner is longer than compact banner", () => {
		Object.defineProperty(process.stdout, "columns", {
			value: 120,
			writable: true,
			configurable: true,
		});
		const wideBanner = getBanner();

		Object.defineProperty(process.stdout, "columns", {
			value: 80,
			writable: true,
			configurable: true,
		});
		const compactBanner = getBanner();

		expect(wideBanner.length).toBeGreaterThan(compactBanner.length);
	});
});
