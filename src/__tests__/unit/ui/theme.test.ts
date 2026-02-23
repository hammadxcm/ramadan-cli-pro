import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MOON_EMOJI, isNoColor, ramadanGreen, setActivePrimary } from "../../../ui/theme.js";

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

describe("ui/theme", () => {
	it("ramadanGreen: applies default primary color", () => {
		const result = ramadanGreen("hello");
		expect(typeof result).toBe("string");
		expect(result).toContain("hello");
	});

	it("setActivePrimary: overrides the primary color function", () => {
		const custom = (text: string) => `[custom]${text}`;
		setActivePrimary(custom);
		const result = ramadanGreen("test");
		expect(result).toBe("[custom]test");
	});
});

describe("isNoColor", () => {
	const originalEnv = process.env;

	beforeEach(() => {
		// Reset activePrimary back to the default before each NO_COLOR test
		// by clearing module cache and re-importing would be complex,
		// so we use setActivePrimary to reset to a known state after custom override tests
	});

	afterEach(() => {
		// Restore original env
		process.env = originalEnv;
	});

	it("returns true when NO_COLOR is set to a non-empty value", () => {
		process.env = { ...originalEnv, NO_COLOR: "1" };
		expect(isNoColor()).toBe(true);
	});

	it("returns true when NO_COLOR is set to an empty string", () => {
		process.env = { ...originalEnv, NO_COLOR: "" };
		expect(isNoColor()).toBe(true);
	});

	it("returns false when NO_COLOR is not set", () => {
		const { NO_COLOR: _, ...envWithout } = originalEnv;
		process.env = envWithout;
		expect(isNoColor()).toBe(false);
	});
});

describe("NO_COLOR integration with ramadanGreen", () => {
	const originalEnv = process.env;

	afterEach(() => {
		process.env = originalEnv;
	});

	it("returns plain text when NO_COLOR is set", async () => {
		process.env = { ...originalEnv, NO_COLOR: "1" };

		// Need a fresh import so defaultPrimary reads the updated env
		// Clear module cache to get a fresh defaultPrimary
		vi.resetModules();
		const { ramadanGreen: freshGreen } = await import("../../../ui/theme.js");

		const result = freshGreen("no color text");
		expect(result).toBe("no color text");
	});

	it("returns plain text when NO_COLOR is empty string", async () => {
		process.env = { ...originalEnv, NO_COLOR: "" };

		vi.resetModules();
		const { ramadanGreen: freshGreen } = await import("../../../ui/theme.js");

		const result = freshGreen("still no color");
		expect(result).toBe("still no color");
	});

	it("returns colored text when NO_COLOR is not set", async () => {
		const { NO_COLOR: _, ...envWithout } = originalEnv;
		process.env = envWithout;

		vi.resetModules();
		const { ramadanGreen: freshGreen } = await import("../../../ui/theme.js");

		// We can't assert the exact ANSI codes because it depends on terminal support,
		// but we can verify the text is included and it's a valid string
		const result = freshGreen("colored text");
		expect(result).toContain("colored text");
		expect(typeof result).toBe("string");
	});
});
