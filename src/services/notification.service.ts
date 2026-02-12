/**
 * @module services/notification
 * @description Desktop notification service for sehar and iftar reminders.
 * Uses `node-notifier` when available and manages notification preferences.
 */

import type { ConfigRepository } from "../repositories/config.repository.js";
import type { NotificationEvent, NotificationPreferences } from "../types/notification.js";
import { DEFAULT_NOTIFICATION_PREFERENCES } from "../types/notification.js";
import type { I18nService } from "./i18n.service.js";

type NotificationListener = (event: NotificationEvent) => void;

/**
 * Manages desktop notifications and scheduled reminders for sehar/iftar times.
 *
 * @example
 * ```ts
 * const svc = new NotificationService(configRepo, i18n);
 * svc.on((event) => console.log(event.title));
 * await svc.notify({ type: "iftar", title: "Iftar!", message: "Time to break fast", scheduledAt: new Date() });
 * ```
 */
export class NotificationService {
	private listeners: Array<NotificationListener> = [];

	/**
	 * @param configRepository - For reading/writing notification preferences.
	 * @param i18nService - For translating notification messages.
	 */
	constructor(
		private readonly configRepository: ConfigRepository,
		private readonly i18nService: I18nService,
	) {}

	/**
	 * Registers a listener that fires whenever a notification is emitted.
	 *
	 * @param listener - Callback receiving the notification event.
	 * @returns An unsubscribe function.
	 */
	on(listener: NotificationListener): () => void {
		this.listeners.push(listener);
		return () => {
			this.listeners = this.listeners.filter((l) => l !== listener);
		};
	}

	private emit(event: NotificationEvent): void {
		for (const listener of this.listeners) {
			listener(event);
		}
	}

	/**
	 * Returns the current notification preferences.
	 *
	 * @returns Merged preferences with defaults applied.
	 */
	getPreferences(): NotificationPreferences {
		return this.configRepository.getNotificationPreferences();
	}

	/**
	 * Updates notification preferences.
	 *
	 * @param prefs - Partial preferences to merge.
	 */
	setPreferences(prefs: Partial<NotificationPreferences>): void {
		this.configRepository.setNotificationPreferences(prefs);
	}

	/**
	 * Checks whether notifications are globally enabled.
	 *
	 * @returns `true` if notifications are enabled.
	 */
	isEnabled(): boolean {
		return this.getPreferences().enabled;
	}

	/**
	 * Sends a desktop notification if notifications are enabled.
	 *
	 * @param event - The notification event to send.
	 */
	async notify(event: NotificationEvent): Promise<void> {
		if (!this.isEnabled()) return;

		this.emit(event);

		try {
			const notifier = await import("node-notifier");
			notifier.default.notify({
				title: event.title,
				message: event.message,
			});
		} catch {
			// node-notifier not available, silent fail
		}
	}

	/**
	 * Schedules a sehar reminder notification to fire `minutesBefore` minutes before sehar.
	 *
	 * @param seharTime - The sehar (Fajr) time as a `Date`.
	 * @param minutesBefore - Minutes before sehar to fire the reminder.
	 */
	scheduleSeharReminder(seharTime: Date, minutesBefore: number): void {
		const prefs = this.getPreferences();
		if (!prefs.enabled || !prefs.seharReminder) return;

		const reminderTime = new Date(seharTime.getTime() - minutesBefore * 60 * 1000);
		const now = new Date();
		const delay = reminderTime.getTime() - now.getTime();

		if (delay <= 0) return;

		setTimeout(() => {
			this.notify({
				type: "reminder",
				title: this.i18nService.t("notification.seharReminder"),
				message: this.i18nService.t("notification.seharIn", {
					minutes: minutesBefore,
				}),
				scheduledAt: reminderTime,
			});
		}, delay);
	}

	/**
	 * Schedules an iftar reminder notification to fire `minutesBefore` minutes before iftar.
	 *
	 * @param iftarTime - The iftar (Maghrib) time as a `Date`.
	 * @param minutesBefore - Minutes before iftar to fire the reminder.
	 */
	scheduleIftarReminder(iftarTime: Date, minutesBefore: number): void {
		const prefs = this.getPreferences();
		if (!prefs.enabled || !prefs.iftarReminder) return;

		const reminderTime = new Date(iftarTime.getTime() - minutesBefore * 60 * 1000);
		const now = new Date();
		const delay = reminderTime.getTime() - now.getTime();

		if (delay <= 0) return;

		setTimeout(() => {
			this.notify({
				type: "reminder",
				title: this.i18nService.t("notification.iftarReminder"),
				message: this.i18nService.t("notification.iftarIn", {
					minutes: minutesBefore,
				}),
				scheduledAt: reminderTime,
			});
		}, delay);
	}
}
