/**
 * @module tui/screens/quran-screen
 * @description Browseable Quran verse screen with Left/Right navigation.
 */

import { Box, Text, useInput } from "ink";
import type React from "react";
import { useState } from "react";
import { QURAN_VERSES } from "../../data/quran-verses.js";
import { useThemeColors } from "../context/theme-context.js";
import { ScreenWrapper } from "../components/screen-wrapper.js";

interface QuranScreenProps {
	readonly onBack: () => void;
	readonly isActive: boolean;
}

export const QuranScreen: React.FC<QuranScreenProps> = ({ onBack, isActive }) => {
	const colors = useThemeColors();
	const allVerses = QURAN_VERSES;
	const [index, setIndex] = useState(0);

	useInput(
		(_input, key) => {
			if (key.rightArrow) {
				setIndex((prev) => (prev >= allVerses.length - 1 ? 0 : prev + 1));
			} else if (key.leftArrow) {
				setIndex((prev) => (prev <= 0 ? allVerses.length - 1 : prev - 1));
			}
		},
		{ isActive },
	);

	const verse = allVerses[index];
	if (!verse) return null;

	return (
		<ScreenWrapper
			title="Quran Verse"
			onBack={onBack}
			isActive={isActive}
			footer="Left/Right Browse  Esc Back  q Quit"
		>
			<Box flexDirection="column">
				<Text color={colors.muted}>
					Day {verse.day} of {allVerses.length}
				</Text>
				<Text> </Text>
				<Text color={colors.white}>{verse.arabic}</Text>
				<Text> </Text>
				<Text color={colors.secondary} italic>
					{verse.transliteration}
				</Text>
				<Text> </Text>
				<Text color={colors.muted}>{verse.translation}</Text>
				<Text color={colors.muted}>
					— Surah {verse.surah}, Ayah {verse.ayah}
				</Text>
			</Box>
		</ScreenWrapper>
	);
};
