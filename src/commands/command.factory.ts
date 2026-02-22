/**
 * @module commands/command-factory
 * @description Factory that holds references to all command instances,
 * wired by the dependency injection container.
 */

import type { ConfigCommand } from "./config.command.js";
import type { DashboardCommand } from "./dashboard.command.js";
import type { DuaCommand } from "./dua.command.js";
import type { NotifyCommand } from "./notify.command.js";
import type { QiblaCommand } from "./qibla.command.js";
import type { RamadanCommand } from "./ramadan.command.js";
import type { ResetCommand } from "./reset.command.js";
import type { TrackCommand } from "./track.command.js";

/**
 * Central registry of all CLI command instances.
 */
export class CommandFactory {
	constructor(
		readonly ramadan: RamadanCommand,
		readonly config: ConfigCommand,
		readonly reset: ResetCommand,
		readonly dashboard: DashboardCommand,
		readonly notify: NotifyCommand,
		readonly qibla: QiblaCommand,
		readonly dua: DuaCommand,
		readonly track: TrackCommand,
	) {}
}
