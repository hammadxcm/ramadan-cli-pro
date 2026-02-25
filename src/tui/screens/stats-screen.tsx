/**
 * @module tui/screens/stats-screen
 * @description Statistics and badges screen.
 */

import { Box, Text } from "ink";
import type React from "react";
import { useMemo } from "react";
import { BADGES } from "../../data/badges.js";
import { useContainer } from "../context/container-context.js";
import { useThemeColors } from "../context/theme-context.js";
import { ScreenWrapper } from "../components/screen-wrapper.js";
import { ProgressBar } from "../components/progress-bar.js";

interface StatsScreenProps {
	readonly onBack: () => void;
	readonly isActive: boolean;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({ onBack, isActive }) => {
	const colors = useThemeColors();
	const container = useContainer();

	const stats = useMemo(() => {
		return container.statsService.getOverallSummary({});
	}, [container.statsService]);

	const earnedBadges = useMemo(
		() => container.badgeService.checkEarned({}),
		[container.badgeService],
	);

	return (
		<ScreenWrapper title="Statistics & Badges" onBack={onBack} isActive={isActive}>
			<Box flexDirection="column">
				<Text color={colors.primary} bold>
					Statistics
				</Text>
				<Text color={colors.white}>Total days fasted: {stats.totalDaysFasted}</Text>
				<Text color={colors.white}>Current streak: {stats.currentFastingStreak}</Text>
				<Text color={colors.white}>Longest streak: {stats.longestFastingStreak}</Text>
				<Text color={colors.white}>
					Goals completed: {stats.goalsCompleted}/{stats.goalsTotal}
				</Text>
				<ProgressBar
					percent={Math.round((stats.totalDaysFasted / 30) * 100)}
					label="Ramadan progress"
				/>
				<Text> </Text>
				<Text color={colors.primary} bold>
					Badges
				</Text>
				{BADGES.map((badge) => {
					const earned = earnedBadges.some((b) => b.id === badge.id);
					return (
						<Text key={badge.id} color={earned ? colors.secondary : colors.muted}>
							{earned ? `${badge.icon} ` : "[ ] "}
							{badge.title} — {badge.description}
						</Text>
					);
				})}
			</Box>
		</ScreenWrapper>
	);
};
