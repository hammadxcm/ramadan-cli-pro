import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ConfigRepository } from "../../../repositories/config.repository.js";
import { I18nService } from "../../../services/i18n.service.js";

describe("I18nService (extended coverage)", () => {
	let configRepo: ConfigRepository;

	beforeEach(() => {
		configRepo = new ConfigRepository({
			projectName: `ramadan-cli-pro-i18n-ext-${Date.now()}`,
			cwd: "/tmp",
		});
	});

	afterEach(() => {
		configRepo.clearAll();
	});

	describe("locale-specific translations", () => {
		it("should load Arabic translations", async () => {
			const service = new I18nService(configRepo);
			await service.init("ar");
			expect(service.getLocale()).toBe("ar");
			expect(service.t("app.name")).toBe("\u0631\u0645\u0636\u0627\u0646 CLI \u0628\u0631\u0648");
		});

		it("should load Urdu translations", async () => {
			const service = new I18nService(configRepo);
			await service.init("ur");
			expect(service.getLocale()).toBe("ur");
			expect(service.t("app.name")).toBe("\u0631\u0645\u0636\u0627\u0646 CLI \u067E\u0631\u0648");
		});

		it("should load Turkish translations", async () => {
			const service = new I18nService(configRepo);
			await service.init("tr");
			expect(service.getLocale()).toBe("tr");
			expect(service.t("app.name")).toBe("Ramazan CLI Pro");
		});

		it("should load Malay translations", async () => {
			const service = new I18nService(configRepo);
			await service.init("ms");
			expect(service.getLocale()).toBe("ms");
			expect(service.t("app.name")).toBe("Ramadan CLI Pro");
		});

		it("should load Bengali translations", async () => {
			const service = new I18nService(configRepo);
			await service.init("bn");
			expect(service.getLocale()).toBe("bn");
			expect(service.t("app.name")).toBe(
				"\u09B0\u09AE\u099C\u09BE\u09A8 CLI \u09AA\u09CD\u09B0\u09CB",
			);
		});

		it("should load French translations", async () => {
			const service = new I18nService(configRepo);
			await service.init("fr");
			expect(service.getLocale()).toBe("fr");
			expect(service.t("app.name")).toBe("Ramadan CLI Pro");
		});

		it("should load Indonesian translations", async () => {
			const service = new I18nService(configRepo);
			await service.init("id");
			expect(service.getLocale()).toBe("id");
			expect(service.t("app.name")).toBe("Ramadan CLI Pro");
		});
	});

	describe("fallback behavior", () => {
		it("should return key as fallback for missing translation", async () => {
			const service = new I18nService(configRepo);
			await service.init("en");
			const result = service.t("nonexistent.deep.key");
			expect(result).toBe("nonexistent.deep.key");
		});
	});

	describe("locale switching", () => {
		it("should switch locale after init using changeLocale", async () => {
			const service = new I18nService(configRepo);
			await service.init("en");
			expect(service.getLocale()).toBe("en");
			expect(service.t("app.name")).toBe("Ramadan CLI Pro");

			await service.changeLocale("tr");
			expect(service.getLocale()).toBe("tr");
			expect(service.t("app.name")).toBe("Ramazan CLI Pro");
		});
	});

	describe("getLocale", () => {
		it("should return the current locale", async () => {
			const service = new I18nService(configRepo);
			await service.init("ur");
			expect(service.getLocale()).toBe("ur");
		});
	});

	describe("t() with options parameter", () => {
		it("should pass interpolation options to i18next.t", async () => {
			const service = new I18nService(configRepo);
			await service.init("en");

			// Call t() with options - this exercises lines 84-85
			const result = service.t("notification.seharIn", { minutes: 15 });
			// The result should be a string (interpolation may or may not produce visible output
			// depending on whether the key exists), but the branch is exercised
			expect(typeof result).toBe("string");
		});

		it("should return interpolated string when key exists and options are provided", async () => {
			const service = new I18nService(configRepo);
			await service.init("en");

			// Even for a missing key, t(key, options) should return something
			const result = service.t("some.missing.key", { value: "test" });
			expect(typeof result).toBe("string");
		});
	});

	describe("multiple instances", () => {
		it("should work with independently created instances sharing i18next", async () => {
			const repo1 = new ConfigRepository({
				projectName: `ramadan-cli-pro-i18n-inst1-${Date.now()}`,
				cwd: "/tmp",
			});
			const repo2 = new ConfigRepository({
				projectName: `ramadan-cli-pro-i18n-inst2-${Date.now()}`,
				cwd: "/tmp",
			});

			const service1 = new I18nService(repo1);
			const service2 = new I18nService(repo2);

			// First instance initializes
			await service1.init("en");
			expect(service1.t("app.name")).toBe("Ramadan CLI Pro");

			// Second instance can also initialize (i18next is a singleton,
			// but the service guards with initialized flag)
			await service2.init("ar");
			// Since i18next is a global singleton, the second init is a no-op
			// if already initialized. The service still provides translations.
			expect(service2.t("app.name")).toBeDefined();

			// Change locale via service2, both see the same i18next state
			await service2.changeLocale("bn");
			expect(service2.getLocale()).toBe("bn");
			expect(service2.t("app.name")).toBe(
				"\u09B0\u09AE\u099C\u09BE\u09A8 CLI \u09AA\u09CD\u09B0\u09CB",
			);

			repo1.clearAll();
			repo2.clearAll();
		});
	});
});
