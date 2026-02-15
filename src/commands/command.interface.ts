/**
 * @module commands/command
 * @description Re-export of the {@link ICommand} interface for command implementations.
 * @see {@link import("../types/command.js").ICommand}
 */

import type { CommandContext } from "../types/command.js";

/**
 * Contract that all CLI commands must implement.
 */
export interface ICommand {
	/**
	 * Validates the command context before execution.
	 * @param context - The parsed CLI context.
	 */
	validate(context: CommandContext): void;
	/**
	 * Executes the command.
	 * @param context - The validated CLI context.
	 */
	execute(context: CommandContext): Promise<void>;
}
