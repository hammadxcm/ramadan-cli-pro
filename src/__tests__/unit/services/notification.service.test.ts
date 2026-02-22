import { describe, expect, it, vi } from "vitest";
import type { ConfigRepository } from "../../../repositories/config.repository.js";
import type { I18nService } from "../../../services/i18n.service.js";
import { NotificationService } from "../../../services/notification.service.js";
import type { NotificationEvent } from "../../../types/notification.js";
import { createMockConfigRepository } from "../../helpers/mocks.js";

const createMockI18nService = (): {
	[K in keyof I18nService]: ReturnType<typeof vi.fn>;
} => ({
	t: vi.fn().mockImplementation((key: string) => key),
	getLocale: vi.fn().mockReturnValue("en"),
	init: vi.fn(),
	isSupportedLocale: vi.fn().mockReturnValue(true),
	changeLocale: vi.fn(),
});

describe("NotificationService", () => {
	const createService = () => {
		const configRepo = createMockConfigRepository();
		const i18nService = createMockI18nService();
		const service = new NotificationService(
			configRepo as unknown as ConfigRepository,
			i18nService as unknown as I18nService,
		);
		return { service, configRepo, i18nService };
	};

	it("getPreferences returns config values", () => {
		const { service, configRepo } = createService();
		const prefs = {
			enabled: true,
			seharReminder: true,
			iftarReminder: false,
			reminderMinutesBefore: 10,
		};
		configRepo.getNotificationPreferences.mockReturnValue(prefs);

		const result = service.getPreferences();
		expect(result).toEqual(prefs);
		expect(configRepo.getNotificationPreferences).toHaveBeenCalled();
	});

	it("setPreferences delegates to config repo", () => {
		const { service, configRepo } = createService();
		const partial = { enabled: true, reminderMinutesBefore: 20 };

		service.setPreferences(partial);
		expect(configRepo.setNotificationPreferences).toHaveBeenCalledWith(partial);
	});

	it("isEnabled returns prefs.enabled value when true", () => {
		const { service, configRepo } = createService();
		configRepo.getNotificationPreferences.mockReturnValue({
			enabled: true,
			seharReminder: true,
			iftarReminder: true,
			reminderMinutesBefore: 15,
		});

		expect(service.isEnabled()).toBe(true);
	});

	it("isEnabled returns false when prefs.enabled is false", () => {
		const { service, configRepo } = createService();
		configRepo.getNotificationPreferences.mockReturnValue({
			enabled: false,
			seharReminder: true,
			iftarReminder: true,
			reminderMinutesBefore: 15,
		});

		expect(service.isEnabled()).toBe(false);
	});

	it("on registers listener and listener is called on notify", async () => {
		const { service, configRepo } = createService();
		configRepo.getNotificationPreferences.mockReturnValue({
			enabled: true,
			seharReminder: true,
			iftarReminder: true,
			reminderMinutesBefore: 15,
		});

		const listener = vi.fn();
		service.on(listener);

		const event: NotificationEvent = {
			type: "iftar",
			title: "Iftar Time",
			message: "Time to break fast",
			scheduledAt: new Date(),
		};

		await service.notify(event);

		expect(listener).toHaveBeenCalledTimes(1);
		expect(listener).toHaveBeenCalledWith(event);
	});

	it("unsubscribe removes listener", async () => {
		const { service, configRepo } = createService();
		configRepo.getNotificationPreferences.mockReturnValue({
			enabled: true,
			seharReminder: true,
			iftarReminder: true,
			reminderMinutesBefore: 15,
		});

		const listener = vi.fn();
		const unsubscribe = service.on(listener);

		unsubscribe();

		await service.notify({
			type: "sehar",
			title: "Sehar",
			message: "Sehar time",
			scheduledAt: new Date(),
		});

		expect(listener).not.toHaveBeenCalled();
	});

	it("notify calls all registered listeners", async () => {
		const { service, configRepo } = createService();
		configRepo.getNotificationPreferences.mockReturnValue({
			enabled: true,
			seharReminder: true,
			iftarReminder: true,
			reminderMinutesBefore: 15,
		});

		const listener1 = vi.fn();
		const listener2 = vi.fn();
		const listener3 = vi.fn();

		service.on(listener1);
		service.on(listener2);
		service.on(listener3);

		const event: NotificationEvent = {
			type: "reminder",
			title: "Reminder",
			message: "Coming up soon",
			scheduledAt: new Date(),
		};

		await service.notify(event);

		expect(listener1).toHaveBeenCalledWith(event);
		expect(listener2).toHaveBeenCalledWith(event);
		expect(listener3).toHaveBeenCalledWith(event);
	});

	it("notify does not call listeners when disabled", async () => {
		const { service, configRepo } = createService();
		configRepo.getNotificationPreferences.mockReturnValue({
			enabled: false,
			seharReminder: true,
			iftarReminder: true,
			reminderMinutesBefore: 15,
		});

		const listener = vi.fn();
		service.on(listener);

		await service.notify({
			type: "iftar",
			title: "Iftar",
			message: "Time",
			scheduledAt: new Date(),
		});

		expect(listener).not.toHaveBeenCalled();
	});

	it("on returns a function", () => {
		const { service } = createService();
		const unsubscribe = service.on(vi.fn());
		expect(typeof unsubscribe).toBe("function");
	});

	it("unsubscribing one listener does not affect others", async () => {
		const { service, configRepo } = createService();
		configRepo.getNotificationPreferences.mockReturnValue({
			enabled: true,
			seharReminder: true,
			iftarReminder: true,
			reminderMinutesBefore: 15,
		});

		const listener1 = vi.fn();
		const listener2 = vi.fn();

		const unsub1 = service.on(listener1);
		service.on(listener2);

		unsub1();

		const event: NotificationEvent = {
			type: "sehar",
			title: "Sehar",
			message: "Time for sehar",
			scheduledAt: new Date(),
		};

		await service.notify(event);

		expect(listener1).not.toHaveBeenCalled();
		expect(listener2).toHaveBeenCalledWith(event);
	});
});
