/**
 * @module tui/context/theme-context
 * @description React context for TUI theme colors and live theme refresh.
 */

import { createContext, useContext } from "react";
import type { TuiColors } from "../../themes/theme.interface.js";

const defaultColors: TuiColors = {
	primary: "#FFC125",
	secondary: "#80D4E0",
	error: "#F08080",
	muted: "#888888",
	white: "#FFFFFF",
	background: "#1A1A2E",
};

const ThemeContext = createContext<TuiColors>(defaultColors);

export const ThemeProvider = ThemeContext.Provider;
export const useThemeColors = (): TuiColors => useContext(ThemeContext);

const noop = (): void => {};
const ThemeRefreshContext = createContext<() => void>(noop);

export const ThemeRefreshProvider = ThemeRefreshContext.Provider;
export const useThemeRefresh = (): (() => void) => useContext(ThemeRefreshContext);
