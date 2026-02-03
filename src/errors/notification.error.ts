/**
 * @module errors/notification
 * @description Error classes for desktop notification failures.
 */

import { AppError } from "./base.error.js";

/**
 * Thrown when sending a desktop notification fails.
 *
 * @example
 * ```ts
 * throw new NotificationError("Failed to send notification");
 * ```
 */
export class NotificationError extends AppError {
	/**
	 * @param message - Description of the notification failure.
	 */
	constructor(message: string) {
		super(message, "NOTIFICATION_ERROR");
		this.name = "NotificationError";
	}
}

/**
 * Thrown when the user has not granted notification permissions.
 *
 * @example
 * ```ts
 * throw new NotificationPermissionError("Notifications not permitted on this system");
 * ```
 */
export class NotificationPermissionError extends AppError {
	/**
	 * @param message - Description of the permission issue.
	 */
	constructor(message: string) {
		super(message, "NOTIFICATION_PERMISSION_ERROR");
		this.name = "NotificationPermissionError";
	}
}
