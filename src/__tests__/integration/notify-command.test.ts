import { beforeEach, describe, expect, it, vi } from "vitest";
import { NotifyCommand } from "../../commands/notify.command.js";
import type { ConfigRepository } from "../../repositories/config.repository.js";
import type { I18nService } from "../../services/i18n.service.js";
import { NotificationService } from "../../services/notification.service.js";
import { DEFAULT_NOTIFICATION_PREFERENCES } from "../../types/notification.js";
import { createMockConfigRepository } from "../helpers/mocks.js";

describe("NotifyCommand + NotificationService + ConfigRepository", () => {
	const mockConfigRepo = createMockConfigRepository();
	const mockI18n: Pick<I18nService, "t"> = { t: (key: string) => key };

	let notificationService: NotificationService;
	let notifyCommand: NotifyCommand;

	beforeEach(() => {
		vi.clearAllMocks();
		mockConfigRepo.getNotificationPreferences.mockReturnValue({
			...DEFAULT_NOTIFICATION_PREFERENCES,
		});
		notificationService = new NotificationService(
			mockConfigRepo as unknown as ConfigRepository,
			mockI18n as I18nService,
		);
		notifyCommand = new NotifyCommand(notificationService);
	});

	it("--enable persists enabled=true via config repository", async () => {
		await notifyCommand.execute({ enable: true });
		expect(mockConfigRepo.setNotificationPreferences).toHaveBeenCalledWith({
			enabled: true,
		});
	});

	it("--disable persists enabled=false via config repository", async () => {
		await notifyCommand.execute({ disable: true });
		expect(mockConfigRepo.setNotificationPreferences).toHaveBeenCalledWith({
			enabled: false,
		});
	});

	it("--sehar toggles seharReminder off when currently on", async () => {
		mockConfigRepo.getNotificationPreferences.mockReturnValue({
			...DEFAULT_NOTIFICATION_PREFERENCES,
			seharReminder: true,
		});
		await notifyCommand.execute({ sehar: true });
		expect(mockConfigRepo.setNotificationPreferences).toHaveBeenCalledWith({
			seharReminder: false,
		});
	});

	it("--sehar toggles seharReminder on when currently off", async () => {
		mockConfigRepo.getNotificationPreferences.mockReturnValue({
			...DEFAULT_NOTIFICATION_PREFERENCES,
			seharReminder: false,
		});
		await notifyCommand.execute({ sehar: true });
		expect(mockConfigRepo.setNotificationPreferences).toHaveBeenCalledWith({
			seharReminder: true,
		});
	});

	it("--iftar toggles iftarReminder", async () => {
		mockConfigRepo.getNotificationPreferences.mockReturnValue({
			...DEFAULT_NOTIFICATION_PREFERENCES,
			iftarReminder: true,
		});
		await notifyCommand.execute({ iftar: true });
		expect(mockConfigRepo.setNotificationPreferences).toHaveBeenCalledWith({
			iftarReminder: false,
		});
	});

	it("--minutes persists custom reminder minutes", async () => {
		await notifyCommand.execute({ minutes: 30 });
		expect(mockConfigRepo.setNotificationPreferences).toHaveBeenCalledWith({
			reminderMinutesBefore: 30,
		});
	});

	it("--enable --sehar --minutes applies all changes", async () => {
		mockConfigRepo.getNotificationPreferences.mockReturnValue({
			...DEFAULT_NOTIFICATION_PREFERENCES,
			seharReminder: true,
		});
		await notifyCommand.execute({ enable: true, sehar: true, minutes: 20 });
		expect(mockConfigRepo.setNotificationPreferences).toHaveBeenCalledWith({ enabled: true });
		expect(mockConfigRepo.setNotificationPreferences).toHaveBeenCalledWith({
			seharReminder: false,
		});
		expect(mockConfigRepo.setNotificationPreferences).toHaveBeenCalledWith({
			reminderMinutesBefore: 20,
		});
	});

	it("--iftar toggles iftarReminder off and prints disabled message", async () => {
		mockConfigRepo.getNotificationPreferences.mockReturnValue({
			...DEFAULT_NOTIFICATION_PREFERENCES,
			iftarReminder: true,
		});
		const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
		await notifyCommand.execute({ iftar: true });
		expect(mockConfigRepo.setNotificationPreferences).toHaveBeenCalledWith({
			iftarReminder: false,
		});
		const allOutput = consoleSpy.mock.calls.map((c) => c[0]).join("\n");
		expect(allOutput).toContain("Iftar reminder disabled");
		consoleSpy.mockRestore();
	});

	it("no flags shows status without persisting anything", async () => {
		const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
		await notifyCommand.execute({});
		expect(mockConfigRepo.setNotificationPreferences).not.toHaveBeenCalled();
		expect(consoleSpy).toHaveBeenCalled();
		consoleSpy.mockRestore();
	});

	it("no flags shows disabled status when notifications are off", async () => {
		mockConfigRepo.getNotificationPreferences.mockReturnValue({
			...DEFAULT_NOTIFICATION_PREFERENCES,
			enabled: false,
			seharReminder: false,
			iftarReminder: false,
		});
		const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
		await notifyCommand.execute({});
		const allOutput = consoleSpy.mock.calls.map((c) => c[0]).join("\n");
		expect(allOutput).toContain("Notification Preferences");
		expect(allOutput).toContain("disabled");
		expect(allOutput).toContain("off");
		consoleSpy.mockRestore();
	});

	it("no flags shows enabled status with reminders on", async () => {
		mockConfigRepo.getNotificationPreferences.mockReturnValue({
			...DEFAULT_NOTIFICATION_PREFERENCES,
			enabled: true,
			seharReminder: true,
			iftarReminder: true,
			reminderMinutesBefore: 10,
		});
		const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
		await notifyCommand.execute({});
		const allOutput = consoleSpy.mock.calls.map((c) => c[0]).join("\n");
		expect(allOutput).toContain("Notification Preferences");
		expect(allOutput).toContain("enabled");
		expect(allOutput).toContain("on");
		expect(allOutput).toContain("10 min before");
		consoleSpy.mockRestore();
	});

	it("NotificationService.isEnabled reads from config", () => {
		mockConfigRepo.getNotificationPreferences.mockReturnValue({
			...DEFAULT_NOTIFICATION_PREFERENCES,
			enabled: true,
		});
		expect(notificationService.isEnabled()).toBe(true);

		mockConfigRepo.getNotificationPreferences.mockReturnValue({
			...DEFAULT_NOTIFICATION_PREFERENCES,
			enabled: false,
		});
		expect(notificationService.isEnabled()).toBe(false);
	});

	it("NotificationService.notify skips when disabled", async () => {
		mockConfigRepo.getNotificationPreferences.mockReturnValue({
			...DEFAULT_NOTIFICATION_PREFERENCES,
			enabled: false,
		});
		const listener = vi.fn();
		notificationService.on(listener);
		await notificationService.notify({
			type: "sehar",
			title: "test",
			message: "test",
			scheduledAt: new Date(),
		});
		expect(listener).not.toHaveBeenCalled();
	});

	it("NotificationService.notify emits when enabled", async () => {
		mockConfigRepo.getNotificationPreferences.mockReturnValue({
			...DEFAULT_NOTIFICATION_PREFERENCES,
			enabled: true,
		});
		const listener = vi.fn();
		notificationService.on(listener);
		const event = {
			type: "sehar" as const,
			title: "test",
			message: "test",
			scheduledAt: new Date(),
		};
		await notificationService.notify(event);
		expect(listener).toHaveBeenCalledWith(event);
	});
});
