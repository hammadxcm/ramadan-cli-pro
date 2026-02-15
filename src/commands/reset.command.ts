/**
 * @module commands/reset
 * @description Clears all persisted configuration and cache.
 */

import type { ConfigRepository } from "../repositories/config.repository.js";

/**
 * Handles the `reset` subcommand by clearing all stored configuration.
 */
export class ResetCommand {
	constructor(private readonly configRepository: ConfigRepository) {}

	execute(): void {
		this.configRepository.clearAll();
		console.log("Configuration reset.");
	}
}
