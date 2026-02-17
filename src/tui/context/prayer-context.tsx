/**
 * @module tui/context/prayer-context
 * @description React context for sharing prayer data, highlight state,
 * loading status, and errors across TUI components.
 */

import React, { createContext, useContext } from "react";
import type { PrayerData } from "../../types/prayer.js";
import type { HighlightState } from "../../types/ramadan.js";

interface PrayerContextValue {
	readonly data: PrayerData | null;
	readonly highlight: HighlightState | null;
	readonly loading: boolean;
	readonly error: string | null;
}

const PrayerContext = createContext<PrayerContextValue>({
	data: null,
	highlight: null,
	loading: true,
	error: null,
});

/** Provider component for the prayer data context. */
export const PrayerProvider = PrayerContext.Provider;

/**
 * Hook to consume prayer data context.
 *
 * @returns The current prayer context value.
 */
export const usePrayerContext = (): PrayerContextValue => useContext(PrayerContext);
