/**
 * @module themes/classic-gold
 * @description Warm amber/gold theme inspired by Islamic architecture.
 */

import pc from "picocolors";
import type { ITheme } from "./theme.interface.js";

const ANSI_RESET = "\u001B[0m";
const GOLD_RGB = "38;2;255;193;37";

const supportsTrueColor = (): boolean => {
	const colorTerm = process.env.COLORTERM?.toLowerCase() ?? "";
	return colorTerm.includes("truecolor") || colorTerm.includes("24bit");
};

const primary = (text: string): string => {
	if (!pc.isColorSupported) return text;
	if (!supportsTrueColor()) return pc.yellow(text);
	return `\u001B[${GOLD_RGB}m${text}${ANSI_RESET}`;
};

export const classicGoldTheme: ITheme = {
	id: "classic-gold",
	name: "Classic Gold",
	cli: {
		primary,
		secondary: (text: string) => pc.cyan(text),
		error: (text: string) => pc.red(text),
		muted: (text: string) => pc.dim(text),
	},
	tui: {
		primary: "#FFC125",
		secondary: "#80D4E0",
		error: "#F08080",
		muted: "#888888",
		white: "#FFFFFF",
		background: "#1A1A2E",
	},
	banner: primary,
};
