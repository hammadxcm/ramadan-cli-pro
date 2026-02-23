/**
 * @module themes/ocean-blue
 * @description Cool blue palette inspired by calm ocean hues.
 */

import pc from "picocolors";
import type { ITheme } from "./theme.interface.js";

const ANSI_RESET = "\u001B[0m";
const BLUE_RGB = "38;2;100;180;255";

const supportsTrueColor = (): boolean => {
	const colorTerm = process.env.COLORTERM?.toLowerCase() ?? "";
	return colorTerm.includes("truecolor") || colorTerm.includes("24bit");
};

const primary = (text: string): string => {
	if (!pc.isColorSupported) return text;
	if (!supportsTrueColor()) return pc.blue(text);
	return `\u001B[${BLUE_RGB}m${text}${ANSI_RESET}`;
};

export const oceanBlueTheme: ITheme = {
	id: "ocean-blue",
	name: "Ocean Blue",
	cli: {
		primary,
		secondary: (text: string) => pc.cyan(text),
		error: (text: string) => pc.red(text),
		muted: (text: string) => pc.dim(text),
	},
	tui: {
		primary: "#64B4FF",
		secondary: "#80E0D0",
		error: "#F08080",
		muted: "#888888",
		white: "#FFFFFF",
		background: "#0D1B2A",
	},
	banner: primary,
};
