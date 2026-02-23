/**
 * @module themes/minimal-mono
 * @description Grayscale/monochrome theme for minimal distraction.
 */

import pc from "picocolors";
import type { ITheme } from "./theme.interface.js";

export const minimalMonoTheme: ITheme = {
	id: "minimal-mono",
	name: "Minimal Mono",
	cli: {
		primary: (text: string) => pc.white(text),
		secondary: (text: string) => pc.dim(text),
		error: (text: string) => pc.red(text),
		muted: (text: string) => pc.dim(text),
	},
	tui: {
		primary: "#CCCCCC",
		secondary: "#999999",
		error: "#F08080",
		muted: "#666666",
		white: "#FFFFFF",
		background: "#111111",
	},
	banner: (text: string) => pc.white(text),
};
