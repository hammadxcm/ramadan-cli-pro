/**
 * @module ui/theme
 * @description Shared visual theme constants — emoji and brand color function.
 */

import pc from "picocolors";

/**
 * Crescent moon emoji used as the app's visual identifier.
 * @readonly
 */
export const MOON_EMOJI = "\u{1F319}";

const RAMADAN_GREEN_RGB = "38;2;128;240;151";
const ANSI_RESET = "\u001B[0m";

const supportsTrueColor = (): boolean => {
	const colorTerm = process.env.COLORTERM?.toLowerCase() ?? "";
	return colorTerm.includes("truecolor") || colorTerm.includes("24bit");
};

/**
 * Applies the Ramadan brand green color to a string.
 * Uses 24-bit true color when supported, falls back to basic ANSI green,
 * and returns the string unmodified if color is not supported.
 *
 * @param value - The string to colorize.
 * @returns The colorized string.
 */
export const ramadanGreen = (value: string): string => {
	if (!pc.isColorSupported) {
		return value;
	}

	if (!supportsTrueColor()) {
		return pc.green(value);
	}

	return `\u001B[${RAMADAN_GREEN_RGB}m${value}${ANSI_RESET}`;
};
