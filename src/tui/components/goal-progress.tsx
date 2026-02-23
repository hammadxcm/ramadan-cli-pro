/**
 * @module tui/components/goal-progress
 * @description Displays Ramadan goals progress in the TUI dashboard.
 */

import { Box, Text } from "ink";
import type React from "react";
import type { Goal } from "../../types/goals.js";
import { useThemeColors } from "../context/theme-context.js";

interface GoalProgressProps {
	readonly goals: ReadonlyArray<Goal>;
}

export const GoalProgress: React.FC<GoalProgressProps> = ({ goals }) => {
	const colors = useThemeColors();

	if (goals.length === 0) return null;

	return (
		<Box flexDirection="column" paddingX={1}>
			<Text color={colors.primary} bold>
				Ramadan Goals
			</Text>
			{goals.map((goal) => {
				const percent =
					goal.target > 0 ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : 0;
				const barWidth = 15;
				const filled = Math.round((percent / 100) * barWidth);
				const empty = barWidth - filled;
				return (
					<Box key={goal.id}>
						<Box width={18}>
							<Text color={colors.muted}>{goal.title}</Text>
						</Box>
						<Text color={colors.primary}>{"\u2588".repeat(filled)}</Text>
						<Text color={colors.muted}>{"\u2591".repeat(empty)}</Text>
						<Text color={colors.white}> {percent}%</Text>
					</Box>
				);
			})}
		</Box>
	);
};
