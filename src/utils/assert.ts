/**
 * @module utils/assert
 * @description Assertion utilities for exhaustiveness checking and null-safety.
 */

/**
 * Asserts that a code path is unreachable. Useful for exhaustive `switch` statements.
 *
 * @param value - The value that should be `never` at this point.
 * @throws {Error} Always — if this function is reached, the switch is non-exhaustive.
 *
 * @example
 * ```ts
 * switch (status) {
 *   case "ok": return handle();
 *   default: assertNever(status);
 * }
 * ```
 */
export const assertNever = (value: never): never => {
	throw new Error(`Unexpected value: ${String(value)}`);
};

/**
 * Asserts that a value is neither `null` nor `undefined` and returns it.
 *
 * @param value - The value to check.
 * @param message - Optional custom error message.
 * @returns The original value, narrowed to exclude `null | undefined`.
 * @throws {Error} If the value is `null` or `undefined`.
 *
 * @example
 * ```ts
 * const el = assertDefined(document.getElementById("app"));
 * ```
 */
export const assertDefined = <T>(value: T | null | undefined, message?: string): T => {
	if (value === null || value === undefined) {
		throw new Error(message ?? "Expected value to be defined");
	}
	return value;
};
