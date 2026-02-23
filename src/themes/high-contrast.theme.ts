/**
 * @module themes/high-contrast
 * @description Accessibility-focused high-contrast theme with maximum readability.
 */

import pc from "picocolors";
import type { ITheme } from "./theme.interface.js";

const ANSI_RESET = "\u001B[0m";
const BRIGHT_CYAN_RGB = "38;2;0;255;255";

const supportsTrueColor = (): boolean => {
	const colorTerm = process.env.COLORTERM?.toLowerCase() ?? "";
	return colorTerm.includes("truecolor") || colorTerm.includes("24bit");
};

const primary = (text: string): string => {
	if (!pc.isColorSupported) return text;
	if (!supportsTrueColor()) return pc.cyan(text);
	return `\u001B[${BRIGHT_CYAN_RGB}m${text}${ANSI_RESET}`;
};

export const highContrastTheme: ITheme = {
	id: "high-contrast",
	name: "High Contrast",
	cli: {
		primary,
		secondary: (text: string) => pc.bold(pc.yellow(text)),
		error: (text: string) => pc.bold(pc.red(text)),
		muted: (text: string) => pc.white(text),
	},
	tui: {
		primary: "#00FFFF",
		secondary: "#FFFF00",
		error: "#FF0000",
		muted: "#FFFFFF",
		white: "#FFFFFF",
		background: "#000000",
	},
	banner: primary,
};
