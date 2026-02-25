/**
 * @module tui/hooks/use-navigation
 * @description React hook for screen navigation state management.
 */

import { useCallback, useState } from "react";
import type { NavigationState, ScreenId } from "../types/navigation.js";

interface UseNavigationReturn {
	readonly currentScreen: ScreenId;
	readonly previousScreen: ScreenId | null;
	readonly navigate: (screen: ScreenId) => void;
	readonly goBack: () => void;
}

/**
 * Manages navigation state between TUI screens.
 * Supports forward navigation and going back to the previous screen.
 */
export const useNavigation = (): UseNavigationReturn => {
	const [state, setState] = useState<NavigationState>({
		currentScreen: "menu",
		previousScreen: null,
	});

	const navigate = useCallback((screen: ScreenId) => {
		setState((prev) => ({
			currentScreen: screen,
			previousScreen: prev.currentScreen,
		}));
	}, []);

	const goBack = useCallback(() => {
		setState((prev) => ({
			currentScreen: prev.previousScreen ?? "menu",
			previousScreen: null,
		}));
	}, []);

	return {
		currentScreen: state.currentScreen,
		previousScreen: state.previousScreen,
		navigate,
		goBack,
	};
};
