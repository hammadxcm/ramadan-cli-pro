/**
 * @module types/command
 * @description Shared interfaces for the CLI command pattern. Every command
 * implements {@link ICommand} and receives a {@link CommandContext}.
 */

/**
 * Runtime context passed to every CLI command, built from parsed CLI flags.
 */
export interface CommandContext {
	/** City name or search string (e.g. `"Karachi"`). */
	readonly city?: string | undefined;
	/** If `true`, display the full 30-day Ramadan calendar. */
	readonly all?: boolean | undefined;
	/** Specific roza number to display (1–30). */
	readonly rozaNumber?: number | undefined;
	/** If `true`, use plain-text output (no colors). */
	readonly plain?: boolean | undefined;
	/** If `true`, output as JSON. */
	readonly json?: boolean | undefined;
	/** If `true`, show a single status line. */
	readonly status?: boolean | undefined;
	/** If `true`, launch the interactive TUI dashboard. */
	readonly tui?: boolean | undefined;
	/** Locale override for i18n (e.g. `"en"`, `"ar"`, `"ur"`). */
	readonly locale?: string | undefined;
	/** Override date for the first roza in `YYYY-MM-DD` format. */
	readonly firstRozaDate?: string | undefined;
	/** If `true`, clear any previously stored first-roza-date override. */
	readonly clearFirstRozaDate?: boolean | undefined;
}

/**
 * Contract that all CLI commands must implement.
 */
export interface ICommand {
	/**
	 * Validates the command context before execution.
	 *
	 * @param context - The parsed CLI context.
	 * @throws If the context is invalid for this command.
	 */
	validate(context: CommandContext): void;

	/**
	 * Executes the command.
	 *
	 * @param context - The validated CLI context.
	 */
	execute(context: CommandContext): Promise<void>;
}
