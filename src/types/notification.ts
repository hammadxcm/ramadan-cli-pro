/**
 * @module types/notification
 * @description Types and defaults for desktop notification events and user preferences.
 */

/**
 * A single scheduled notification event.
 */
export interface NotificationEvent {
	/** The kind of notification: sehar, iftar, or an advance reminder. */
	readonly type: "sehar" | "iftar" | "reminder";
	/** Notification title displayed to the user. */
	readonly title: string;
	/** Notification body message. */
	readonly message: string;
	/** The date/time at which this notification is scheduled to fire. */
	readonly scheduledAt: Date;
}

/**
 * User preferences governing which notifications to send and when.
 */
export interface NotificationPreferences {
	/** Whether notifications are enabled globally. */
	readonly enabled: boolean;
	/** Whether to notify at sehar (suhoor) time. */
	readonly seharReminder: boolean;
	/** Whether to notify at iftar time. */
	readonly iftarReminder: boolean;
	/** How many minutes before the event to fire a reminder. */
	readonly reminderMinutesBefore: number;
}

/**
 * Sensible defaults for notification preferences.
 * @readonly
 */
export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
	enabled: false,
	seharReminder: true,
	iftarReminder: true,
	reminderMinutesBefore: 15,
};
