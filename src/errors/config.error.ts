/**
 * @module errors/config
 * @description Error classes for configuration read/write and validation failures.
 */

import { AppError } from "./base.error.js";

/**
 * Thrown when a general configuration operation fails (e.g. file I/O).
 *
 * @example
 * ```ts
 * throw new ConfigError("Could not read config file");
 * ```
 */
export class ConfigError extends AppError {
	/**
	 * @param message - Description of the configuration error.
	 */
	constructor(message: string) {
		super(message, "CONFIG_ERROR");
		this.name = "ConfigError";
	}
}

/**
 * Thrown when a configuration value fails validation.
 *
 * @example
 * ```ts
 * throw new ConfigValidationError("Invalid method ID: 99");
 * ```
 */
export class ConfigValidationError extends AppError {
	/**
	 * @param message - Description of the validation failure.
	 */
	constructor(message: string) {
		super(message, "CONFIG_VALIDATION_ERROR");
		this.name = "ConfigValidationError";
	}
}
