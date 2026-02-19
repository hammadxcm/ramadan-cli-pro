/**
 * @module main
 * @description Public API barrel export for programmatic consumers of ramadan-cli-pro.
 * Import types, error classes, branded constructors, and the DI container from here.
 *
 * @example
 * ```ts
 * import { createContainer, type PrayerData } from "ramadan-cli-pro";
 *
 * const container = createContainer();
 * const query = await container.locationService.resolveQuery({
 *   city: "Karachi",
 *   allowInteractiveSetup: false,
 * });
 * ```
 */

// Public API exports
export { createContainer } from "./container.js";
export type { AppContainer } from "./container.js";

// Types
export type {
	PrayerTimings,
	PrayerData,
	PrayerMeta,
	HijriDate,
	GregorianDate,
	NextPrayerData,
	CalculationMethod,
	MethodsResponse,
	QiblaData,
} from "./types/prayer.js";
export type { GeoLocation, CityCountryGuess } from "./types/geo.js";
export type {
	RamadanRow,
	RamadanOutput,
	HighlightState,
	RamadanQuery,
} from "./types/ramadan.js";
export type {
	RamadanConfigStore,
	StoredLocation,
	StoredPrayerSettings,
} from "./types/config.js";
export type {
	NotificationEvent,
	NotificationPreferences,
} from "./types/notification.js";
export type { CommandContext, ICommand } from "./types/command.js";

// Errors
export {
	AppError,
	ApiError,
	ApiValidationError,
	ApiNetworkError,
	GeoLocationError,
	GeoProviderError,
	ConfigError,
	ConfigValidationError,
	PrayerTimeFetchError,
	RamadanCalendarError,
	RozaNotFoundError,
	NotificationError,
	NotificationPermissionError,
} from "./errors/index.js";

// Branded types
export {
	toLatitude,
	toLongitude,
	toMethodId,
	toSchoolId,
	toRozaNumber,
} from "./types/branded.js";
export type {
	Latitude,
	Longitude,
	MethodId,
	SchoolId,
	RozaNumber,
} from "./types/branded.js";

// Recommendations
export {
	getRecommendedMethod,
	getRecommendedSchool,
} from "./data/recommendations.js";

// Utilities
export { to12HourTime } from "./utils/time.js";
export { getRozaNumberFromStartDate } from "./utils/date.js";
export { normalizeCityAlias } from "./data/city-aliases.js";
