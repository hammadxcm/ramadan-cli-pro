/**
 * @module tui/screens/prayer-times-screen
 * @description Full prayer times screen — wraps the existing dashboard content
 * (prayer table, countdown, progress bar, streak badge, goals, dua, quran verse).
 */

import { Box } from "ink";
import type React from "react";
import { usePrayerContext } from "../context/prayer-context.js";
import { CountdownTimer } from "../components/countdown-timer.js";
import { DuaCard } from "../components/dua-card.js";
import { GoalProgress } from "../components/goal-progress.js";
import { PrayerTimesTable } from "../components/prayer-times-table.js";
import { ProgressBar } from "../components/progress-bar.js";
import { QuranVerseCard } from "../components/quran-verse-card.js";
import { ScreenWrapper } from "../components/screen-wrapper.js";
import { StreakBadge } from "../components/streak-badge.js";

interface PrayerTimesScreenProps {
	readonly onBack: () => void;
	readonly isActive: boolean;
}

export const PrayerTimesScreen: React.FC<PrayerTimesScreenProps> = ({ onBack, isActive }) => {
	const { data, highlight, streakData, goals } = usePrayerContext();

	const isRamadan = data?.date.hijri.month.number === 9;
	const ramadanDay = isRamadan ? Number.parseInt(data.date.hijri.day, 10) : 0;
	const ramadanProgress = isRamadan ? Math.round((ramadanDay / 30) * 100) : 0;

	return (
		<ScreenWrapper title="Prayer Times" onBack={onBack} isActive={isActive}>
			<Box flexDirection="column">
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
			</Box>
		</ScreenWrapper>
	);
};
