/**
 * @module tui/components/dua-card
 * @description Displays the dua of the day in the TUI dashboard.
 */

import { Box, Text } from "ink";
import type React from "react";
import { RAMADAN_DUAS } from "../../data/duas.js";
import { useThemeColors } from "../context/theme-context.js";

interface DuaCardProps {
	readonly dayNumber: number;
}

export const DuaCard: React.FC<DuaCardProps> = ({ dayNumber }) => {
	const colors = useThemeColors();
	const dua = RAMADAN_DUAS.find((d) => d.day === dayNumber);

	if (!dua) return null;

	return (
		<Box flexDirection="column" paddingX={1}>
			<Text color={colors.primary} bold>
				Dua of the Day
			</Text>
			<Text color={colors.white}>{dua.arabic}</Text>
			<Text color={colors.secondary} italic>
				{dua.transliteration}
			</Text>
			<Text color={colors.muted}>{dua.translation}</Text>
		</Box>
	);
};
