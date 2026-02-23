import { vi } from "vitest";
import type { IGeoProvider } from "../../providers/geo/geo-provider.interface.js";
import type { IGeocodingProvider } from "../../providers/geocoding/geocoding.interface.js";
import type { CacheRepository } from "../../repositories/cache.repository.js";
import type { ConfigRepository } from "../../repositories/config.repository.js";
import type { PrayerApiRepository } from "../../repositories/prayer-api.repository.js";
import type { StoredLocation, StoredPrayerSettings } from "../../types/config.js";
import type { CityCountryGuess, GeoLocation } from "../../types/geo.js";
import type { PrayerData } from "../../types/prayer.js";

export const createMockConfigRepository = (): {
	[K in keyof ConfigRepository]: ReturnType<typeof vi.fn>;
} => ({
	getStoredLocation: vi.fn().mockReturnValue({}),
	hasStoredLocation: vi.fn().mockReturnValue(false),
	getStoredPrayerSettings: vi.fn().mockReturnValue({ method: 2, school: 0 }),
	setStoredLocation: vi.fn(),
	setStoredTimezone: vi.fn(),
	setStoredMethod: vi.fn(),
	setStoredSchool: vi.fn(),
	getStoredFirstRozaDate: vi.fn().mockReturnValue(undefined),
	setStoredFirstRozaDate: vi.fn(),
	clearStoredFirstRozaDate: vi.fn(),
	getStoredLocale: vi.fn().mockReturnValue(undefined),
	setStoredLocale: vi.fn(),
	getNotificationPreferences: vi.fn().mockReturnValue({
		enabled: false,
		seharReminder: true,
		iftarReminder: true,
		reminderMinutesBefore: 15,
	}),
	setNotificationPreferences: vi.fn(),
	getStoredTheme: vi.fn().mockReturnValue(undefined),
	setStoredTheme: vi.fn(),
	clearAll: vi.fn(),
	shouldApplyRecommendedMethod: vi.fn().mockReturnValue(true),
	shouldApplyRecommendedSchool: vi.fn().mockReturnValue(true),
	saveAutoDetectedSetup: vi.fn(),
	applyRecommendedSettingsIfUnset: vi.fn(),
});

export const createMockGeoProvider = (
	name: string,
	result: GeoLocation | null = null,
): IGeoProvider => ({
	name,
	priority: 1,
	detect: vi.fn().mockResolvedValue(result),
});

export const createMockGeocodingProvider = (
	result: CityCountryGuess | null = null,
): IGeocodingProvider => ({
	search: vi.fn().mockResolvedValue(result),
});

export const createMockCacheRepository = (): {
	[K in keyof CacheRepository]: ReturnType<typeof vi.fn>;
} => ({
	get: vi.fn().mockReturnValue(null),
	set: vi.fn(),
	delete: vi.fn().mockReturnValue(false),
	clear: vi.fn(),
	pruneExpired: vi.fn().mockReturnValue(0),
});
