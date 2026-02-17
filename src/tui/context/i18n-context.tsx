/**
 * @module tui/context/i18n-context
 * @description React context for sharing the i18n translation function
 * and current locale across TUI components.
 */

import React, { createContext, useContext } from "react";

interface I18nContextValue {
	readonly t: (key: string, options?: Record<string, unknown>) => string;
	readonly locale: string;
}

const I18nContext = createContext<I18nContextValue>({
	t: (key: string) => key,
	locale: "en",
});

/** Provider component for the i18n context. */
export const I18nProvider = I18nContext.Provider;

/**
 * Hook to consume the i18n context.
 *
 * @returns The current i18n context value (translation function and locale).
 */
export const useI18nContext = (): I18nContextValue => useContext(I18nContext);
