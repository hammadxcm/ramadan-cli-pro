/**
 * @module errors/api
 * @description Error classes for API-related failures: general API errors,
 * response validation errors, and network connectivity errors.
 */

import { AppError } from "./base.error.js";

/**
 * Thrown when the Aladhan API returns an unexpected or error response.
 *
 * @example
 * ```ts
 * throw new ApiError("API returned status 500");
 * ```
 */
export class ApiError extends AppError {
	/**
	 * @param message - Description of the API error.
	 */
	constructor(message: string) {
		super(message, "API_ERROR");
		this.name = "ApiError";
	}
}

/**
 * Thrown when an API response fails Zod schema validation.
 *
 * @example
 * ```ts
 * throw new ApiValidationError("Invalid timings shape", ["Missing field: Fajr"]);
 * ```
 */
export class ApiValidationError extends AppError {
	/** Individual validation issue descriptions. */
	readonly issues: ReadonlyArray<string>;

	/**
	 * @param message - Summary of the validation failure.
	 * @param issues - List of individual validation issues.
	 */
	constructor(message: string, issues: ReadonlyArray<string> = []) {
		super(message, "API_VALIDATION_ERROR");
		this.name = "ApiValidationError";
		this.issues = issues;
	}
}

/**
 * Thrown when a network request to the API fails (timeout, DNS, etc.).
 *
 * @example
 * ```ts
 * throw new ApiNetworkError("Request timed out", "https://api.aladhan.com/...");
 * ```
 */
export class ApiNetworkError extends AppError {
	/** The URL that was being fetched when the error occurred. */
	readonly url: string;

	/**
	 * @param message - Description of the network failure.
	 * @param url - The URL that failed.
	 */
	constructor(message: string, url: string) {
		super(message, "API_NETWORK_ERROR");
		this.name = "ApiNetworkError";
		this.url = url;
	}
}
