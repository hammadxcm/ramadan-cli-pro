/**
 * @module tui/app
 * @description Root React/Ink application component for the TUI dashboard.
 * Wires up the dependency container, fetches prayer data, and provides
 * context to all child components.
 */

import { useApp, useInput } from "ink";
import type React from "react";
import { createContainer } from "../container.js";
import type { CommandContext } from "../types/command.js";
import { Dashboard } from "./components/dashboard.js";
import { PrayerProvider } from "./context/prayer-context.js";
import { ThemeProvider } from "./context/theme-context.js";
import { useHighlight } from "./hooks/use-highlight.js";
import { usePrayerTimes } from "./hooks/use-prayer-times.js";

/**
 * Props for the root {@link App} component.
 */
interface AppProps {
	/** Optional CLI context (e.g. city override). */
	readonly context?: CommandContext;
}

/**
 * Root TUI application component. Fetches prayer data, computes highlight state,
 * and renders the dashboard. Press `q` to quit.
 */
export const App: React.FC<AppProps> = ({ context }) => {
	const { exit } = useApp();
	const container = createContainer();

	const { data, loading, error } = usePrayerTimes(async () => {
		const query = await container.locationService.resolveQuery({
			...(context?.city ? { city: context.city } : {}),
			allowInteractiveSetup: false,
		});
		return container.prayerTimeService.fetchDay(query);
	});

	const highlight = useHighlight(data);

	useInput((input) => {
		if (input === "q") {
			exit();
		}
	});

	return (
		<ThemeProvider value={container.themeService.getActiveTheme().tui}>
			<PrayerProvider value={{ data, highlight, loading, error }}>
				<Dashboard />
			</PrayerProvider>
		</ThemeProvider>
	);
};
