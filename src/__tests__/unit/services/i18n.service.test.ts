import { afterEach, describe, expect, it } from "vitest";
import { ConfigRepository } from "../../../repositories/config.repository.js";
import { I18nService } from "../../../services/i18n.service.js";

describe("I18nService", () => {
	const configRepo = new ConfigRepository({
		projectName: "ramadan-cli-pro-test-i18n",
		cwd: "/tmp",
	});

	afterEach(() => {
		configRepo.clearAll();
	});

	it("should initialize with default English locale", async () => {
		const service = new I18nService(configRepo);
		await service.init();
		expect(service.getLocale()).toBe("en");
	});

	it("should translate English keys", async () => {
		const service = new I18nService(configRepo);
		await service.init("en");
		expect(service.t("app.name")).toBe("Ramadan CLI Pro");
		expect(service.t("table.sehar")).toBe("Sehar");
	});

	it("should check supported locales", () => {
		const service = new I18nService(configRepo);
		expect(service.isSupportedLocale("en")).toBe(true);
		expect(service.isSupportedLocale("ar")).toBe(true);
		expect(service.isSupportedLocale("ur")).toBe(true);
		expect(service.isSupportedLocale("tr")).toBe(true);
		expect(service.isSupportedLocale("ms")).toBe(true);
		expect(service.isSupportedLocale("bn")).toBe(true);
		expect(service.isSupportedLocale("fr")).toBe(true);
		expect(service.isSupportedLocale("id")).toBe(true);
		expect(service.isSupportedLocale("xx")).toBe(false);
	});
});
