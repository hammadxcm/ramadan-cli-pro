/**
 * @module tui/screens/zakat-screen
 * @description Zakat information screen.
 */

import { Box, Text } from "ink";
import type React from "react";
import { ScreenWrapper } from "../components/screen-wrapper.js";
import { useThemeColors } from "../context/theme-context.js";

interface ZakatScreenProps {
	readonly onBack: () => void;
	readonly isActive: boolean;
}

export const ZakatScreen: React.FC<ZakatScreenProps> = ({ onBack, isActive }) => {
	const colors = useThemeColors();

	return (
		<ScreenWrapper title="Zakat Calculator" onBack={onBack} isActive={isActive}>
			<Box flexDirection="column">
				<Text color={colors.primary} bold>
					Zakat Calculation
				</Text>
				<Text> </Text>
				<Text color={colors.white}>Rate: 2.5% of net wealth above nisab</Text>
				<Text> </Text>
				<Text color={colors.muted}>
					Use `ramadan-cli-pro zakat --wealth AMOUNT` to calculate your Zakat.
				</Text>
				<Text color={colors.muted}>Example: ramadan-cli-pro zakat --wealth 50000</Text>
				<Text> </Text>
				<Text color={colors.primary} bold>
					Quick Reference
				</Text>
				<Text color={colors.white}>Gold Nisab: ~87.48g of gold</Text>
				<Text color={colors.white}>Silver Nisab: ~612.36g of silver</Text>
				<Text color={colors.muted}>
					Zakat is due if your net wealth exceeds the nisab threshold for one lunar year.
				</Text>
			</Box>
		</ScreenWrapper>
	);
};
