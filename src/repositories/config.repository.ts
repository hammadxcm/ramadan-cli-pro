/**
 * @module repositories/config
 * @description Persistent configuration repository backed by the `conf` package.
 * Manages user preferences for location, prayer settings, locale, and notifications.
 */

import Conf from "conf";
import { getRecommendedMethod, getRecommendedSchool } from "../data/recommendations.js";
import { IsoDateSchema, SharedConfigSchema } from "../schemas/config.schema.js";
import type { RamadanConfigStore, StoredLocation, StoredPrayerSettings } from "../types/config.js";
import { DEFAULT_METHOD, DEFAULT_SCHOOL } from "../types/config.js";
import type { NotificationPreferences } from "../types/notification.js";
import { DEFAULT_NOTIFICATION_PREFERENCES } from "../types/notification.js";

/**
 * Options for constructing a {@link ConfigRepository}.
 */
export interface ConfigRepositoryOptions {
	/** Override project name (defaults to `"ramadan-cli-pro"`). */
	readonly projectName?: string | undefined;
	/** Override config directory path. */
	readonly cwd?: string | undefined;
}

/**
 * Reads and writes the user's persisted configuration via the `conf` package.
 * Also handles migration from the legacy `azaan` config store.
 *
 * @example
 * ```ts
 * const repo = new ConfigRepository();
 * repo.setStoredLocation({ city: "Karachi", country: "Pakistan", latitude: 24.86, longitude: 67.0 });
 * const loc = repo.getStoredLocation();
 * ```
 */
export class ConfigRepository {
	private readonly config: Conf<RamadanConfigStore>;
	private readonly legacyConfig: Conf<Record<string, unknown>>;

	/**
	 * @param options - Optional project name and config directory overrides.
	 */
	constructor(options?: ConfigRepositoryOptions) {
		const projectName = options?.projectName ?? "ramadan-cli-pro";
		const cwd = options?.cwd ?? this.getConfigCwd();

		this.config = new Conf<RamadanConfigStore>({
			projectName,
			...(cwd ? { cwd } : {}),
			defaults: {
				method: DEFAULT_METHOD,
				school: DEFAULT_SCHOOL,
				format24h: false,
			},
		});

		this.legacyConfig = new Conf<Record<string, unknown>>({
			projectName: "azaan",
			...(cwd ? { cwd } : {}),
		});
	}

	private getConfigCwd(): string | undefined {
		const configuredPath = process.env.RAMADAN_CLI_CONFIG_DIR;
		if (configuredPath) {
			return configuredPath;
		}

		const isTestRuntime = process.env.VITEST === "true" || process.env.NODE_ENV === "test";
		if (isTestRuntime) {
			return "/tmp";
		}

		return undefined;
	}

	private getValidatedStore(): RamadanConfigStore {
		const parsed = SharedConfigSchema.safeParse(this.config.store as unknown);
		if (!parsed.success) {
			return {
				method: DEFAULT_METHOD,
				school: DEFAULT_SCHOOL,
				format24h: false,
			};
		}
		return parsed.data;
	}

	/**
	 * Returns the stored geographic location fields.
	 *
	 * @returns The stored location (all fields may be `undefined`).
	 */
	getStoredLocation(): StoredLocation {
		const store = this.getValidatedStore();
		return {
			city: store.city,
			country: store.country,
			latitude: store.latitude,
			longitude: store.longitude,
		};
	}

	/**
	 * Checks whether a usable location (city+country or lat+lon) is stored.
	 *
	 * @returns `true` if a location is persisted.
	 */
	hasStoredLocation(): boolean {
		const location = this.getStoredLocation();
		const hasCityCountry = Boolean(location.city && location.country);
		const hasCoords = Boolean(location.latitude !== undefined && location.longitude !== undefined);
		return hasCityCountry || hasCoords;
	}

	/**
	 * Returns the stored prayer-calculation settings (method, school, timezone).
	 *
	 * @returns The stored settings with defaults applied.
	 */
	getStoredPrayerSettings(): StoredPrayerSettings {
		const store = this.getValidatedStore();
		return {
			method: store.method ?? DEFAULT_METHOD,
			school: store.school ?? DEFAULT_SCHOOL,
			timezone: store.timezone,
		};
	}

	/**
	 * Persists a geographic location to the config store.
	 *
	 * @param location - The location fields to save (only non-undefined fields are written).
	 */
	setStoredLocation(location: StoredLocation): void {
		if (location.city) {
			this.config.set("city", location.city);
		}
		if (location.country) {
			this.config.set("country", location.country);
		}
		if (location.latitude !== undefined) {
			this.config.set("latitude", location.latitude);
		}
		if (location.longitude !== undefined) {
			this.config.set("longitude", location.longitude);
		}
	}

	/**
	 * Persists a timezone string to the config store.
	 *
	 * @param timezone - IANA timezone identifier. No-op if falsy.
	 */
	setStoredTimezone(timezone?: string): void {
		if (!timezone) {
			return;
		}
		this.config.set("timezone", timezone);
	}

	/**
	 * Persists the calculation method ID.
	 *
	 * @param method - Aladhan method ID (0–23).
	 */
	setStoredMethod(method: number): void {
		this.config.set("method", method);
	}

	/**
	 * Persists the juristic school ID.
	 *
	 * @param school - Aladhan school ID (0 = Shafi, 1 = Hanafi).
	 */
	setStoredSchool(school: number): void {
		this.config.set("school", school);
	}

	/**
	 * Returns the stored first-roza-date override, if any.
	 *
	 * @returns An ISO date string (`YYYY-MM-DD`) or `undefined`.
	 */
	getStoredFirstRozaDate(): string | undefined {
		const store = this.getValidatedStore();
		return store.firstRozaDate;
	}

	/**
	 * Persists a first-roza-date override.
	 *
	 * @param firstRozaDate - An ISO date string (`YYYY-MM-DD`).
	 * @throws {Error} If the date string is not valid ISO format.
	 */
	setStoredFirstRozaDate(firstRozaDate: string): void {
		const parsed = IsoDateSchema.safeParse(firstRozaDate);
		if (!parsed.success) {
			throw new Error("Invalid first roza date. Use YYYY-MM-DD.");
		}
		this.config.set("firstRozaDate", parsed.data);
	}

	/**
	 * Removes the stored first-roza-date override.
	 */
	clearStoredFirstRozaDate(): void {
		this.config.delete("firstRozaDate");
	}

	/**
	 * Returns the stored locale string, if any.
	 *
	 * @returns A locale string (e.g. `"en"`, `"ar"`) or `undefined`.
	 */
	getStoredLocale(): string | undefined {
		const store = this.getValidatedStore();
		return store.locale;
	}

	/**
	 * Persists a locale string.
	 *
	 * @param locale - Locale identifier (e.g. `"en"`, `"ar"`, `"ur"`).
	 */
	setStoredLocale(locale: string): void {
		this.config.set("locale", locale);
	}

	/**
	 * Returns the stored notification preferences with defaults applied.
	 *
	 * @returns The merged notification preferences.
	 */
	getNotificationPreferences(): NotificationPreferences {
		const store = this.getValidatedStore();
		return {
			enabled: store.notificationsEnabled ?? DEFAULT_NOTIFICATION_PREFERENCES.enabled,
			seharReminder: store.notifySehar ?? DEFAULT_NOTIFICATION_PREFERENCES.seharReminder,
			iftarReminder: store.notifyIftar ?? DEFAULT_NOTIFICATION_PREFERENCES.iftarReminder,
			reminderMinutesBefore:
				store.notifyMinutesBefore ?? DEFAULT_NOTIFICATION_PREFERENCES.reminderMinutesBefore,
		};
	}

	/**
	 * Persists notification preference overrides.
	 *
	 * @param prefs - Partial notification preferences to merge.
	 */
	setNotificationPreferences(prefs: Partial<NotificationPreferences>): void {
		if (prefs.enabled !== undefined) {
			this.config.set("notificationsEnabled", prefs.enabled);
		}
		if (prefs.seharReminder !== undefined) {
			this.config.set("notifySehar", prefs.seharReminder);
		}
		if (prefs.iftarReminder !== undefined) {
			this.config.set("notifyIftar", prefs.iftarReminder);
		}
		if (prefs.reminderMinutesBefore !== undefined) {
			this.config.set("notifyMinutesBefore", prefs.reminderMinutesBefore);
		}
	}

	/**
	 * Returns the stored theme identifier, if any.
	 *
	 * @returns A theme ID string or `undefined`.
	 */
	getStoredTheme(): string | undefined {
		const store = this.getValidatedStore();
		return store.theme;
	}

	/**
	 * Persists a theme identifier.
	 *
	 * @param theme - Theme ID string.
	 */
	setStoredTheme(theme: string): void {
		this.config.set("theme", theme);
	}

	/**
	 * Clears all configuration, including legacy config.
	 */
	clearAll(): void {
		this.config.clear();
		this.legacyConfig.clear();
	}

	/**
	 * Determines whether the recommended method should override the current one.
	 *
	 * @param currentMethod - Currently stored method ID.
	 * @param recommendedMethod - Recommended method ID for the country.
	 * @returns `true` if the recommended method should be applied.
	 */
	shouldApplyRecommendedMethod(currentMethod: number, recommendedMethod: number): boolean {
		return currentMethod === DEFAULT_METHOD || currentMethod === recommendedMethod;
	}

	/**
	 * Determines whether the recommended school should override the current one.
	 *
	 * @param currentSchool - Currently stored school ID.
	 * @param recommendedSchool - Recommended school ID for the country.
	 * @returns `true` if the recommended school should be applied.
	 */
	shouldApplyRecommendedSchool(currentSchool: number, recommendedSchool: number): boolean {
		return currentSchool === DEFAULT_SCHOOL || currentSchool === recommendedSchool;
	}

	/**
	 * Saves a complete auto-detected location and applies recommended method/school.
	 *
	 * @param location - The auto-detected location with all fields populated.
	 */
	saveAutoDetectedSetup(location: {
		city: string;
		country: string;
		latitude: number;
		longitude: number;
		timezone: string;
	}): void {
		this.setStoredLocation({
			city: location.city,
			country: location.country,
			latitude: location.latitude,
			longitude: location.longitude,
		});
		this.setStoredTimezone(location.timezone);

		const recommendedMethod = getRecommendedMethod(location.country);
		if (recommendedMethod !== null) {
			const currentMethod = this.config.get("method") ?? DEFAULT_METHOD;
			if (this.shouldApplyRecommendedMethod(currentMethod, recommendedMethod)) {
				this.config.set("method", recommendedMethod);
			}
		}

		const currentSchool = this.config.get("school") ?? DEFAULT_SCHOOL;
		const recommendedSchool = getRecommendedSchool(location.country);
		if (this.shouldApplyRecommendedSchool(currentSchool, recommendedSchool)) {
			this.config.set("school", recommendedSchool);
		}
	}

	/**
	 * Applies country-based recommended method and school if the current
	 * values are still at their defaults.
	 *
	 * @param country - Country name to look up recommendations for.
	 */
	applyRecommendedSettingsIfUnset(country: string): void {
		const recommendedMethod = getRecommendedMethod(country);
		if (recommendedMethod !== null) {
			const currentMethod = this.config.get("method") ?? DEFAULT_METHOD;
			if (this.shouldApplyRecommendedMethod(currentMethod, recommendedMethod)) {
				this.config.set("method", recommendedMethod);
			}
		}

		const currentSchool = this.config.get("school") ?? DEFAULT_SCHOOL;
		const recommendedSchool = getRecommendedSchool(country);
		if (this.shouldApplyRecommendedSchool(currentSchool, recommendedSchool)) {
			this.config.set("school", recommendedSchool);
		}
	}
}
