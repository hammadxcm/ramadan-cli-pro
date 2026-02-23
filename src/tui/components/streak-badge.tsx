/**
 * @module tui/components/streak-badge
 * @description Displays the current fasting streak in the TUI dashboard.
 */

import { Box, Text } from "ink";
import type React from "react";
import { useThemeColors } from "../context/theme-context.js";

interface StreakBadgeProps {
	readonly currentStreak: number;
	readonly longestStreak: number;
	readonly totalDaysFasted: number;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({
	currentStreak,
	longestStreak,
	totalDaysFasted,
}) => {
	const colors = useThemeColors();

	return (
		<Box flexDirection="column" paddingX={1}>
			<Text color={colors.primary} bold>
				Fasting Streak
			</Text>
			<Text color={colors.white}>
				Current: {currentStreak} days{currentStreak >= 7 ? " [FIRE]" : ""}
			</Text>
			<Text color={colors.muted}>
				Longest: {longestStreak} days | Total: {totalDaysFasted} days
			</Text>
		</Box>
	);
};
