import { Text } from "ink";
import type React from "react";
import { useThemeColors } from "../context/theme-context.js";

interface StatusBadgeProps {
	readonly status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
	const colors = useThemeColors();

	const statusColorMap: Record<string, string> = {
		"Sehar window open": colors.secondary,
		"Roza in progress": colors.primary,
		"Iftar time": colors.secondary,
		"Before roza day": colors.muted,
	};

	const color = statusColorMap[status] ?? colors.white;
	return (
		<Text color={color} bold>
			[{status}]
		</Text>
	);
};
