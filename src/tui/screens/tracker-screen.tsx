/**
 * @module tui/screens/tracker-screen
 * @description Prayer & fasting tracker screen with Space to toggle fasting.
 */

import { Box, Text, useInput } from "ink";
import type React from "react";
import { useCallback, useState } from "react";
import { useContainer } from "../context/container-context.js";
import { usePrayerContext } from "../context/prayer-context.js";
import { useThemeColors } from "../context/theme-context.js";
import { ScreenWrapper } from "../components/screen-wrapper.js";

interface TrackerScreenProps {
	readonly onBack: () => void;
	readonly isActive: boolean;
}

export const TrackerScreen: React.FC<TrackerScreenProps> = ({ onBack, isActive }) => {
	const colors = useThemeColors();
	const container = useContainer();
	const { streakData } = usePrayerContext();

	const today = new Date().toISOString().slice(0, 10);
	const [fastedToday, setFastedToday] = useState(() => {
		// Check if today is marked by looking at current streak data
		const data = container.streakService.getStreakData();
		return data.lastFastedDate === today;
	});

	const toggleFasting = useCallback(() => {
		if (fastedToday) {
			container.streakService.unmarkDay(today);
			setFastedToday(false);
		} else {
			container.streakService.markDay(today);
			setFastedToday(true);
		}
	}, [fastedToday, container.streakService, today]);

	useInput(
		(input) => {
			if (input === " ") {
				toggleFasting();
			}
		},
		{ isActive },
	);

	return (
		<ScreenWrapper
			title="Prayer & Fasting Tracker"
			onBack={onBack}
			isActive={isActive}
			footer="Space Toggle Fasting  Esc Back  q Quit"
		>
			<Box flexDirection="column">
				<Text color={colors.white} bold>
					Today ({today}): {fastedToday ? "Fasted" : "Not Fasted"}{" "}
					{fastedToday ? "[CHECK]" : "[ ]"}
				</Text>
				<Text> </Text>
				{streakData && (
					<Box flexDirection="column">
						<Text color={colors.primary} bold>
							Fasting Streak
						</Text>
						<Text color={colors.white}>
							Current: {streakData.currentStreak} days
							{streakData.currentStreak >= 7 ? " [FIRE]" : ""}
						</Text>
						<Text color={colors.muted}>
							Longest: {streakData.longestStreak} days
						</Text>
						<Text color={colors.muted}>
							Total fasted: {streakData.totalDaysFasted} days
						</Text>
					</Box>
				)}
			</Box>
		</ScreenWrapper>
	);
};
