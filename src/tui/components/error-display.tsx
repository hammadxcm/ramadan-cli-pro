import { Box, Text } from "ink";
import type React from "react";
import { colors } from "../theme/colors.js";

interface ErrorDisplayProps {
	readonly message: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => (
	<Box paddingX={1}>
		<Text color={colors.error} bold>
			Error: {message}
		</Text>
	</Box>
);
