/**
 * @module commands/reset
 * @description Clears all persisted configuration and cache.
 */

import type { ConfigRepository } from "../repositories/config.repository.js";
import type { I18nService } from "../services/i18n.service.js";

/**
 * Handles the `reset` subcommand by clearing all stored configuration.
 */
export class ResetCommand {
	private readonly i18n: I18nService | undefined;

	constructor(
		private readonly configRepository: ConfigRepository,
		i18nService?: I18nService,
	) {
		this.i18n = i18nService;
	}

	private t(key: string, fallback: string): string {
		return this.i18n ? this.i18n.t(key) : fallback;
	}

	execute(): void {
		this.configRepository.clearAll();
		console.log(this.t("reset.done", "Configuration reset."));
	}
}
