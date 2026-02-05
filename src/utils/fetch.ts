/**
 * @module utils/fetch
 * @description HTTP fetch wrappers with timeout, retry, and typed JSON parsing.
 */

import { ApiNetworkError } from "../errors/api.error.js";

const DEFAULT_TIMEOUT = 10_000;
const DEFAULT_RETRIES = 1;
const RETRY_DELAY = 1_000;

/**
 * Options for {@link typedFetch}.
 */
interface TypedFetchOptions {
	/** Request timeout in milliseconds. @default 10000 */
	readonly timeout?: number;
	/** Number of retry attempts after the initial request. @default 1 */
	readonly retries?: number;
}

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetches a URL and parses the JSON response as type `T`, with timeout and retry support.
 *
 * @typeParam T - The expected shape of the JSON response.
 * @param url - The URL to fetch.
 * @param options - Optional timeout and retry configuration.
 * @returns The parsed JSON response.
 * @throws {ApiNetworkError} If all attempts fail or the response status is not OK.
 *
 * @example
 * ```ts
 * const data = await typedFetch<ApiResponse>("https://api.aladhan.com/...");
 * ```
 */
export const typedFetch = async <T>(url: string, options?: TypedFetchOptions): Promise<T> => {
	const timeout = options?.timeout ?? DEFAULT_TIMEOUT;
	const retries = options?.retries ?? DEFAULT_RETRIES;
	let lastError: Error | null = null;

	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), timeout);

			const response = await fetch(url, { signal: controller.signal });
			clearTimeout(timeoutId);

			if (!response.ok) {
				throw new ApiNetworkError(`HTTP ${response.status}: ${response.statusText}`, url);
			}

			return (await response.json()) as T;
		} catch (error) {
			lastError = error instanceof Error ? error : new Error(String(error));
			if (attempt < retries) {
				await delay(RETRY_DELAY);
			}
		}
	}

	throw new ApiNetworkError(lastError?.message ?? `Failed to fetch ${url}`, url);
};

/**
 * Fetches a URL and returns the raw parsed JSON as `unknown`.
 * No timeout or retry logic — use {@link typedFetch} for production calls.
 *
 * @param url - The URL to fetch.
 * @returns The parsed JSON response.
 */
export const fetchJson = async (url: string): Promise<unknown> => {
	const response = await fetch(url);
	return (await response.json()) as unknown;
};
