/**
 * @module services/theme
 * @description Manages the active theme by combining the theme registry
 * with persistent config storage.
 */

import type { ConfigRepository } from "../repositories/config.repository.js";
import type { ITheme } from "../themes/theme.interface.js";
import type { ThemeRegistry } from "../themes/theme.registry.js";

/**
 * Service that resolves and manages the active theme.
 */
export class ThemeService {
	constructor(
		private readonly registry: ThemeRegistry,
		private readonly configRepository: ConfigRepository,
	) {}

	/**
	 * Returns the currently active theme, resolved from:
	 * 1. Explicit override (e.g. from `--theme` flag)
	 * 2. Stored theme preference
	 * 3. Default theme
	 *
	 * @param override - Optional theme ID override from CLI flag.
	 * @returns The resolved theme.
	 */
	getActiveTheme(override?: string): ITheme {
		if (override) {
			const theme = this.registry.get(override);
			if (theme) return theme;
		}

		const stored = this.configRepository.getStoredTheme();
		if (stored) {
			const theme = this.registry.get(stored);
			if (theme) return theme;
		}

		return this.registry.getDefault();
	}

	/**
	 * Persists a theme choice.
	 *
	 * @param themeId - The theme ID to store.
	 * @returns `true` if the theme exists and was stored, `false` otherwise.
	 */
	setTheme(themeId: string): boolean {
		const theme = this.registry.get(themeId);
		if (!theme) return false;
		this.configRepository.setStoredTheme(themeId);
		return true;
	}

	/**
	 * Returns all available theme IDs.
	 *
	 * @returns Array of theme ID strings.
	 */
	listThemes(): ReadonlyArray<string> {
		return this.registry.listIds();
	}

	/**
	 * Returns the theme registry for direct access.
	 *
	 * @returns The underlying theme registry.
	 */
	getRegistry(): ThemeRegistry {
		return this.registry;
	}
}
