/**
 * @module tui/screens/dua-screen
 * @description Browseable dua screen with Left/Right navigation.
 */

import { Box, Text, useInput } from "ink";
import type React from "react";
import { useState } from "react";
import { RAMADAN_DUAS } from "../../data/duas.js";
import { ScreenWrapper } from "../components/screen-wrapper.js";
import { useThemeColors } from "../context/theme-context.js";

interface DuaScreenProps {
	readonly onBack: () => void;
	readonly isActive: boolean;
}

export const DuaScreen: React.FC<DuaScreenProps> = ({ onBack, isActive }) => {
	const colors = useThemeColors();
	const allDuas = RAMADAN_DUAS;
	const [index, setIndex] = useState(0);

	useInput(
		(_input, key) => {
			if (key.rightArrow) {
				setIndex((prev) => (prev >= allDuas.length - 1 ? 0 : prev + 1));
			} else if (key.leftArrow) {
				setIndex((prev) => (prev <= 0 ? allDuas.length - 1 : prev - 1));
			}
		},
		{ isActive },
	);

	const dua = allDuas[index];
	if (!dua) return null;

	return (
		<ScreenWrapper
			title="Dua of the Day"
			onBack={onBack}
			isActive={isActive}
			footer="Left/Right Browse  Esc Back  q Quit"
		>
			<Box flexDirection="column">
				<Text color={colors.muted}>
					Day {dua.day} of {allDuas.length}
				</Text>
				<Text> </Text>
				<Text color={colors.white}>{dua.arabic}</Text>
				<Text> </Text>
				<Text color={colors.secondary} italic>
					{dua.transliteration}
				</Text>
				<Text> </Text>
				<Text color={colors.muted}>{dua.translation}</Text>
			</Box>
		</ScreenWrapper>
	);
};
