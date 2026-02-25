/**
 * @module tui/screens/hadith-screen
 * @description Browseable hadith screen with Left/Right navigation.
 */

import { Box, Text, useInput } from "ink";
import type React from "react";
import { useState } from "react";
import { RAMADAN_HADITHS } from "../../data/hadiths.js";
import { useThemeColors } from "../context/theme-context.js";
import { ScreenWrapper } from "../components/screen-wrapper.js";

interface HadithScreenProps {
	readonly onBack: () => void;
	readonly isActive: boolean;
}

export const HadithScreen: React.FC<HadithScreenProps> = ({ onBack, isActive }) => {
	const colors = useThemeColors();
	const allHadiths = RAMADAN_HADITHS;
	const [index, setIndex] = useState(0);

	useInput(
		(_input, key) => {
			if (key.rightArrow) {
				setIndex((prev) => (prev >= allHadiths.length - 1 ? 0 : prev + 1));
			} else if (key.leftArrow) {
				setIndex((prev) => (prev <= 0 ? allHadiths.length - 1 : prev - 1));
			}
		},
		{ isActive },
	);

	const hadith = allHadiths[index];
	if (!hadith) return null;

	return (
		<ScreenWrapper
			title="Hadith of the Day"
			onBack={onBack}
			isActive={isActive}
			footer="Left/Right Browse  Esc Back  q Quit"
		>
			<Box flexDirection="column">
				<Text color={colors.muted}>
					Day {hadith.day} of {allHadiths.length}
				</Text>
				<Text> </Text>
				<Text color={colors.white}>{hadith.arabic}</Text>
				<Text> </Text>
				<Text color={colors.secondary} italic>
					{hadith.transliteration}
				</Text>
				<Text> </Text>
				<Text color={colors.muted}>{hadith.translation}</Text>
				<Text color={colors.muted}>
					— {hadith.source} (Narrator: {hadith.narrator})
				</Text>
			</Box>
		</ScreenWrapper>
	);
};
