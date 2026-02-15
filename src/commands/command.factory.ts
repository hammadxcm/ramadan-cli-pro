/**
 * @module commands/command-factory
 * @description Factory that holds references to all command instances,
 * wired by the dependency injection container.
 */

import type { ConfigCommand } from "./config.command.js";
import type { DashboardCommand } from "./dashboard.command.js";
import type { NotifyCommand } from "./notify.command.js";
import type { RamadanCommand } from "./ramadan.command.js";
import type { ResetCommand } from "./reset.command.js";

/**
 * Central registry of all CLI command instances.
 */
export class CommandFactory {
	/**
	 * @param ramadan - The main Ramadan timetable command.
	 * @param config - The configuration management command.
	 * @param reset - The configuration reset command.
	 * @param dashboard - The TUI dashboard command.
	 * @param notify - The notification preferences command.
	 */
	constructor(
		readonly ramadan: RamadanCommand,
		readonly config: ConfigCommand,
		readonly reset: ResetCommand,
		readonly dashboard: DashboardCommand,
		readonly notify: NotifyCommand,
	) {}
}
