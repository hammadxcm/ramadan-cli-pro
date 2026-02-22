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
});
