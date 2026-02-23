/**
 * @module utils/error
 * @description Shared error utility for extracting human-readable error messages.
 */

/**
 * Extracts a human-readable message from an unknown thrown value.
 *
 * @param error - The caught value.
 * @returns The error message string, or `"unknown error"` for non-Error values.
 */
export const getErrorMessage = (error: unknown): string => {
	if (error instanceof Error) {
		return error.message;
	}
	return "unknown error";
};
