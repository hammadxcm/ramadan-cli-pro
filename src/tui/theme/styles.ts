/**
 * @module tui/theme/styles
 * @description Layout constants for the TUI dashboard.
 */

/**
 * Shared layout style tokens used by TUI components.
 * @readonly
 */
export const styles = {
	/** Horizontal padding in character units. */
	padding: 1,
	/** Border style for Ink `<Box>` components. */
	borderStyle: "round" as const,
	/** Header height in rows. */
	headerHeight: 3,
	/** Footer height in rows. */
	footerHeight: 2,
} as const;
