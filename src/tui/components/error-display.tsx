import { Box, Text } from "ink";
import type React from "react";
import { useThemeColors } from "../context/theme-context.js";

interface ErrorDisplayProps {
	readonly message: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
	const colors = useThemeColors();
	return (
		<Box paddingX={1}>
			<Text color={colors.error} bold>
				Error: {message}
			</Text>
		</Box>
	);
};
