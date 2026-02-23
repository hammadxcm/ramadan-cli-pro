import pc from "picocolors";
import { afterEach, describe, expect, it } from "vitest";
import { classicGoldTheme } from "../../../themes/classic-gold.theme.js";
import { highContrastTheme } from "../../../themes/high-contrast.theme.js";
import { oceanBlueTheme } from "../../../themes/ocean-blue.theme.js";
import { ramadanGreenTheme } from "../../../themes/ramadan-green.theme.js";
import { royalPurpleTheme } from "../../../themes/royal-purple.theme.js";

// Save original values
const originalColorSupported = pc.isColorSupported;
const originalColorTerm = process.env.COLORTERM;

afterEach(() => {
	// Restore
	Object.defineProperty(pc, "isColorSupported", { value: originalColorSupported, writable: true });
	if (originalColorTerm === undefined) {
		process.env.COLORTERM = undefined as unknown as string;
	} else {
		process.env.COLORTERM = originalColorTerm;
	}
});

describe.each([
	{ name: "classic-gold", theme: classicGoldTheme, rgb: "255;193;37" },
	{ name: "high-contrast", theme: highContrastTheme, rgb: "0;255;255" },
	{ name: "ocean-blue", theme: oceanBlueTheme, rgb: "100;180;255" },
	{ name: "ramadan-green", theme: ramadanGreenTheme, rgb: "128;240;151" },
	{ name: "royal-purple", theme: royalPurpleTheme, rgb: "180;120;255" },
])("$name theme cli.primary", ({ theme, rgb }) => {
	it("returns plain text when color is not supported", () => {
		Object.defineProperty(pc, "isColorSupported", { value: false, writable: true });
		const result = theme.cli.primary("hello");
		expect(result).toBe("hello");
	});

	it("returns fallback color when truecolor not supported", () => {
		Object.defineProperty(pc, "isColorSupported", { value: true, writable: true });
		process.env.COLORTERM = "";
		const result = theme.cli.primary("hello");
		expect(result).toContain("hello");
		expect(result).not.toContain("38;2;"); // No RGB code
	});

	it("returns RGB ANSI when truecolor is supported", () => {
		Object.defineProperty(pc, "isColorSupported", { value: true, writable: true });
		process.env.COLORTERM = "truecolor";
		const result = theme.cli.primary("hello");
		expect(result).toContain(`38;2;${rgb}`);
		expect(result).toContain("hello");
	});

	it("returns RGB ANSI when 24bit is supported", () => {
		Object.defineProperty(pc, "isColorSupported", { value: true, writable: true });
		process.env.COLORTERM = "24bit";
		const result = theme.cli.primary("hello");
		expect(result).toContain(`38;2;${rgb}`);
		expect(result).toContain("hello");
	});
});
