/**
 * @module providers/geo/geo-provider-factory
 * @description Factory that tries multiple {@link IGeoProvider} implementations
 * in priority order and returns the first successful result.
 */

import type { GeoLocation } from "../../types/geo.js";
import type { IGeoProvider } from "./geo-provider.interface.js";

/**
 * Orchestrates multiple geo providers, trying each in priority order
 * until one successfully returns a location.
 *
 * @example
 * ```ts
 * const factory = new GeoProviderFactory([ipApi, ipapiCo, ipWhois]);
 * const location = await factory.detect();
 * ```
 */
export class GeoProviderFactory {
	private readonly providers: ReadonlyArray<IGeoProvider>;

	/**
	 * @param providers - Array of geo providers (sorted by priority internally).
	 */
	constructor(providers: ReadonlyArray<IGeoProvider>) {
		this.providers = [...providers].sort((a, b) => a.priority - b.priority);
	}

	/**
	 * Tries each provider in priority order and returns the first successful result.
	 *
	 * @returns The detected location, or `null` if all providers failed.
	 */
	async detect(): Promise<GeoLocation | null> {
		for (const provider of this.providers) {
			const result = await provider.detect();
			if (result) {
				return result;
			}
		}
		return null;
	}

	/**
	 * Returns the names of all registered providers in priority order.
	 *
	 * @returns Array of provider name strings.
	 */
	getProviderNames(): ReadonlyArray<string> {
		return this.providers.map((p) => p.name);
	}
}
