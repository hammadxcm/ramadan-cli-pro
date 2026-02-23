/**
 * @module commands/notify
 * @description Manages notification preferences (enable/disable, sehar/iftar toggles,
 * reminder minutes) via the `notify` subcommand.
 */

import pc from "picocolors";
import type { I18nService } from "../services/i18n.service.js";
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
	private readonly i18n: I18nService | undefined;

	constructor(
		private readonly notificationService: NotificationService,
		i18nService?: I18nService,
	) {
		this.i18n = i18nService;
	}

	private t(key: string, fallback: string, options?: Record<string, unknown>): string {
		return this.i18n ? this.i18n.t(key, options) : fallback;
	}

	async execute(options: NotifyCommandOptions): Promise<void> {
		const hasToggle = options.enable || options.disable;
		const hasPreferenceFlag = options.sehar || options.iftar || options.minutes !== undefined;

		if (options.enable) {
			this.notificationService.setPreferences({ enabled: true });
			console.log(pc.green(this.t("notify.enabled", "Notifications enabled.")));
		}

		if (options.disable) {
			this.notificationService.setPreferences({ enabled: false });
			console.log(pc.yellow(this.t("notify.disabled", "Notifications disabled.")));
		}

		if (options.sehar) {
			const prefs = this.notificationService.getPreferences();
			const toggled = !prefs.seharReminder;
			this.notificationService.setPreferences({ seharReminder: toggled });
			console.log(
				toggled
					? pc.green(this.t("notify.seharOn", "Sehar reminder enabled."))
					: pc.yellow(this.t("notify.seharOff", "Sehar reminder disabled.")),
			);
		}

		if (options.iftar) {
			const prefs = this.notificationService.getPreferences();
			const toggled = !prefs.iftarReminder;
			this.notificationService.setPreferences({ iftarReminder: toggled });
			console.log(
				toggled
					? pc.green(this.t("notify.iftarOn", "Iftar reminder enabled."))
					: pc.yellow(this.t("notify.iftarOff", "Iftar reminder disabled.")),
			);
		}

		if (options.minutes !== undefined) {
			this.notificationService.setPreferences({
				reminderMinutesBefore: options.minutes,
			});
			console.log(
				pc.green(
					this.t("notify.minutesSet", `Reminder set to ${options.minutes} minutes before.`, {
						minutes: options.minutes,
					}),
				),
			);
		}

		if (!hasToggle && !hasPreferenceFlag) {
			this.showStatus();
		}
	}

	private showStatus(): void {
		const prefs = this.notificationService.getPreferences();

		console.log(pc.bold(this.t("notify.title", "Notification Preferences")));
		console.log(`  Notifications: ${prefs.enabled ? pc.green("enabled") : pc.yellow("disabled")}`);
		console.log(`  Sehar reminder: ${prefs.seharReminder ? pc.green("on") : pc.dim("off")}`);
		console.log(`  Iftar reminder: ${prefs.iftarReminder ? pc.green("on") : pc.dim("off")}`);
		console.log(`  Reminder time: ${pc.cyan(`${prefs.reminderMinutesBefore} min before`)}`);
		console.log();
		console.log(
			pc.dim(this.t("notify.usage", "Use --enable/--disable, --sehar, --iftar, --minutes <n>")),
		);
	}
}
