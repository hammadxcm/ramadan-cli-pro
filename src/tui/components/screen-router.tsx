/**
 * @module tui/components/screen-router
 * @description Maps ScreenId to screen components and manages navigation.
 */

import type React from "react";
import { usePrayerContext } from "../context/prayer-context.js";
import { useNavigation } from "../hooks/use-navigation.js";
import { AdhkarScreen } from "../screens/adhkar-screen.js";
import { CharityScreen } from "../screens/charity-screen.js";
import { DuaScreen } from "../screens/dua-screen.js";
import { GoalsScreen } from "../screens/goals-screen.js";
import { HadithScreen } from "../screens/hadith-screen.js";
import { PrayerTimesScreen } from "../screens/prayer-times-screen.js";
import { QiblaScreen } from "../screens/qibla-screen.js";
import { QuranScreen } from "../screens/quran-screen.js";
import { SettingsScreen } from "../screens/settings-screen.js";
import { StatsScreen } from "../screens/stats-screen.js";
import { TrackerScreen } from "../screens/tracker-screen.js";
import { ZakatScreen } from "../screens/zakat-screen.js";
import { ErrorDisplay } from "./error-display.js";
import { LoadingSpinner } from "./loading-spinner.js";
import { Menu } from "./menu.js";

/**
 * Top-level router that renders the current screen based on navigation state.
 */
export const ScreenRouter: React.FC = () => {
	const { currentScreen, navigate, goBack } = useNavigation();
	const { loading, error } = usePrayerContext();

	if (loading) {
		return <LoadingSpinner message="Fetching prayer times..." />;
	}

	if (error) {
		return <ErrorDisplay message={error} />;
	}

	const isMenu = currentScreen === "menu";

	switch (currentScreen) {
		case "menu":
			return <Menu onSelect={navigate} isActive={isMenu} />;
		case "prayer-times":
			return <PrayerTimesScreen onBack={goBack} isActive={!isMenu} />;
		case "qibla":
			return <QiblaScreen onBack={goBack} isActive={!isMenu} />;
		case "quran":
			return <QuranScreen onBack={goBack} isActive={!isMenu} />;
		case "hadith":
			return <HadithScreen onBack={goBack} isActive={!isMenu} />;
		case "dua":
			return <DuaScreen onBack={goBack} isActive={!isMenu} />;
		case "adhkar":
			return <AdhkarScreen onBack={goBack} isActive={!isMenu} />;
		case "tracker":
			return <TrackerScreen onBack={goBack} isActive={!isMenu} />;
		case "goals":
			return <GoalsScreen onBack={goBack} isActive={!isMenu} />;
		case "stats":
			return <StatsScreen onBack={goBack} isActive={!isMenu} />;
		case "zakat":
			return <ZakatScreen onBack={goBack} isActive={!isMenu} />;
		case "charity":
			return <CharityScreen onBack={goBack} isActive={!isMenu} />;
		case "settings":
			return <SettingsScreen onBack={goBack} isActive={!isMenu} />;
		default:
			return <Menu onSelect={navigate} isActive={true} />;
	}
};
