/**
 * @module themes/royal-purple
 * @description Deep purple accent theme with a regal aesthetic.
 */

import pc from "picocolors";
import type { ITheme } from "./theme.interface.js";

const ANSI_RESET = "\u001B[0m";
const PURPLE_RGB = "38;2;180;120;255";

const supportsTrueColor = (): boolean => {
	const colorTerm = process.env.COLORTERM?.toLowerCase() ?? "";
	return colorTerm.includes("truecolor") || colorTerm.includes("24bit");
};

const primary = (text: string): string => {
	if (!pc.isColorSupported) return text;
	if (!supportsTrueColor()) return pc.magenta(text);
	return `\u001B[${PURPLE_RGB}m${text}${ANSI_RESET}`;
};

export const royalPurpleTheme: ITheme = {
	id: "royal-purple",
	name: "Royal Purple",
	cli: {
		primary,
		secondary: (text: string) => pc.yellow(text),
		error: (text: string) => pc.red(text),
		muted: (text: string) => pc.dim(text),
	},
	tui: {
		primary: "#B478FF",
		secondary: "#F0E080",
		error: "#F08080",
		muted: "#888888",
		white: "#FFFFFF",
		background: "#1A0A2E",
	},
	banner: primary,
};
