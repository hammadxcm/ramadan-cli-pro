/**
 * @module themes/theme-registry
 * @description In-memory registry of all available themes.
 */

import { classicGoldTheme } from "./classic-gold.theme.js";
import { highContrastTheme } from "./high-contrast.theme.js";
import { minimalMonoTheme } from "./minimal-mono.theme.js";
import { oceanBlueTheme } from "./ocean-blue.theme.js";
import { ramadanGreenTheme } from "./ramadan-green.theme.js";
import { royalPurpleTheme } from "./royal-purple.theme.js";
import type { ITheme } from "./theme.interface.js";

const DEFAULT_THEME_ID = "ramadan-green";

/**
 * Registry that holds all available themes and provides lookup methods.
 */
export class ThemeRegistry {
	private readonly themes = new Map<string, ITheme>();

	constructor() {
		this.register(ramadanGreenTheme);
		this.register(classicGoldTheme);
		this.register(oceanBlueTheme);
		this.register(royalPurpleTheme);
		this.register(minimalMonoTheme);
		this.register(highContrastTheme);
	}

	/**
	 * Registers a theme in the registry.
	 *
	 * @param theme - The theme to register.
	 */
	register(theme: ITheme): void {
		this.themes.set(theme.id, theme);
	}

	/**
	 * Retrieves a theme by its ID.
	 *
	 * @param id - The theme identifier.
	 * @returns The theme, or `undefined` if not found.
	 */
	get(id: string): ITheme | undefined {
		return this.themes.get(id);
	}

	/**
	 * Returns the default theme.
	 *
	 * @returns The default Ramadan Green theme.
	 */
	getDefault(): ITheme {
		// biome-ignore lint/style/noNonNullAssertion: default theme is always registered
		return this.themes.get(DEFAULT_THEME_ID)!;
	}

	/**
	 * Returns all registered themes.
	 *
	 * @returns Array of all themes.
	 */
	list(): ReadonlyArray<ITheme> {
		return [...this.themes.values()];
	}

	/**
	 * Returns all registered theme IDs.
	 *
	 * @returns Array of theme ID strings.
	 */
	listIds(): ReadonlyArray<string> {
		return [...this.themes.keys()];
	}
}
