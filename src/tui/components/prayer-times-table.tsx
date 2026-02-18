import { Box, Text } from "ink";
import type React from "react";
import type { PrayerTimings } from "../../types/prayer.js";
import { to12HourTime } from "../../utils/time.js";
import { colors } from "../theme/colors.js";

interface PrayerTimesTableProps {
	readonly timings: PrayerTimings | null;
}

const prayerEntries: ReadonlyArray<{ key: keyof PrayerTimings; label: string }> = [
	{ key: "Fajr", label: "Fajr (Sehar)" },
	{ key: "Sunrise", label: "Sunrise" },
	{ key: "Dhuhr", label: "Dhuhr" },
	{ key: "Asr", label: "Asr" },
	{ key: "Maghrib", label: "Maghrib (Iftar)" },
	{ key: "Isha", label: "Isha" },
];

export const PrayerTimesTable: React.FC<PrayerTimesTableProps> = ({ timings }) => {
	if (!timings) {
		return (
			<Box paddingX={1}>
				<Text color={colors.muted}>Loading prayer times...</Text>
			</Box>
		);
	}

	return (
		<Box flexDirection="column" paddingX={1}>
			<Text color={colors.primary} bold underline>
				Prayer Times
			</Text>
			{prayerEntries.map(({ key, label }) => (
				<Box key={key}>
					<Box width={20}>
						<Text color={colors.muted}>{label}</Text>
					</Box>
					<Text color={colors.white}>{to12HourTime(timings[key])}</Text>
				</Box>
			))}
		</Box>
	);
};
