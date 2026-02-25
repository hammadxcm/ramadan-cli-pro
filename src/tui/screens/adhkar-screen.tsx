/**
 * @module tui/screens/adhkar-screen
 * @description Adhkar screen with tab-based collection switching and scrolling.
 */

import { Box, Text, useInput } from "ink";
import type React from "react";
import { useState } from "react";
import { ADHKAR_COLLECTIONS } from "../../data/adhkar.js";
import { useThemeColors } from "../context/theme-context.js";
import { ScreenWrapper } from "../components/screen-wrapper.js";

interface AdhkarScreenProps {
	readonly onBack: () => void;
	readonly isActive: boolean;
}

export const AdhkarScreen: React.FC<AdhkarScreenProps> = ({ onBack, isActive }) => {
	const colors = useThemeColors();
	const [collectionIndex, setCollectionIndex] = useState(0);
	const [itemIndex, setItemIndex] = useState(0);

	useInput(
		(_input, key) => {
			if (key.leftArrow) {
				setCollectionIndex((prev) => (prev <= 0 ? ADHKAR_COLLECTIONS.length - 1 : prev - 1));
				setItemIndex(0);
			} else if (key.rightArrow) {
				setCollectionIndex((prev) => (prev >= ADHKAR_COLLECTIONS.length - 1 ? 0 : prev + 1));
				setItemIndex(0);
			} else if (key.upArrow) {
				const collection = ADHKAR_COLLECTIONS[collectionIndex];
				if (collection) {
					setItemIndex((prev) => (prev <= 0 ? collection.items.length - 1 : prev - 1));
				}
			} else if (key.downArrow) {
				const collection = ADHKAR_COLLECTIONS[collectionIndex];
				if (collection) {
					setItemIndex((prev) => (prev >= collection.items.length - 1 ? 0 : prev + 1));
				}
			}
		},
		{ isActive },
	);

	const collection = ADHKAR_COLLECTIONS[collectionIndex];
	if (!collection) return null;

	const item = collection.items[itemIndex];

	return (
		<ScreenWrapper
			title="Adhkar"
			onBack={onBack}
			isActive={isActive}
			footer="Left/Right Collection  Up/Down Item  Esc Back  q Quit"
		>
			<Box flexDirection="column">
				<Box>
					{ADHKAR_COLLECTIONS.map((c, i) => (
						<Box key={c.id} marginRight={2}>
							<Text
								color={i === collectionIndex ? colors.primary : colors.muted}
								bold={i === collectionIndex}
							>
								{c.title.split("(")[0]?.trim() ?? c.title}
							</Text>
						</Box>
					))}
				</Box>

				<Text> </Text>
				<Text color={colors.muted}>
					Item {itemIndex + 1} of {collection.items.length}
				</Text>
				<Text> </Text>

				{item && (
					<Box flexDirection="column">
						<Text color={colors.white}>{item.arabic}</Text>
						<Text> </Text>
						<Text color={colors.secondary} italic>
							{item.transliteration}
						</Text>
						<Text> </Text>
						<Text color={colors.muted}>{item.translation}</Text>
						{item.count !== undefined && (
							<Text color={colors.primary}>Repeat: {item.count}x</Text>
						)}
					</Box>
				)}
			</Box>
		</ScreenWrapper>
	);
};
