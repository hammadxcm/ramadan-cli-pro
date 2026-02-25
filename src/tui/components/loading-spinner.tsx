import { Text } from "ink";
import type React from "react";
import { useThemeColors } from "../context/theme-context.js";

interface LoadingSpinnerProps {
	readonly message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Loading..." }) => {
	const colors = useThemeColors();
	return (
		<Text color={colors.primary}>
			{"\u{1F319}"} {message}
		</Text>
	);
};
