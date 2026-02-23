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

/**
 * Checks whether the NO_COLOR environment variable is set.
 * Per the https://no-color.org/ specification, any value (including an empty
 * string) means colors should be disabled.
 *
 * @returns `true` when `NO_COLOR` is present in the environment.
 */
export const isNoColor = (): boolean => {
	return "NO_COLOR" in process.env;
};

const supportsTrueColor = (): boolean => {
	const colorTerm = process.env.COLORTERM?.toLowerCase() ?? "";
	return colorTerm.includes("truecolor") || colorTerm.includes("24bit");
};

/**
 * Default Ramadan brand green color function.
 * Uses 24-bit true color when supported, falls back to basic ANSI green.
 * Returns plain text when NO_COLOR is set or colors are not supported.
 */
const defaultPrimary = (value: string): string => {
	if (isNoColor() || !pc.isColorSupported) {
		return value;
	}

	if (!supportsTrueColor()) {
		return pc.green(value);
	}

	return `\u001B[${RAMADAN_GREEN_RGB}m${value}${ANSI_RESET}`;
};

/** Active primary color function, swappable by the theme system. */
let activePrimary: (text: string) => string = defaultPrimary;

/**
 * Sets the active primary color function from the theme system.
 *
 * @param fn - The color function from the active theme's `cli.primary`.
 */
export const setActivePrimary = (fn: (text: string) => string): void => {
	activePrimary = fn;
};

/**
 * Applies the active theme's primary color to a string.
 * Delegates to the theme system's primary color function when set,
 * otherwise uses the default Ramadan green.
 *
 * @param value - The string to colorize.
 * @returns The colorized string.
 */
export const ramadanGreen = (value: string): string => activePrimary(value);
