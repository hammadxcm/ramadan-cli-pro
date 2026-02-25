/**
 * @module tui/screens/charity-screen
 * @description Charity log screen showing donation entries and total.
 */

import { Box, Text } from "ink";
import type React from "react";
import { useMemo } from "react";
import { ScreenWrapper } from "../components/screen-wrapper.js";
import { useContainer } from "../context/container-context.js";
import { useThemeColors } from "../context/theme-context.js";

interface CharityScreenProps {
	readonly onBack: () => void;
	readonly isActive: boolean;
}

export const CharityScreen: React.FC<CharityScreenProps> = ({ onBack, isActive }) => {
	const colors = useThemeColors();
	const container = useContainer();

	const entries = useMemo(() => container.charityService.listEntries(), [container.charityService]);

	const total = useMemo(() => entries.reduce((sum, e) => sum + e.amount, 0), [entries]);

	return (
		<ScreenWrapper title="Charity Log" onBack={onBack} isActive={isActive}>
			<Box flexDirection="column">
				{entries.length === 0 ? (
					<Box flexDirection="column">
						<Text color={colors.muted}>No charity entries recorded.</Text>
						<Text color={colors.muted}>
							Use `ramadan-cli-pro charity add --amount AMOUNT` to log donations.
						</Text>
					</Box>
				) : (
					<Box flexDirection="column">
						{entries.map((entry, i) => (
							<Box key={`${entry.id}-${i}`}>
								<Box width={12}>
									<Text color={colors.muted}>{entry.date}</Text>
								</Box>
								<Box width={12}>
									<Text color={colors.white}>${entry.amount.toFixed(2)}</Text>
								</Box>
								<Box width={12}>
									<Text color={colors.secondary}>{entry.category}</Text>
								</Box>
								<Text color={colors.muted}>{entry.description}</Text>
							</Box>
						))}
						<Text> </Text>
						<Text color={colors.primary} bold>
							Total: ${total.toFixed(2)}
						</Text>
					</Box>
				)}
			</Box>
		</ScreenWrapper>
	);
};
