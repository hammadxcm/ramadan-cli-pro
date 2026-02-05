/**
 * @module utils/string
 * @description String normalization and validation helpers.
 */

/**
 * Trims whitespace and lowercases a string for case-insensitive comparison.
 *
 * @param value - The string to normalize.
 * @returns The trimmed, lowercased string.
 */
export const normalize = (value: string): string => value.trim().toLowerCase();

/**
 * Returns a trimmed, non-empty string or `null`.
 * Useful for sanitizing optional user input.
 *
 * @param value - Any value to check.
 * @returns The trimmed string if non-empty, otherwise `null`.
 *
 * @example
 * ```ts
 * toNonEmptyString("  hello  "); // "hello"
 * toNonEmptyString("");           // null
 * toNonEmptyString(42);           // null
 * ```
 */
export const toNonEmptyString = (value: unknown): string | null => {
	if (typeof value !== "string") {
		return null;
	}
	const trimmed = value.trim();
	if (!trimmed) {
		return null;
	}
	return trimmed;
};
