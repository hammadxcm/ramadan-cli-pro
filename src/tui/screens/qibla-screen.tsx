/**
 * @module tui/screens/qibla-screen
 * @description Qibla direction screen with ASCII compass.
 */

import { Box, Text } from "ink";
import type React from "react";
import { useEffect, useState } from "react";
import { useContainer } from "../context/container-context.js";
import { useThemeColors } from "../context/theme-context.js";
import { ScreenWrapper } from "../components/screen-wrapper.js";
import { LoadingSpinner } from "../components/loading-spinner.js";

interface QiblaScreenProps {
	readonly onBack: () => void;
	readonly isActive: boolean;
}

const COMPASS_POINTS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;

const getCardinalDirection = (degrees: number): string => {
	const normalized = ((degrees % 360) + 360) % 360;
	const index = Math.round(normalized / 45) % 8;
	return COMPASS_POINTS[index] ?? "N";
};

const getArrow = (degrees: number): string => {
	const n = ((degrees % 360) + 360) % 360;
	if (n >= 337.5 || n < 22.5) return "\u2191";
	if (n >= 22.5 && n < 67.5) return "\u2197";
	if (n >= 67.5 && n < 112.5) return "\u2192";
	if (n >= 112.5 && n < 157.5) return "\u2198";
	if (n >= 157.5 && n < 202.5) return "\u2193";
	if (n >= 202.5 && n < 247.5) return "\u2199";
	if (n >= 247.5 && n < 292.5) return "\u2190";
	return "\u2196";
};

interface QiblaResult {
	direction: number;
	latitude: number;
	longitude: number;
}

export const QiblaScreen: React.FC<QiblaScreenProps> = ({ onBack, isActive }) => {
	const colors = useThemeColors();
	const container = useContainer();
	const [qibla, setQibla] = useState<QiblaResult | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const query = await container.locationService.resolveQuery({
					allowInteractiveSetup: false,
				});
				let lat = query.latitude;
				let lon = query.longitude;
				if (lat === undefined || lon === undefined) {
					const cityName = query.city ?? query.address;
					const geocoded = await container.geocodingProvider.search(cityName);
					if (!geocoded) {
						throw new Error(
							"Could not determine coordinates. Please configure latitude/longitude.",
						);
					}
					lat = geocoded.latitude;
					lon = geocoded.longitude;
				}
				const data = await container.prayerApiRepository.fetchQibla(lat, lon);
				if (!cancelled) {
					setQibla({
						direction: data.direction,
						latitude: data.latitude,
						longitude: data.longitude,
					});
					setLoading(false);
				}
			} catch (err) {
				if (!cancelled) {
					setError(err instanceof Error ? err.message : "Failed to fetch Qibla");
					setLoading(false);
				}
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [container]);

	if (loading) {
		return (
			<ScreenWrapper title="Qibla Direction" onBack={onBack} isActive={isActive}>
				<LoadingSpinner message="Fetching Qibla direction..." />
			</ScreenWrapper>
		);
	}

	if (error || !qibla) {
		return (
			<ScreenWrapper title="Qibla Direction" onBack={onBack} isActive={isActive}>
				<Text color={colors.error}>{error ?? "Unable to determine Qibla direction"}</Text>
			</ScreenWrapper>
		);
	}

	const cardinal = getCardinalDirection(qibla.direction);
	const arrow = getArrow(qibla.direction);

	return (
		<ScreenWrapper title="Qibla Direction" onBack={onBack} isActive={isActive}>
			<Box flexDirection="column">
				<Text color={colors.muted}>        N</Text>
				<Text color={colors.muted}>        |</Text>
				<Text color={colors.muted}>
					{"   W ---"}
					<Text color={colors.primary} bold>
						{arrow}
					</Text>
					{"--- E"}
				</Text>
				<Text color={colors.muted}>        |</Text>
				<Text color={colors.muted}>        S</Text>
				<Text> </Text>
				<Text>
					<Text color={colors.white} bold>
						Bearing:{" "}
					</Text>
					<Text color={colors.secondary}>
						{qibla.direction.toFixed(2)}{"\u00B0"} ({cardinal})
					</Text>
				</Text>
				<Text>
					<Text color={colors.white} bold>
						From:{" "}
					</Text>
					<Text color={colors.muted}>
						{qibla.latitude.toFixed(4)}, {qibla.longitude.toFixed(4)}
					</Text>
				</Text>
				<Text>
					<Text color={colors.white} bold>
						Towards:{" "}
					</Text>
					<Text color={colors.muted}>Kaaba, Mecca</Text>
				</Text>
			</Box>
		</ScreenWrapper>
	);
};
