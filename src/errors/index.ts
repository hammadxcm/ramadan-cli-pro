/**
 * @module errors
 * @description Barrel re-export of all application error classes and the {@link ErrorCode} type.
 */

export { AppError } from "./base.error.js";
export { ApiError, ApiValidationError, ApiNetworkError } from "./api.error.js";
export { GeoLocationError, GeoProviderError } from "./geo.error.js";
export { ConfigError, ConfigValidationError } from "./config.error.js";
export {
	PrayerTimeFetchError,
	RamadanCalendarError,
	RozaNotFoundError,
} from "./prayer.error.js";
export {
	NotificationError,
	NotificationPermissionError,
} from "./notification.error.js";
export type { ErrorCode } from "./error-codes.js";
