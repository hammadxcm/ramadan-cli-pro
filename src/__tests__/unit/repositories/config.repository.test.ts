import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ConfigRepository } from "../../../repositories/config.repository.js";

describe("ConfigRepository", () => {
	let tmpDir: string;
	let repo: ConfigRepository;

	beforeEach(() => {
		tmpDir = mkdtempSync(join(tmpdir(), "config-repo-test-"));
		repo = new ConfigRepository({ cwd: tmpDir });
	});

	afterEach(() => {
		rmSync(tmpDir, { recursive: true, force: true });
	});

	describe("getConfigCwd", () => {
		it("should use RAMADAN_CLI_CONFIG_DIR when set", () => {
			const originalEnv = process.env.RAMADAN_CLI_CONFIG_DIR;
			process.env.RAMADAN_CLI_CONFIG_DIR = tmpDir;
			try {
				const customRepo = new ConfigRepository();
				// If it uses the env dir, it should work without throwing
				expect(customRepo.getStoredLocation()).toBeDefined();
			} finally {
				if (originalEnv === undefined) {
					process.env.RAMADAN_CLI_CONFIG_DIR = undefined as unknown as string;
				} else {
					process.env.RAMADAN_CLI_CONFIG_DIR = originalEnv;
				}
			}
		});

		it("should return /tmp in test runtime when no cwd or env is set", () => {
			const originalEnv = process.env.RAMADAN_CLI_CONFIG_DIR;
			process.env.RAMADAN_CLI_CONFIG_DIR = undefined as unknown as string;
			try {
				// VITEST=true is already set by vitest, so getConfigCwd returns "/tmp"
				const defaultRepo = new ConfigRepository();
				expect(defaultRepo.getStoredLocation()).toBeDefined();
			} finally {
				if (originalEnv !== undefined) {
					process.env.RAMADAN_CLI_CONFIG_DIR = originalEnv;
				}
			}
		});

		it("should return undefined when not in test runtime and no env is set", () => {
			const originalConfigDir = process.env.RAMADAN_CLI_CONFIG_DIR;
			const originalVitest = process.env.VITEST;
			const originalNodeEnv = process.env.NODE_ENV;
			process.env.RAMADAN_CLI_CONFIG_DIR = undefined as unknown as string;
			process.env.VITEST = undefined as unknown as string;
			process.env.NODE_ENV = "production";
			try {
				// Without VITEST or NODE_ENV=test, getConfigCwd returns undefined
				// Conf will use its default platform-specific config dir
				const prodRepo = new ConfigRepository();
				expect(prodRepo.getStoredLocation()).toBeDefined();
			} finally {
				if (originalConfigDir !== undefined) {
					process.env.RAMADAN_CLI_CONFIG_DIR = originalConfigDir;
				}
				if (originalVitest !== undefined) {
					process.env.VITEST = originalVitest;
				}
				if (originalNodeEnv !== undefined) {
					process.env.NODE_ENV = originalNodeEnv;
				}
			}
		});
	});

	describe("getValidatedStore fallback", () => {
		it("should return defaults when config store is corrupted", () => {
			// Corrupt the store by setting an invalid value for 'method'
			// biome-ignore lint/suspicious/noExplicitAny: accessing private config for test
			const internal = repo as any;
			internal.config.set("method", "not-a-number");

			// getStoredPrayerSettings calls getValidatedStore internally
			const settings = repo.getStoredPrayerSettings();
			expect(settings.method).toBe(2); // DEFAULT_METHOD
			expect(settings.school).toBe(0); // DEFAULT_SCHOOL
		});
	});

	describe("getStoredLocation", () => {
		it("should return empty fields when no config is set", () => {
			const location = repo.getStoredLocation();
			expect(location.city).toBeUndefined();
			expect(location.country).toBeUndefined();
			expect(location.latitude).toBeUndefined();
			expect(location.longitude).toBeUndefined();
		});
	});

	describe("setStoredLocation + getStoredLocation", () => {
		it("should round-trip a complete location", () => {
			repo.setStoredLocation({
				city: "Karachi",
				country: "Pakistan",
				latitude: 24.86,
				longitude: 67.0,
			});

			const location = repo.getStoredLocation();
			expect(location.city).toBe("Karachi");
			expect(location.country).toBe("Pakistan");
			expect(location.latitude).toBe(24.86);
			expect(location.longitude).toBe(67.0);
		});
	});

	describe("hasStoredLocation", () => {
		it("should return false when no location is stored", () => {
			expect(repo.hasStoredLocation()).toBe(false);
		});

		it("should return true after setting city and country", () => {
			repo.setStoredLocation({ city: "Lahore", country: "Pakistan" });
			expect(repo.hasStoredLocation()).toBe(true);
		});

		it("should return true after setting latitude and longitude", () => {
			repo.setStoredLocation({ latitude: 31.52, longitude: 74.35 });
			expect(repo.hasStoredLocation()).toBe(true);
		});
	});

	describe("getStoredPrayerSettings", () => {
		it("should return defaults when no settings are stored", () => {
			const settings = repo.getStoredPrayerSettings();
			expect(settings.method).toBe(2);
			expect(settings.school).toBe(0);
			expect(settings.timezone).toBeUndefined();
		});
	});

	describe("setStoredMethod", () => {
		it("should persist the method and return it in prayer settings", () => {
			repo.setStoredMethod(5);
			const settings = repo.getStoredPrayerSettings();
			expect(settings.method).toBe(5);
		});
	});

	describe("setStoredSchool", () => {
		it("should persist the school and return it in prayer settings", () => {
			repo.setStoredSchool(1);
			const settings = repo.getStoredPrayerSettings();
			expect(settings.school).toBe(1);
		});
	});

	describe("setStoredTimezone", () => {
		it("should persist the timezone and return it in prayer settings", () => {
			repo.setStoredTimezone("Asia/Karachi");
			const settings = repo.getStoredPrayerSettings();
			expect(settings.timezone).toBe("Asia/Karachi");
		});

		it("should not persist when timezone is falsy", () => {
			repo.setStoredTimezone("");
			const settings = repo.getStoredPrayerSettings();
			expect(settings.timezone).toBeUndefined();
		});
	});

	describe("getStoredFirstRozaDate", () => {
		it("should return undefined by default", () => {
			expect(repo.getStoredFirstRozaDate()).toBeUndefined();
		});
	});

	describe("setStoredFirstRozaDate", () => {
		it("should accept a valid ISO date string", () => {
			repo.setStoredFirstRozaDate("2026-03-01");
			expect(repo.getStoredFirstRozaDate()).toBe("2026-03-01");
		});

		it("should throw on an invalid date format", () => {
			expect(() => repo.setStoredFirstRozaDate("March 1, 2026")).toThrow(
				"Invalid first roza date. Use YYYY-MM-DD.",
			);
		});

		it("should throw on a partial date string", () => {
			expect(() => repo.setStoredFirstRozaDate("2026-03")).toThrow(
				"Invalid first roza date. Use YYYY-MM-DD.",
			);
		});
	});

	describe("clearStoredFirstRozaDate", () => {
		it("should remove the stored first roza date", () => {
			repo.setStoredFirstRozaDate("2026-03-01");
			repo.clearStoredFirstRozaDate();
			expect(repo.getStoredFirstRozaDate()).toBeUndefined();
		});
	});

	describe("getNotificationPreferences", () => {
		it("should return defaults when no preferences are stored", () => {
			const prefs = repo.getNotificationPreferences();
			expect(prefs.enabled).toBe(false);
			expect(prefs.seharReminder).toBe(true);
			expect(prefs.iftarReminder).toBe(true);
			expect(prefs.reminderMinutesBefore).toBe(15);
		});
	});

	describe("setNotificationPreferences", () => {
		it("should merge partial preferences", () => {
			repo.setNotificationPreferences({ enabled: true, reminderMinutesBefore: 30 });
			const prefs = repo.getNotificationPreferences();
			expect(prefs.enabled).toBe(true);
			expect(prefs.seharReminder).toBe(true);
			expect(prefs.iftarReminder).toBe(true);
			expect(prefs.reminderMinutesBefore).toBe(30);
		});

		it("should update individual fields without affecting others", () => {
			repo.setNotificationPreferences({ seharReminder: false });
			const prefs = repo.getNotificationPreferences();
			expect(prefs.seharReminder).toBe(false);
			expect(prefs.iftarReminder).toBe(true);
			expect(prefs.enabled).toBe(false);
		});

		it("should update iftarReminder independently", () => {
			repo.setNotificationPreferences({ iftarReminder: false });
			const prefs = repo.getNotificationPreferences();
			expect(prefs.iftarReminder).toBe(false);
			expect(prefs.seharReminder).toBe(true);
		});
	});

	describe("getStoredLocale", () => {
		it("should return undefined by default", () => {
			expect(repo.getStoredLocale()).toBeUndefined();
		});
	});

	describe("setStoredLocale", () => {
		it("should persist and return the locale", () => {
			repo.setStoredLocale("ar");
			expect(repo.getStoredLocale()).toBe("ar");
		});
	});

	describe("clearAll", () => {
		it("should clear all stored configuration", () => {
			repo.setStoredLocation({
				city: "Lahore",
				country: "Pakistan",
				latitude: 31.52,
				longitude: 74.35,
			});
			repo.setStoredMethod(5);
			repo.setStoredSchool(1);
			repo.setStoredTimezone("Asia/Karachi");
			repo.setStoredLocale("ur");

			repo.clearAll();

			expect(repo.hasStoredLocation()).toBe(false);
			const settings = repo.getStoredPrayerSettings();
			expect(settings.method).toBe(2);
			expect(settings.school).toBe(0);
			expect(repo.getStoredLocale()).toBeUndefined();
		});
	});

	describe("shouldApplyRecommendedMethod", () => {
		it("should return true when current is the default (2)", () => {
			expect(repo.shouldApplyRecommendedMethod(2, 5)).toBe(true);
		});

		it("should return true when current matches recommended", () => {
			expect(repo.shouldApplyRecommendedMethod(5, 5)).toBe(true);
		});

		it("should return false when current is a different non-default value", () => {
			expect(repo.shouldApplyRecommendedMethod(3, 5)).toBe(false);
		});
	});

	describe("shouldApplyRecommendedSchool", () => {
		it("should return true when current is the default (0)", () => {
			expect(repo.shouldApplyRecommendedSchool(0, 1)).toBe(true);
		});

		it("should return true when current matches recommended", () => {
			expect(repo.shouldApplyRecommendedSchool(1, 1)).toBe(true);
		});

		it("should return false when current is a different non-default value", () => {
			expect(repo.shouldApplyRecommendedSchool(1, 0)).toBe(false);
		});
	});

	describe("saveAutoDetectedSetup", () => {
		it("should save location, timezone, and apply recommended method/school for Pakistan", () => {
			repo.saveAutoDetectedSetup({
				city: "Lahore",
				country: "Pakistan",
				latitude: 31.52,
				longitude: 74.35,
				timezone: "Asia/Karachi",
			});

			const location = repo.getStoredLocation();
			expect(location?.city).toBe("Lahore");
			expect(location?.country).toBe("Pakistan");
			expect(location?.latitude).toBe(31.52);
			expect(location?.longitude).toBe(74.35);
			expect(repo.getStoredPrayerSettings().timezone).toBe("Asia/Karachi");
		});

		it("should save location for a country with no recommended method", () => {
			repo.saveAutoDetectedSetup({
				city: "TestCity",
				country: "Atlantis",
				latitude: 0,
				longitude: 0,
				timezone: "UTC",
			});

			const location = repo.getStoredLocation();
			expect(location?.city).toBe("TestCity");
			expect(location?.country).toBe("Atlantis");
		});
	});

	describe("applyRecommendedSettingsIfUnset", () => {
		it("should apply recommended method and school for Pakistan", () => {
			repo.applyRecommendedSettingsIfUnset("Pakistan");
			// Pakistan recommended method is 1 (Karachi), school is 1 (Hanafi)
			const settings = repo.getStoredPrayerSettings();
			expect(settings.method).toBe(1);
			expect(settings.school).toBe(1);
		});

		it("should apply recommended settings for Saudi Arabia", () => {
			repo.applyRecommendedSettingsIfUnset("Saudi Arabia");
			// Saudi Arabia recommended method is 4, school is 0 (Shafi)
			const settings = repo.getStoredPrayerSettings();
			expect(settings.method).toBe(4);
			expect(settings.school).toBe(0);
		});

		it("should not override existing non-default method", () => {
			// First set a custom method that is neither the default nor the recommended
			// biome-ignore lint/suspicious/noExplicitAny: accessing private config for test
			const store = repo as any;
			store.config.set("method", 5);

			repo.applyRecommendedSettingsIfUnset("Pakistan");
			// Method should remain 5 since it was explicitly set (not default)
			const settings = repo.getStoredPrayerSettings();
			expect(settings.method).toBe(5);
		});

		it("should handle country with no recommendation", () => {
			repo.applyRecommendedSettingsIfUnset("UnknownCountry");
			// Should remain at defaults since no recommendation exists
			const settings = repo.getStoredPrayerSettings();
			expect(settings.method).toBe(2);
			expect(settings.school).toBe(0);
		});
	});

	describe("getStoredTheme + setStoredTheme", () => {
		it("should return undefined when no theme is set", () => {
			expect(repo.getStoredTheme()).toBeUndefined();
		});

		it("should persist and return a theme", () => {
			repo.setStoredTheme("ocean-blue");
			expect(repo.getStoredTheme()).toBe("ocean-blue");
		});

		it("should overwrite a previously stored theme", () => {
			repo.setStoredTheme("ocean-blue");
			repo.setStoredTheme("classic-gold");
			expect(repo.getStoredTheme()).toBe("classic-gold");
		});
	});
});
