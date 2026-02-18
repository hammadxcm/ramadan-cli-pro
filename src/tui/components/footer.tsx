/**
 * @module tui/components/footer
 * @description TUI dashboard footer with usage hints and attribution.
 */

import { Box, Text } from "ink";
import type React from "react";
import { colors } from "../theme/colors.js";

/**
 * Dashboard footer component showing usage instructions and credits.
 */
export const Footer: React.FC = () => (
	<Box flexDirection="column" paddingX={1} paddingTop={1}>
		<Text color={colors.muted}>Sehar uses Fajr. Iftar uses Maghrib. Press q to quit.</Text>
		<Text color={colors.muted}>Powered by Aladhan API | Hammad Khan</Text>
	</Box>
);
