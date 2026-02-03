/**
 * @module errors/base
 * @description Base error class for all application-specific errors.
 */

import type { ErrorCode } from "./error-codes.js";

/**
 * Base error class that all domain errors extend.
 * Provides a structured `code`, an `isOperational` flag to distinguish
 * expected failures from programming bugs, and a `timestamp`.
 *
 * @example
 * ```ts
 * throw new AppError("Something went wrong", "UNKNOWN_ERROR");
 * ```
 */
export class AppError extends Error {
	/** Machine-readable error code for programmatic handling. */
	readonly code: ErrorCode;
	/** `true` if this is an expected operational error, `false` for programming bugs. */
	readonly isOperational: boolean;
	/** When the error was created. */
	readonly timestamp: Date;

	/**
	 * @param message - Human-readable error description.
	 * @param code - Machine-readable {@link ErrorCode}.
	 * @param isOperational - Whether this error is an expected operational failure.
	 *   @default true
	 */
	constructor(message: string, code: ErrorCode, isOperational = true) {
		super(message);
		this.name = "AppError";
		this.code = code;
		this.isOperational = isOperational;
		this.timestamp = new Date();
	}

	/**
	 * Serializes the error to a plain object for JSON output.
	 *
	 * @returns A record containing name, code, message, isOperational, and timestamp.
	 */
	toJSON(): Record<string, unknown> {
		return {
			name: this.name,
			code: this.code,
			message: this.message,
			isOperational: this.isOperational,
			timestamp: this.timestamp.toISOString(),
		};
	}
}
