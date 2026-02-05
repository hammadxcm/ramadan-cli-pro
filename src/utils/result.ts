/**
 * @module utils/result
 * @description A lightweight `Result<T, E>` type for explicit error handling
 * without exceptions. Inspired by Rust's `Result` enum.
 */

/**
 * Discriminated union representing either a successful value or an error.
 *
 * @typeParam T - The success value type.
 * @typeParam E - The error type (defaults to `Error`).
 *
 * @example
 * ```ts
 * const result: Result<number> = ok(42);
 * if (result.ok) {
 *   console.log(result.value); // 42
 * }
 * ```
 */
export type Result<T, E = Error> =
	| { readonly ok: true; readonly value: T }
	| { readonly ok: false; readonly error: E };

/**
 * Creates a successful {@link Result}.
 *
 * @param value - The success value.
 * @returns A `Result` with `ok: true`.
 */
export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });

/**
 * Creates a failed {@link Result}.
 *
 * @param error - The error value.
 * @returns A `Result` with `ok: false`.
 */
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

/**
 * Wraps a `Promise` into a {@link Result}, catching any thrown errors.
 *
 * @param promise - The promise to wrap.
 * @returns A `Result` containing the resolved value or the caught error.
 *
 * @example
 * ```ts
 * const result = await fromPromise(fetch("/api"));
 * if (!result.ok) console.error(result.error);
 * ```
 */
export const fromPromise = async <T>(promise: Promise<T>): Promise<Result<T, Error>> => {
	try {
		const value = await promise;
		return ok(value);
	} catch (error) {
		return err(error instanceof Error ? error : new Error(String(error)));
	}
};
