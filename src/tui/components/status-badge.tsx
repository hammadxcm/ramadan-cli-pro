import { Text } from "ink";
import type React from "react";
import { colors } from "../theme/colors.js";

interface StatusBadgeProps {
	readonly status: string;
}

const statusColorMap: Record<string, string> = {
	"Sehar window open": colors.secondary,
	"Roza in progress": colors.primary,
	"Iftar time": colors.secondary,
	"Before roza day": colors.muted,
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
	const color = statusColorMap[status] ?? colors.white;
	return (
		<Text color={color} bold>
			[{status}]
		</Text>
	);
};
