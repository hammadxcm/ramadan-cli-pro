/**
 * @module tui/app
 * @description Root React/Ink application component for the TUI dashboard.
 * Wires up the dependency container, fetches prayer data, and provides
 * context to all child components. Renders the interactive screen router.
 */

import type React from "react";
import { useCallback, useMemo, useState } from "react";
import { createContainer } from "../container.js";
import type { CommandContext } from "../types/command.js";
import type { Goal } from "../types/goals.js";
import type { StreakData } from "../types/streak.js";
import { ScreenRouter } from "./components/screen-router.js";
import { ContainerProvider } from "./context/container-context.js";
import { PrayerProvider } from "./context/prayer-context.js";
import { ThemeProvider, ThemeRefreshProvider } from "./context/theme-context.js";
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
 * and renders the interactive screen router with navigation.
 */
export const App: React.FC<AppProps> = ({ context }) => {
	const container = useMemo(() => createContainer(), []);

	const { data, loading, error } = usePrayerTimes(async () => {
		const query = await container.locationService.resolveQuery({
			...(context?.city ? { city: context.city } : {}),
			allowInteractiveSetup: false,
		});
		return container.prayerTimeService.fetchDay(query);
	});

	const highlight = useHighlight(data);

	const streakData: StreakData = useMemo(
		() => container.streakService.getStreakData(),
		[container.streakService],
	);

	const goals: ReadonlyArray<Goal> = useMemo(
		() => container.goalService.listGoals(),
		[container.goalService],
	);

	const [themeColors, setThemeColors] = useState(() =>
		container.themeService.getActiveTheme().tui,
	);

	const refreshTheme = useCallback(() => {
		setThemeColors(container.themeService.getActiveTheme().tui);
	}, [container.themeService]);

	return (
		<ContainerProvider value={container}>
			<ThemeProvider value={themeColors}>
				<ThemeRefreshProvider value={refreshTheme}>
					<PrayerProvider value={{ data, highlight, loading, error, streakData, goals }}>
						<ScreenRouter />
					</PrayerProvider>
				</ThemeRefreshProvider>
			</ThemeProvider>
		</ContainerProvider>
	);
};
