import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("theme – color branch coverage", () => {
	const originalColorTerm = process.env.COLORTERM;

	afterEach(() => {
		vi.unstubAllEnvs();
		vi.resetModules();

		// Restore original COLORTERM
		if (originalColorTerm !== undefined) {
			process.env.COLORTERM = originalColorTerm;
		} else {
			process.env.COLORTERM = undefined;
		}
	});

	it("uses true color ANSI codes when COLORTERM=truecolor", async () => {
		vi.stubEnv("COLORTERM", "truecolor");
		vi.resetModules();

		const pc = await import("picocolors");
		Object.defineProperty(pc.default, "isColorSupported", {
			value: true,
			writable: true,
			configurable: true,
		});

		const { ramadanGreen } = await import("../../../ui/theme.js");
		const result = ramadanGreen("hello");

		// Should contain the 24-bit ANSI escape with the Ramadan green RGB
		expect(result).toContain("\u001B[38;2;128;240;151m");
		expect(result).toContain("hello");
		expect(result).toContain("\u001B[0m");
	});

	it("uses true color ANSI codes when COLORTERM=24bit", async () => {
		vi.stubEnv("COLORTERM", "24bit");
		vi.resetModules();

		const pc = await import("picocolors");
		Object.defineProperty(pc.default, "isColorSupported", {
			value: true,
			writable: true,
			configurable: true,
		});

		const { ramadanGreen } = await import("../../../ui/theme.js");
		const result = ramadanGreen("world");

		expect(result).toContain("\u001B[38;2;128;240;151m");
		expect(result).toContain("world");
		expect(result).toContain("\u001B[0m");
	});

	it("falls back to picocolors green when COLORTERM is not truecolor/24bit", async () => {
		vi.stubEnv("COLORTERM", "");
		vi.resetModules();

		const pc = await import("picocolors");
		Object.defineProperty(pc.default, "isColorSupported", {
			value: true,
			writable: true,
			configurable: true,
		});

		const { ramadanGreen } = await import("../../../ui/theme.js");
		const result = ramadanGreen("fallback");

		// Should NOT contain the 24-bit escape
		expect(result).not.toContain("\u001B[38;2;128;240;151m");
		// Should contain the input
		expect(result).toContain("fallback");
		// Should equal picocolors green output
		expect(result).toBe(pc.default.green("fallback"));
	});

	it("falls back to picocolors green when COLORTERM is undefined", async () => {
		process.env.COLORTERM = undefined;
		vi.resetModules();

		const pc = await import("picocolors");
		Object.defineProperty(pc.default, "isColorSupported", {
			value: true,
			writable: true,
			configurable: true,
		});

		const { ramadanGreen } = await import("../../../ui/theme.js");
		const result = ramadanGreen("no-env");

		expect(result).not.toContain("\u001B[38;2;128;240;151m");
		expect(result).toBe(pc.default.green("no-env"));
	});

	it("returns plain text when pc.isColorSupported is false", async () => {
		vi.resetModules();

		const pc = await import("picocolors");
		Object.defineProperty(pc.default, "isColorSupported", {
			value: false,
			writable: true,
			configurable: true,
		});

		const { ramadanGreen } = await import("../../../ui/theme.js");
		const result = ramadanGreen("plain");

		expect(result).toBe("plain");
	});

	it("produces correct ANSI escape sequence format", async () => {
		vi.stubEnv("COLORTERM", "truecolor");
		vi.resetModules();

		const pc = await import("picocolors");
		Object.defineProperty(pc.default, "isColorSupported", {
			value: true,
			writable: true,
			configurable: true,
		});

		const { ramadanGreen } = await import("../../../ui/theme.js");
		const result = ramadanGreen("test");

		// Exact expected output: ESC[38;2;128;240;151mtest ESC[0m
		expect(result).toBe("\u001B[38;2;128;240;151mtest\u001B[0m");
	});

	it("handles case-insensitive COLORTERM values", async () => {
		vi.stubEnv("COLORTERM", "TrueColor");
		vi.resetModules();

		const pc = await import("picocolors");
		Object.defineProperty(pc.default, "isColorSupported", {
			value: true,
			writable: true,
			configurable: true,
		});

		const { ramadanGreen } = await import("../../../ui/theme.js");
		const result = ramadanGreen("mixed-case");

		// supportsTrueColor lowercases the env var, so TrueColor should work
		expect(result).toContain("\u001B[38;2;128;240;151m");
		expect(result).toContain("mixed-case");
	});
});
