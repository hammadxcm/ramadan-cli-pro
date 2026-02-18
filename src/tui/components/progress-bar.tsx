import { Box, Text } from "ink";
import type React from "react";
import { colors } from "../theme/colors.js";

interface ProgressBarProps {
	readonly percent: number;
	readonly width?: number;
	readonly label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percent, width = 30, label }) => {
	const clamped = Math.max(0, Math.min(100, percent));
	const filled = Math.round((clamped / 100) * width);
	const empty = width - filled;

	return (
		<Box paddingX={1}>
			{label && <Text color={colors.muted}>{label} </Text>}
			<Text color={colors.primary}>{"\u2588".repeat(filled)}</Text>
			<Text color={colors.muted}>{"\u2591".repeat(empty)}</Text>
			<Text color={colors.white}> {clamped.toFixed(0)}%</Text>
		</Box>
	);
};
