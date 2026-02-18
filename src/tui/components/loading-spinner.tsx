import { Text } from "ink";
import type React from "react";
import { colors } from "../theme/colors.js";

interface LoadingSpinnerProps {
	readonly message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Loading..." }) => (
	<Text color={colors.primary}>
		{"\u{1F319}"} {message}
	</Text>
);
