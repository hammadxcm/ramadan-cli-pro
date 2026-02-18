import { Box, Text } from "ink";
import type React from "react";
import type { HighlightState } from "../../types/ramadan.js";
import { colors } from "../theme/colors.js";

interface CountdownTimerProps {
	readonly highlight: HighlightState | null;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ highlight }) => {
	if (!highlight) {
		return (
			<Box paddingX={1}>
				<Text color={colors.muted}>No active countdown</Text>
			</Box>
		);
	}

	return (
		<Box flexDirection="column" paddingX={1}>
			<Text>
				<Text color={colors.primary} bold>
					Status:{" "}
				</Text>
				<Text color={colors.white}>{highlight.current}</Text>
			</Text>
			<Text>
				<Text color={colors.primary} bold>
					Up next:{" "}
				</Text>
				<Text color={colors.white}>{highlight.next}</Text>
				<Text color={colors.secondary}> in {highlight.countdown}</Text>
			</Text>
		</Box>
	);
};
