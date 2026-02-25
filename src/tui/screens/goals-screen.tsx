/**
 * @module tui/screens/goals-screen
 * @description Goals screen displaying Ramadan goals with progress bars.
 */

import { Box, Text } from "ink";
import type React from "react";
import { ScreenWrapper } from "../components/screen-wrapper.js";
import { usePrayerContext } from "../context/prayer-context.js";
import { useThemeColors } from "../context/theme-context.js";

interface GoalsScreenProps {
	readonly onBack: () => void;
	readonly isActive: boolean;
}

export const GoalsScreen: React.FC<GoalsScreenProps> = ({ onBack, isActive }) => {
	const colors = useThemeColors();
	const { goals } = usePrayerContext();

	return (
		<ScreenWrapper title="Goals" onBack={onBack} isActive={isActive}>
			<Box flexDirection="column">
				{!goals || goals.length === 0 ? (
					<Text color={colors.muted}>
						No goals set. Use `ramadan-cli-pro goal add` to create goals.
					</Text>
				) : (
					goals.map((goal) => {
						const percent =
							goal.target > 0 ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : 0;
						const barWidth = 20;
						const filled = Math.round((percent / 100) * barWidth);
						const empty = barWidth - filled;
						return (
							<Box key={goal.id} flexDirection="column" marginBottom={1}>
								<Text color={colors.white} bold>
									{goal.title}
								</Text>
								<Box>
									<Text color={colors.primary}>{"\u2588".repeat(filled)}</Text>
									<Text color={colors.muted}>{"\u2591".repeat(empty)}</Text>
									<Text color={colors.white}>
										{" "}
										{percent}% ({goal.current}/{goal.target})
									</Text>
								</Box>
							</Box>
						);
					})
				)}
			</Box>
		</ScreenWrapper>
	);
};
