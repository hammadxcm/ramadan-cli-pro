/**
 * @module errors/command
 * @description Error class for CLI command failures. Thrown by commands instead
 * of calling `process.exit(1)` directly, enabling centralized error handling.
 */

import { AppError } from "./base.error.js";
import type { ErrorCode } from "./error-codes.js";

/**
 * Represents an error in a CLI command. Caught by the top-level action handler
 * in `cli.ts`, which prints the message and exits with code 1.
 */
export class CommandError extends AppError {
	constructor(message: string, code: ErrorCode = "COMMAND_ERROR") {
		super(message, code);
		this.name = "CommandError";
	}
}
