/**
 * @module tui/context/theme-context
 * @description React context for TUI theme colors.
 */

import { createContext, useContext } from "react";
import type { TuiColors } from "../../themes/theme.interface.js";

const defaultColors: TuiColors = {
	primary: "#80F097",
	secondary: "#F0E080",
	error: "#F08080",
	muted: "#888888",
	white: "#FFFFFF",
	background: "#1A1A2E",
};

const ThemeContext = createContext<TuiColors>(defaultColors);

export const ThemeProvider = ThemeContext.Provider;
export const useThemeColors = (): TuiColors => useContext(ThemeContext);
