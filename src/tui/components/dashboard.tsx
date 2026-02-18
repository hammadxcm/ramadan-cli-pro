/**
 * @module tui/components/dashboard
 * @description Root dashboard component that composes header, prayer table,
 * countdown, and footer based on the prayer context state.
 */

import { Box } from "ink";
import type React from "react";
import { usePrayerContext } from "../context/prayer-context.js";
import { CountdownTimer } from "./countdown-timer.js";
import { ErrorDisplay } from "./error-display.js";
import { Footer } from "./footer.js";
import { Header } from "./header.js";
import { LoadingSpinner } from "./loading-spinner.js";
import { PrayerTimesTable } from "./prayer-times-table.js";

/**
 * Main dashboard layout component. Shows a loading spinner, error display,
 * or the full prayer-times dashboard depending on context state.
 */
export const Dashboard: React.FC = () => {
	const { data, highlight, loading, error } = usePrayerContext();

	if (loading) {
		return <LoadingSpinner message="Fetching prayer times..." />;
	}

	if (error) {
		return <ErrorDisplay message={error} />;
	}

	const location = data ? `${data.meta.timezone}` : undefined;
	const hijriDate = data
		? `${data.date.hijri.day} ${data.date.hijri.month.en} ${data.date.hijri.year}`
		: undefined;

	return (
		<Box flexDirection="column">
			<Header location={location} hijriDate={hijriDate} />
			<PrayerTimesTable timings={data?.timings ?? null} />
			<CountdownTimer highlight={highlight} />
			<Footer />
		</Box>
	);
};
