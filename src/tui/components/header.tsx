/**
 * @module tui/components/header
 * @description TUI dashboard header showing the app title, location, and Hijri date.
 */

import { Box, Text } from "ink";
import type React from "react";
import { colors } from "../theme/colors.js";

/**
 * Props for the {@link Header} component.
 */
interface HeaderProps {
	/** Location label (e.g. timezone or city name). */
	readonly location?: string | undefined;
	/** Hijri date string (e.g. `"15 Ramadan 1446"`). */
	readonly hijriDate?: string | undefined;
}

/**
 * Dashboard header component displaying the app title, location, and Hijri date.
 */
export const Header: React.FC<HeaderProps> = ({ location, hijriDate }) => (
	<Box flexDirection="column" paddingX={1}>
		<Text color={colors.primary} bold>
			{"\u{1F319}"} Ramadan CLI Pro Dashboard
		</Text>
		{location && (
			<Text color={colors.muted}>
				{"\u{1F4CD}"} {location}
			</Text>
		)}
		{hijriDate && <Text color={colors.muted}>{hijriDate}</Text>}
	</Box>
);
