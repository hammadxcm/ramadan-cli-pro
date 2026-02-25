/**
 * @module tui/components/menu
 * @description BIOS/boot-menu style interactive main menu with arrow key navigation.
 */

import { Box, Text, useApp, useInput } from "ink";
import type React from "react";
import { useState } from "react";
import { usePrayerContext } from "../context/prayer-context.js";
import { useThemeColors } from "../context/theme-context.js";
import type { ScreenId } from "../types/navigation.js";

interface MenuItem {
	readonly label: string;
	readonly screen: ScreenId;
}

const MENU_ITEMS: ReadonlyArray<MenuItem> = [
	{ label: "Prayer Times", screen: "prayer-times" },
	{ label: "Qibla Direction", screen: "qibla" },
	{ label: "Quran Verse", screen: "quran" },
	{ label: "Hadith of the Day", screen: "hadith" },
	{ label: "Dua of the Day", screen: "dua" },
	{ label: "Adhkar", screen: "adhkar" },
	{ label: "Prayer & Fasting Tracker", screen: "tracker" },
	{ label: "Goals", screen: "goals" },
	{ label: "Statistics & Badges", screen: "stats" },
	{ label: "Zakat Calculator", screen: "zakat" },
	{ label: "Charity Log", screen: "charity" },
	{ label: "Settings", screen: "settings" },
];

interface MenuProps {
	readonly onSelect: (screen: ScreenId) => void;
	readonly isActive: boolean;
}

export const Menu: React.FC<MenuProps> = ({ onSelect, isActive }) => {
	const colors = useThemeColors();
	const { exit } = useApp();
	const { data } = usePrayerContext();
	const [selectedIndex, setSelectedIndex] = useState(0);

	const location = data ? `${data.meta.timezone}` : "Loading...";
	const hijriDate = data
		? `${data.date.hijri.day} ${data.date.hijri.month.en} ${data.date.hijri.year}`
		: "";

	useInput(
		(input, key) => {
			if (key.upArrow) {
				setSelectedIndex((prev) => (prev <= 0 ? MENU_ITEMS.length - 1 : prev - 1));
			} else if (key.downArrow) {
				setSelectedIndex((prev) => (prev >= MENU_ITEMS.length - 1 ? 0 : prev + 1));
			} else if (key.return) {
				const item = MENU_ITEMS[selectedIndex];
				if (item) {
					onSelect(item.screen);
				}
			} else if (input === "q" || input === "Q") {
				exit();
			}
		},
		{ isActive },
	);

	return (
		<Box flexDirection="column">
			<Box flexDirection="column" borderStyle="round" borderColor={colors.primary} paddingX={1}>
				<Text color={colors.primary} bold>
					Ramadan CLI Pro
				</Text>
				<Text color={colors.muted}>
					{location}
					{hijriDate ? ` | ${hijriDate}` : ""}
				</Text>
			</Box>

			<Box flexDirection="column" borderStyle="round" borderColor={colors.muted} paddingX={1}>
				{MENU_ITEMS.map((item, index) => {
					const isSelected = index === selectedIndex;
					return (
						<Box key={item.screen}>
							<Text color={isSelected ? colors.primary : colors.white} bold={isSelected}>
								{isSelected ? "  > " : "    "}
								{item.label}
							</Text>
						</Box>
					);
				})}
			</Box>

			<Box paddingX={1}>
				<Text color={colors.muted}>Up/Down Navigate Enter Select q Quit</Text>
			</Box>
		</Box>
	);
};
