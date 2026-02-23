/**
 * @module commands/dashboard
 * @description Launches the interactive TUI dashboard using Ink and React.
 */

import { CommandError } from "../errors/command.error.js";
import type { CommandContext } from "../types/command.js";

/**
 * Handles the `dashboard` / `--tui` command by dynamically importing Ink/React
 * and rendering the {@link App} component.
 */
export class DashboardCommand {
	async execute(context: CommandContext): Promise<void> {
		try {
			const { render } = await import("ink");
			const React = await import("react");
			const { App } = await import("../tui/app.js");
			render(React.createElement(App, { context }));
		} catch {
			throw new CommandError(
				"Failed to start TUI dashboard. Make sure ink and react are installed.",
			);
		}
	}
}
