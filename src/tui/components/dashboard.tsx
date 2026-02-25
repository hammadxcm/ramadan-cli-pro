/**
 * @module tui/components/dashboard
 * @description Root dashboard component that composes header, prayer table,
 * countdown, and footer based on the prayer context state.
 */

import { Box } from "ink";
import type React from "react";
import { usePrayerContext } from "../context/prayer-context.js";
import { CountdownTimer } from "./countdown-timer.js";
import { DuaCard } from "./dua-card.js";
import { ErrorDisplay } from "./error-display.js";
import { Footer } from "./footer.js";
import { GoalProgress } from "./goal-progress.js";
import { Header } from "./header.js";
import { LoadingSpinner } from "./loading-spinner.js";
import { PrayerTimesTable } from "./prayer-times-table.js";
import { ProgressBar } from "./progress-bar.js";
import { QuranVerseCard } from "./quran-verse-card.js";
import { StreakBadge } from "./streak-badge.js";

/**
 * Main dashboard layout component. Shows a loading spinner, error display,
 * or the full prayer-times dashboard depending on context state.
 */
export const Dashboard: React.FC = () => {
	const { data, highlight, loading, error, streakData, goals } = usePrayerContext();

	if (loading) {
		return <LoadingSpinner message="Fetching prayer times..." />;
	}

	if (error) {
		return <ErrorDisplay message={error} />;
	}

	const location = data ? `${data.meta.timezone}` : undefined;
	const hijriDate = data
		? `${data.date.hijri.day} ${data.date.hijri.month.en} ${data.date.hijri.year}`
		: undefined;

	const isRamadan = data?.date.hijri.month.number === 9;
	const ramadanDay = isRamadan ? Number.parseInt(data.date.hijri.day, 10) : 0;
	const ramadanProgress = isRamadan ? Math.round((ramadanDay / 30) * 100) : 0;

	return (
		<Box flexDirection="column">
			<Header location={location} hijriDate={hijriDate} />
			<PrayerTimesTable timings={data?.timings ?? null} />
			<CountdownTimer highlight={highlight} />
			{isRamadan && (
				<ProgressBar percent={ramadanProgress} label={`Ramadan Day ${ramadanDay}/30`} />
			)}
			{streakData && streakData.totalDaysFasted > 0 && (
				<StreakBadge
					currentStreak={streakData.currentStreak}
					longestStreak={streakData.longestStreak}
					totalDaysFasted={streakData.totalDaysFasted}
				/>
			)}
			{goals && goals.length > 0 && <GoalProgress goals={goals} />}
			{isRamadan && <DuaCard dayNumber={ramadanDay} />}
			{isRamadan && <QuranVerseCard dayNumber={ramadanDay} />}
			<Footer />
		</Box>
	);
};
