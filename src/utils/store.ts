/**
 * @module utils/store
 * @description Factory for creating Conf-backed persistent stores
 * with consistent test-environment handling.
 */

import Conf from "conf";

/**
 * Options for creating a Conf store.
 */
export interface CreateConfStoreOptions<T extends Record<string, unknown>> {
	/** Unique project name for the store. */
	readonly projectName: string;
	/** Optional directory override (takes precedence over test detection). */
	readonly cwd?: string | undefined;
	/** Default values for the store. */
	readonly defaults?: T | undefined;
}

/**
 * Creates a `Conf` store with consistent test-environment detection.
 * In test environments (`VITEST=true` or `NODE_ENV=test`), the store
 * writes to `/tmp` unless an explicit `cwd` override is provided.
 *
 * @param options - Store configuration options.
 * @returns A configured `Conf` instance.
 */
export const createConfStore = <T extends Record<string, unknown>>(
	options: CreateConfStoreOptions<T>,
): Conf<T> => {
	const isTestRuntime = process.env.VITEST === "true" || process.env.NODE_ENV === "test";
	const cwd = options.cwd ?? (isTestRuntime ? "/tmp" : undefined);

	return new Conf<T>({
		projectName: options.projectName,
		...(cwd ? { cwd } : {}),
		...(options.defaults ? { defaults: options.defaults } : {}),
	});
};
