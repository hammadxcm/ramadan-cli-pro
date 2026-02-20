import { describe, expect, it } from "vitest";
import { createContainer } from "../../container.js";

describe("Container wiring", () => {
	const container = createContainer({ configDir: "/tmp/ramadan-cli-test-container" });

	it("creates all repositories", () => {
		expect(container.configRepository).toBeDefined();
		expect(container.prayerApiRepository).toBeDefined();
		expect(container.cacheRepository).toBeDefined();
	});

	it("creates all services", () => {
		expect(container.cacheService).toBeDefined();
		expect(container.dateService).toBeDefined();
		expect(container.timeFormatService).toBeDefined();
		expect(container.i18nService).toBeDefined();
		expect(container.locationService).toBeDefined();
		expect(container.prayerTimeService).toBeDefined();
		expect(container.highlightService).toBeDefined();
		expect(container.ramadanService).toBeDefined();
		expect(container.notificationService).toBeDefined();
	});

	it("creates all providers", () => {
		expect(container.geoProviderFactory).toBeDefined();
		expect(container.geocodingProvider).toBeDefined();
	});

	it("creates formatter factory", () => {
		expect(container.formatterFactory).toBeDefined();
	});

	it("creates first run setup", () => {
		expect(container.firstRunSetup).toBeDefined();
	});

	it("creates command factory with all commands", () => {
		expect(container.commandFactory).toBeDefined();
		expect(container.commandFactory.ramadan).toBeDefined();
		expect(container.commandFactory.config).toBeDefined();
		expect(container.commandFactory.reset).toBeDefined();
		expect(container.commandFactory.dashboard).toBeDefined();
		expect(container.commandFactory.notify).toBeDefined();
	});

	it("notification service reads preferences from config", () => {
		const prefs = container.notificationService.getPreferences();
		expect(prefs).toHaveProperty("enabled");
		expect(prefs).toHaveProperty("seharReminder");
		expect(prefs).toHaveProperty("iftarReminder");
		expect(prefs).toHaveProperty("reminderMinutesBefore");
	});
});
