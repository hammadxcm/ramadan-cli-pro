/**
 * @module commands/notify
 * @description Manages notification preferences (enable/disable, sehar/iftar toggles,
 * reminder minutes) via the `notify` subcommand.
 */

import pc from "picocolors";
import type { NotificationService } from "../services/notification.service.js";

/**
 * Options parsed from `ramadan-cli-pro notify` flags.
 */
export interface NotifyCommandOptions {
	readonly enable?: boolean;
	readonly disable?: boolean;
	readonly sehar?: boolean;
	readonly iftar?: boolean;
	readonly minutes?: number;
}

/**
 * Handles the `notify` subcommand for managing desktop notification preferences.
 */
export class NotifyCommand {
	constructor(private readonly notificationService: NotificationService) {}

	async execute(options: NotifyCommandOptions): Promise<void> {
		const hasToggle = options.enable || options.disable;
		const hasPreferenceFlag = options.sehar || options.iftar || options.minutes !== undefined;

		if (options.enable) {
			this.notificationService.setPreferences({ enabled: true });
			console.log(pc.green("Notifications enabled."));
		}

		if (options.disable) {
			this.notificationService.setPreferences({ enabled: false });
			console.log(pc.yellow("Notifications disabled."));
		}

		if (options.sehar) {
			const prefs = this.notificationService.getPreferences();
			const toggled = !prefs.seharReminder;
			this.notificationService.setPreferences({ seharReminder: toggled });
			console.log(
				toggled ? pc.green("Sehar reminder enabled.") : pc.yellow("Sehar reminder disabled."),
			);
		}

		if (options.iftar) {
			const prefs = this.notificationService.getPreferences();
			const toggled = !prefs.iftarReminder;
			this.notificationService.setPreferences({ iftarReminder: toggled });
			console.log(
				toggled ? pc.green("Iftar reminder enabled.") : pc.yellow("Iftar reminder disabled."),
			);
		}

		if (options.minutes !== undefined) {
			this.notificationService.setPreferences({
				reminderMinutesBefore: options.minutes,
			});
			console.log(pc.green(`Reminder set to ${options.minutes} minutes before.`));
		}

		if (!hasToggle && !hasPreferenceFlag) {
			this.showStatus();
		}
	}

	private showStatus(): void {
		const prefs = this.notificationService.getPreferences();

		console.log(pc.bold("Notification Preferences"));
		console.log(`  Notifications: ${prefs.enabled ? pc.green("enabled") : pc.yellow("disabled")}`);
		console.log(`  Sehar reminder: ${prefs.seharReminder ? pc.green("on") : pc.dim("off")}`);
		console.log(`  Iftar reminder: ${prefs.iftarReminder ? pc.green("on") : pc.dim("off")}`);
		console.log(`  Reminder time: ${pc.cyan(`${prefs.reminderMinutesBefore} min before`)}`);
		console.log();
		console.log(pc.dim("Use --enable/--disable, --sehar, --iftar, --minutes <n>"));
	}
}
