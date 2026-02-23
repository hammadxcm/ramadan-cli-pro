/**
 * @module themes/theme-interface
 * @description Defines the shape of a theme — CLI colors (picocolors functions),
 * TUI colors (hex strings), and banner colorization.
 */

/**
 * CLI color functions (backed by picocolors or ANSI escape sequences).
 */
export interface CliColors {
	/** Primary brand color function. */
	readonly primary: (text: string) => string;
	/** Secondary/accent color function. */
	readonly secondary: (text: string) => string;
	/** Error color function. */
	readonly error: (text: string) => string;
	/** Muted/dim color function. */
	readonly muted: (text: string) => string;
}

/**
 * TUI color hex strings for Ink components.
 */
export interface TuiColors {
	/** Primary brand hex color. */
	readonly primary: string;
	/** Secondary/accent hex color. */
	readonly secondary: string;
	/** Error hex color. */
	readonly error: string;
	/** Muted/dim hex color. */
	readonly muted: string;
	/** White text hex color. */
	readonly white: string;
	/** Dark background hex color. */
	readonly background: string;
}

/**
 * Complete theme definition.
 */
export interface ITheme {
	/** Unique theme identifier (e.g. `"ramadan-green"`). */
	readonly id: string;
	/** Human-readable display name. */
	readonly name: string;
	/** CLI color functions. */
	readonly cli: CliColors;
	/** TUI hex color tokens. */
	readonly tui: TuiColors;
	/** Banner colorization function (applies the theme to ASCII art). */
	readonly banner: (text: string) => string;
}
