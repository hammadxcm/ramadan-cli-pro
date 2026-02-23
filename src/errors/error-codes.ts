/**
 * @module errors/error-codes
 * @description Union of all machine-readable error codes used by {@link AppError} subclasses.
 */

/**
 * Discriminated union of every error code in the application.
 * Each {@link AppError} subclass sets one of these as its `code` property,
 * enabling programmatic error handling by consumers.
 */
export type ErrorCode =
	| "UNKNOWN_ERROR"
	| "API_ERROR"
	| "API_VALIDATION_ERROR"
	| "API_NETWORK_ERROR"
	| "GEO_LOCATION_ERROR"
	| "GEO_PROVIDER_ERROR"
	| "CONFIG_ERROR"
	| "CONFIG_VALIDATION_ERROR"
	| "PRAYER_TIME_FETCH_ERROR"
	| "RAMADAN_CALENDAR_ERROR"
	| "ROZA_NOT_FOUND"
	| "INVALID_FIRST_ROZA_DATE"
	| "INVALID_FLAG_COMBINATION"
	| "LOCATION_DETECTION_FAILED"
	| "NOTIFICATION_ERROR"
	| "NOTIFICATION_PERMISSION_ERROR"
	| "COMMAND_ERROR"
	| "RAMADAN_CLI_ERROR";
