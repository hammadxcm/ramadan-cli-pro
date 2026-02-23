/**
 * @module themes/ramadan-green
 * @description Default Ramadan green theme — the original brand color (#80F097).
 */

import pc from "picocolors";
import type { ITheme } from "./theme.interface.js";

const ANSI_RESET = "\u001B[0m";
const GREEN_RGB = "38;2;128;240;151";

const supportsTrueColor = (): boolean => {
	const colorTerm = process.env.COLORTERM?.toLowerCase() ?? "";
	return colorTerm.includes("truecolor") || colorTerm.includes("24bit");
};

const primary = (text: string): string => {
	if (!pc.isColorSupported) return text;
	if (!supportsTrueColor()) return pc.green(text);
	return `\u001B[${GREEN_RGB}m${text}${ANSI_RESET}`;
};

export const ramadanGreenTheme: ITheme = {
	id: "ramadan-green",
	name: "Ramadan Green",
	cli: {
		primary,
		secondary: (text: string) => pc.yellow(text),
		error: (text: string) => pc.red(text),
		muted: (text: string) => pc.dim(text),
	},
	tui: {
		primary: "#80F097",
		secondary: "#F0E080",
		error: "#F08080",
		muted: "#888888",
		white: "#FFFFFF",
		background: "#1A1A2E",
	},
	banner: primary,
};
