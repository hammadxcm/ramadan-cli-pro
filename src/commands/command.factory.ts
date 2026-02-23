/**
 * @module commands/command-factory
 * @description Pure map-based command registry. All commands are registered
 * via `register()` and looked up via `get()`. No constructor params needed.
 */

/**
 * Union of all known command instances.
 */
// biome-ignore lint/suspicious/noExplicitAny: command instances have heterogeneous signatures
type AnyCommand = any;

/**
 * Central registry of all CLI command instances.
 * Supports dynamic registration via `register()` and lookup via `get()`.
 */
export class CommandFactory {
	private readonly commands = new Map<string, AnyCommand>();

	/**
	 * Registers a command instance under a given name.
	 *
	 * @param name - The command name.
	 * @param command - The command instance.
	 */
	register(name: string, command: AnyCommand): void {
		this.commands.set(name, command);
	}

	/**
	 * Retrieves a registered command by name.
	 *
	 * @param name - The command name.
	 * @returns The command instance, or `undefined` if not found.
	 */
	get<T = AnyCommand>(name: string): T | undefined {
		return this.commands.get(name) as T | undefined;
	}

	/**
	 * Returns all registered command names.
	 *
	 * @returns Array of command name strings.
	 */
	list(): ReadonlyArray<string> {
		return [...this.commands.keys()];
	}
}
