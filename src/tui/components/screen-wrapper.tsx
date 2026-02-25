/**
 * @module tui/components/screen-wrapper
 * @description Reusable bordered layout with title and back-navigation for sub-screens.
 */

import { Box, Text, useApp, useInput } from "ink";
import type React from "react";
import { useThemeColors } from "../context/theme-context.js";

interface ScreenWrapperProps {
	readonly title: string;
	readonly onBack: () => void;
	readonly isActive: boolean;
	readonly children: React.ReactNode;
	readonly footer?: string;
}

/**
 * Wraps a sub-screen in a bordered layout with title, Escape to go back, and q to quit.
 */
export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
	title,
	onBack,
	isActive,
	children,
	footer,
}) => {
	const colors = useThemeColors();
	const { exit } = useApp();

	useInput(
		(input, key) => {
			if (key.escape) {
				onBack();
			} else if (input === "q" || input === "Q") {
				exit();
			}
		},
		{ isActive },
	);

	return (
		<Box flexDirection="column">
			<Box
				flexDirection="column"
				borderStyle="round"
				borderColor={colors.primary}
				paddingX={1}
			>
				<Text color={colors.primary} bold>
					{title}
				</Text>
			</Box>

			<Box flexDirection="column" paddingX={1} paddingY={1}>
				{children}
			</Box>

			<Box paddingX={1}>
				<Text color={colors.muted}>{footer ?? "Esc Back  q Quit"}</Text>
			</Box>
		</Box>
	);
};
