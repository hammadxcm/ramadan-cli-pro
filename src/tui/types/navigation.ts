/**
 * @module tui/types/navigation
 * @description Type definitions for the TUI navigation state machine.
 */

/** All available screen identifiers. */
export type ScreenId =
	| "menu"
	| "prayer-times"
	| "qibla"
	| "quran"
	| "hadith"
	| "dua"
	| "adhkar"
	| "tracker"
	| "goals"
	| "stats"
	| "zakat"
	| "charity"
	| "settings";

/** Navigation state tracked by the router. */
export interface NavigationState {
	readonly currentScreen: ScreenId;
	readonly previousScreen: ScreenId | null;
}
