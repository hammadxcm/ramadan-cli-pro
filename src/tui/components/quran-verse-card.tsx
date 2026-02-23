/**
 * @module tui/components/quran-verse-card
 * @description Displays the Quran verse of the day in the TUI dashboard.
 */

import { Box, Text } from "ink";
import type React from "react";
import { QURAN_VERSES } from "../../data/quran-verses.js";
import { useThemeColors } from "../context/theme-context.js";

interface QuranVerseCardProps {
	readonly dayNumber: number;
}

export const QuranVerseCard: React.FC<QuranVerseCardProps> = ({ dayNumber }) => {
	const colors = useThemeColors();
	const verse = QURAN_VERSES.find((v) => v.day === dayNumber);

	if (!verse) return null;

	return (
		<Box flexDirection="column" paddingX={1}>
			<Text color={colors.primary} bold>
				Quran Verse of the Day
			</Text>
			<Text color={colors.white}>{verse.arabic}</Text>
			<Text color={colors.secondary} italic>
				{verse.transliteration}
			</Text>
			<Text color={colors.muted}>{verse.translation}</Text>
			<Text color={colors.muted}>
				Surah {verse.surah}, Ayah {verse.ayah}
			</Text>
		</Box>
	);
};
