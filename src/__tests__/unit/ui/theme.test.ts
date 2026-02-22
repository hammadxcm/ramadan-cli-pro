import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MOON_EMOJI, ramadanGreen } from "../../../ui/theme.js";

describe("MOON_EMOJI", () => {
	it("equals the crescent moon emoji", () => {
		expect(MOON_EMOJI).toBe("\u{1F319}");
	});
});

describe("ramadanGreen", () => {
	it("returns a string", () => {
		const result = ramadanGreen("test");
		expect(typeof result).toBe("string");
	});

	it("includes the input text in the output", () => {
		const input = "Hello Ramadan";
		const result = ramadanGreen(input);
		expect(result).toContain(input);
	});

	it("returns plain text when colors are not supported", async () => {
		// Dynamically import picocolors to mock isColorSupported
		const pc = await import("picocolors");
		const originalValue = pc.default.isColorSupported;

		// Override isColorSupported to false
		Object.defineProperty(pc.default, "isColorSupported", {
			value: false,
			writable: true,
			configurable: true,
		});

		// Re-import to get the function using updated pc state
		const { ramadanGreen: greenFn } = await import("../../../ui/theme.js");
		const result = greenFn("plain text");
		expect(result).toBe("plain text");

		// Restore
		Object.defineProperty(pc.default, "isColorSupported", {
			value: originalValue,
			writable: true,
			configurable: true,
		});
	});

	it("handles empty string input", () => {
		const result = ramadanGreen("");
		expect(typeof result).toBe("string");
	});

	it("handles multi-line input", () => {
		const input = "line1\nline2\nline3";
		const result = ramadanGreen(input);
		expect(result).toContain("line1");
		expect(result).toContain("line2");
		expect(result).toContain("line3");
	});
});
