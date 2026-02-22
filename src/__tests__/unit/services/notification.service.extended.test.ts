import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { I18nService } from "../../../services/i18n.service.js";
import { NotificationService } from "../../../services/notification.service.js";
import type { NotificationEvent, NotificationPreferences } from "../../../types/notification.js";
import { createMockConfigRepository } from "../../helpers/mocks.js";

vi.mock("node-notifier", () => ({
	default: {
		notify: vi.fn(),
	},
}));

const createMockI18nService = (): {
	[K in keyof I18nService]: ReturnType<typeof vi.fn>;
} => ({
	t: vi.fn().mockImplementation((key: string) => key),
	getLocale: vi.fn().mockReturnValue("en"),
	init: vi.fn(),
	isSupportedLocale: vi.fn().mockReturnValue(true),
	changeLocale: vi.fn(),
});

const enabledPrefs: NotificationPreferences = {
	enabled: true,
	seharReminder: true,
	iftarReminder: true,
	reminderMinutesBefore: 15,
};

const disabledPrefs: NotificationPreferences = {
	enabled: false,
	seharReminder: true,
	iftarReminder: true,
	reminderMinutesBefore: 15,
};

describe("NotificationService (extended)", () => {
	let configRepo: ReturnType<typeof createMockConfigRepository>;
	let i18nService: ReturnType<typeof createMockI18nService>;
	let service: NotificationService;

	beforeEach(() => {
		vi.useFakeTimers();
		configRepo = createMockConfigRepository();
		i18nService = createMockI18nService();
		service = new NotificationService(
			configRepo as unknown as ConstructorParameters<typeof NotificationService>[0],
			i18nService as unknown as I18nService,
		);
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	describe("scheduleSeharReminder", () => {
		it("schedules a timeout when sehar time is in the future", () => {
			configRepo.getNotificationPreferences.mockReturnValue(enabledPrefs);

			const now = new Date();
			const seharTime = new Date(now.getTime() + 30 * 60 * 1000); // 30 min from now

			const listener = vi.fn();
			service.on(listener);

			service.scheduleSeharReminder(seharTime, 10);

			// The reminder should fire 10 min before sehar, so 20 min from now
			expect(listener).not.toHaveBeenCalled();

			vi.advanceTimersByTime(20 * 60 * 1000);

			expect(listener).toHaveBeenCalledTimes(1);
			expect(listener).toHaveBeenCalledWith(
				expect.objectContaining({
					type: "reminder",
					title: "notification.seharReminder",
					message: "notification.seharIn",
				}),
			);
		});

		it("calls i18nService.t with correct keys and parameters", () => {
			configRepo.getNotificationPreferences.mockReturnValue(enabledPrefs);

			const now = new Date();
			const seharTime = new Date(now.getTime() + 30 * 60 * 1000);

			service.on(vi.fn());
			service.scheduleSeharReminder(seharTime, 10);

			vi.advanceTimersByTime(20 * 60 * 1000);

			expect(i18nService.t).toHaveBeenCalledWith("notification.seharReminder");
			expect(i18nService.t).toHaveBeenCalledWith("notification.seharIn", { minutes: 10 });
		});

		it("skips scheduling when sehar time is in the past", () => {
			configRepo.getNotificationPreferences.mockReturnValue(enabledPrefs);

			const now = new Date();
			const seharTime = new Date(now.getTime() - 30 * 60 * 1000); // 30 min ago

			const listener = vi.fn();
			service.on(listener);

			service.scheduleSeharReminder(seharTime, 10);

			vi.advanceTimersByTime(60 * 60 * 1000);

			expect(listener).not.toHaveBeenCalled();
		});

		it("skips scheduling when reminder time minus minutesBefore is in the past", () => {
			configRepo.getNotificationPreferences.mockReturnValue(enabledPrefs);

			const now = new Date();
			// sehar is 5 min from now, but we want reminder 10 min before => reminderTime is 5 min ago
			const seharTime = new Date(now.getTime() + 5 * 60 * 1000);

			const listener = vi.fn();
			service.on(listener);

			service.scheduleSeharReminder(seharTime, 10);

			vi.advanceTimersByTime(60 * 60 * 1000);

			expect(listener).not.toHaveBeenCalled();
		});

		it("skips scheduling when notifications are disabled", () => {
			configRepo.getNotificationPreferences.mockReturnValue(disabledPrefs);

			const now = new Date();
			const seharTime = new Date(now.getTime() + 30 * 60 * 1000);

			const listener = vi.fn();
			service.on(listener);

			service.scheduleSeharReminder(seharTime, 10);

			vi.advanceTimersByTime(30 * 60 * 1000);

			expect(listener).not.toHaveBeenCalled();
		});

		it("skips scheduling when seharReminder preference is false", () => {
			configRepo.getNotificationPreferences.mockReturnValue({
				...enabledPrefs,
				seharReminder: false,
			});

			const now = new Date();
			const seharTime = new Date(now.getTime() + 30 * 60 * 1000);

			const listener = vi.fn();
			service.on(listener);

			service.scheduleSeharReminder(seharTime, 10);

			vi.advanceTimersByTime(30 * 60 * 1000);

			expect(listener).not.toHaveBeenCalled();
		});

		it("does not fire before the scheduled delay", () => {
			configRepo.getNotificationPreferences.mockReturnValue(enabledPrefs);

			const now = new Date();
			const seharTime = new Date(now.getTime() + 30 * 60 * 1000);

			const listener = vi.fn();
			service.on(listener);

			service.scheduleSeharReminder(seharTime, 10);

			// Advance 19 minutes (1 minute short of the 20-minute delay)
			vi.advanceTimersByTime(19 * 60 * 1000);

			expect(listener).not.toHaveBeenCalled();

			// Advance the remaining 1 minute
			vi.advanceTimersByTime(1 * 60 * 1000);

			expect(listener).toHaveBeenCalledTimes(1);
		});
	});

	describe("scheduleIftarReminder", () => {
		it("schedules a timeout when iftar time is in the future", () => {
			configRepo.getNotificationPreferences.mockReturnValue(enabledPrefs);

			const now = new Date();
			const iftarTime = new Date(now.getTime() + 60 * 60 * 1000); // 60 min from now

			const listener = vi.fn();
			service.on(listener);

			service.scheduleIftarReminder(iftarTime, 15);

			expect(listener).not.toHaveBeenCalled();

			// The reminder fires 15 min before iftar, so 45 min from now
			vi.advanceTimersByTime(45 * 60 * 1000);

			expect(listener).toHaveBeenCalledTimes(1);
			expect(listener).toHaveBeenCalledWith(
				expect.objectContaining({
					type: "reminder",
					title: "notification.iftarReminder",
					message: "notification.iftarIn",
				}),
			);
		});

		it("calls i18nService.t with correct keys and parameters", () => {
			configRepo.getNotificationPreferences.mockReturnValue(enabledPrefs);

			const now = new Date();
			const iftarTime = new Date(now.getTime() + 60 * 60 * 1000);

			service.on(vi.fn());
			service.scheduleIftarReminder(iftarTime, 15);

			vi.advanceTimersByTime(45 * 60 * 1000);

			expect(i18nService.t).toHaveBeenCalledWith("notification.iftarReminder");
			expect(i18nService.t).toHaveBeenCalledWith("notification.iftarIn", { minutes: 15 });
		});

		it("skips scheduling when iftar time is in the past", () => {
			configRepo.getNotificationPreferences.mockReturnValue(enabledPrefs);

			const now = new Date();
			const iftarTime = new Date(now.getTime() - 60 * 60 * 1000); // 60 min ago

			const listener = vi.fn();
			service.on(listener);

			service.scheduleIftarReminder(iftarTime, 15);

			vi.advanceTimersByTime(2 * 60 * 60 * 1000);

			expect(listener).not.toHaveBeenCalled();
		});

		it("skips scheduling when reminder time minus minutesBefore is in the past", () => {
			configRepo.getNotificationPreferences.mockReturnValue(enabledPrefs);

			const now = new Date();
			// iftar is 5 min from now, but we want reminder 15 min before => reminderTime is 10 min ago
			const iftarTime = new Date(now.getTime() + 5 * 60 * 1000);

			const listener = vi.fn();
			service.on(listener);

			service.scheduleIftarReminder(iftarTime, 15);

			vi.advanceTimersByTime(60 * 60 * 1000);

			expect(listener).not.toHaveBeenCalled();
		});

		it("skips scheduling when notifications are disabled", () => {
			configRepo.getNotificationPreferences.mockReturnValue(disabledPrefs);

			const now = new Date();
			const iftarTime = new Date(now.getTime() + 60 * 60 * 1000);

			const listener = vi.fn();
			service.on(listener);

			service.scheduleIftarReminder(iftarTime, 15);

			vi.advanceTimersByTime(60 * 60 * 1000);

			expect(listener).not.toHaveBeenCalled();
		});

		it("skips scheduling when iftarReminder preference is false", () => {
			configRepo.getNotificationPreferences.mockReturnValue({
				...enabledPrefs,
				iftarReminder: false,
			});

			const now = new Date();
			const iftarTime = new Date(now.getTime() + 60 * 60 * 1000);

			const listener = vi.fn();
			service.on(listener);

			service.scheduleIftarReminder(iftarTime, 15);

			vi.advanceTimersByTime(60 * 60 * 1000);

			expect(listener).not.toHaveBeenCalled();
		});

		it("does not fire before the scheduled delay", () => {
			configRepo.getNotificationPreferences.mockReturnValue(enabledPrefs);

			const now = new Date();
			const iftarTime = new Date(now.getTime() + 60 * 60 * 1000);

			const listener = vi.fn();
			service.on(listener);

			service.scheduleIftarReminder(iftarTime, 15);

			// Advance 44 minutes (1 minute short of the 45-minute delay)
			vi.advanceTimersByTime(44 * 60 * 1000);

			expect(listener).not.toHaveBeenCalled();

			vi.advanceTimersByTime(1 * 60 * 1000);

			expect(listener).toHaveBeenCalledTimes(1);
		});
	});

	describe("notify with enabled/disabled", () => {
		it("does not emit to listeners when notifications are disabled", async () => {
			configRepo.getNotificationPreferences.mockReturnValue(disabledPrefs);

			const listener = vi.fn();
			service.on(listener);

			const event: NotificationEvent = {
				type: "iftar",
				title: "Iftar Time",
				message: "Time to break fast",
				scheduledAt: new Date(),
			};

			await service.notify(event);

			expect(listener).not.toHaveBeenCalled();
		});

		it("emits to listeners when notifications are enabled", async () => {
			configRepo.getNotificationPreferences.mockReturnValue(enabledPrefs);

			const listener = vi.fn();
			service.on(listener);

			const event: NotificationEvent = {
				type: "sehar",
				title: "Sehar Time",
				message: "Time for suhoor",
				scheduledAt: new Date(),
			};

			await service.notify(event);

			expect(listener).toHaveBeenCalledTimes(1);
			expect(listener).toHaveBeenCalledWith(event);
		});

		it("calls node-notifier when enabled", async () => {
			configRepo.getNotificationPreferences.mockReturnValue(enabledPrefs);

			const notifier = await import("node-notifier");

			const event: NotificationEvent = {
				type: "iftar",
				title: "Iftar!",
				message: "Break your fast",
				scheduledAt: new Date(),
			};

			await service.notify(event);

			expect(notifier.default.notify).toHaveBeenCalledWith({
				title: "Iftar!",
				message: "Break your fast",
			});
		});

		it("does not call node-notifier when disabled", async () => {
			configRepo.getNotificationPreferences.mockReturnValue(disabledPrefs);

			const notifier = await import("node-notifier");
			(notifier.default.notify as ReturnType<typeof vi.fn>).mockClear();

			const event: NotificationEvent = {
				type: "iftar",
				title: "Iftar!",
				message: "Break your fast",
				scheduledAt: new Date(),
			};

			await service.notify(event);

			expect(notifier.default.notify).not.toHaveBeenCalled();
		});
	});

	describe("multiple listeners", () => {
		it("all registered listeners receive the notification event", async () => {
			configRepo.getNotificationPreferences.mockReturnValue(enabledPrefs);

			const listener1 = vi.fn();
			const listener2 = vi.fn();
			const listener3 = vi.fn();

			service.on(listener1);
			service.on(listener2);
			service.on(listener3);

			const event: NotificationEvent = {
				type: "reminder",
				title: "Reminder",
				message: "Coming up",
				scheduledAt: new Date(),
			};

			await service.notify(event);

			expect(listener1).toHaveBeenCalledWith(event);
			expect(listener2).toHaveBeenCalledWith(event);
			expect(listener3).toHaveBeenCalledWith(event);
		});
	});

	describe("unsubscribe behavior", () => {
		it("removes listener from future events after unsubscribe", async () => {
			configRepo.getNotificationPreferences.mockReturnValue(enabledPrefs);

			const listener = vi.fn();
			const unsubscribe = service.on(listener);

			const event1: NotificationEvent = {
				type: "sehar",
				title: "First",
				message: "First notification",
				scheduledAt: new Date(),
			};

			await service.notify(event1);
			expect(listener).toHaveBeenCalledTimes(1);

			unsubscribe();

			const event2: NotificationEvent = {
				type: "iftar",
				title: "Second",
				message: "Second notification",
				scheduledAt: new Date(),
			};

			await service.notify(event2);
			expect(listener).toHaveBeenCalledTimes(1); // Still 1, not called again
		});

		it("unsubscribing one listener does not affect other listeners", async () => {
			configRepo.getNotificationPreferences.mockReturnValue(enabledPrefs);

			const listener1 = vi.fn();
			const listener2 = vi.fn();

			const unsub1 = service.on(listener1);
			service.on(listener2);

			unsub1();

			const event: NotificationEvent = {
				type: "reminder",
				title: "Test",
				message: "Test message",
				scheduledAt: new Date(),
			};

			await service.notify(event);

			expect(listener1).not.toHaveBeenCalled();
			expect(listener2).toHaveBeenCalledWith(event);
		});

		it("unsubscribing the same listener twice is safe", async () => {
			configRepo.getNotificationPreferences.mockReturnValue(enabledPrefs);

			const listener = vi.fn();
			const unsubscribe = service.on(listener);

			unsubscribe();
			unsubscribe(); // Should not throw

			const event: NotificationEvent = {
				type: "sehar",
				title: "Test",
				message: "Test",
				scheduledAt: new Date(),
			};

			await service.notify(event);
			expect(listener).not.toHaveBeenCalled();
		});
	});

	describe("notify when node-notifier throws", () => {
		it("silently catches when node-notifier import fails", async () => {
			configRepo.getNotificationPreferences.mockReturnValue(enabledPrefs);

			// Override the node-notifier mock to throw an error
			const notifier = await import("node-notifier");
			(notifier.default.notify as ReturnType<typeof vi.fn>).mockImplementation(() => {
				throw new Error("node-notifier unavailable");
			});

			const listener = vi.fn();
			service.on(listener);

			const event: NotificationEvent = {
				type: "sehar",
				title: "Sehar Time",
				message: "Time for suhoor",
				scheduledAt: new Date(),
			};

			// Should not throw — the catch block on line 100 handles it silently
			await expect(service.notify(event)).resolves.toBeUndefined();

			// The listener should still have been called (emit happens before the try/catch)
			expect(listener).toHaveBeenCalledWith(event);
		});
	});

	describe("scheduled reminders fire notify correctly", () => {
		it("sehar reminder fires notify which emits to listeners", async () => {
			configRepo.getNotificationPreferences.mockReturnValue(enabledPrefs);

			const now = new Date();
			const seharTime = new Date(now.getTime() + 30 * 60 * 1000);

			const listener = vi.fn();
			service.on(listener);

			service.scheduleSeharReminder(seharTime, 10);

			// Advance past the scheduled time (20 min delay)
			await vi.advanceTimersByTimeAsync(20 * 60 * 1000);

			expect(listener).toHaveBeenCalledTimes(1);
			expect(listener).toHaveBeenCalledWith(
				expect.objectContaining({
					type: "reminder",
					title: "notification.seharReminder",
					message: "notification.seharIn",
				}),
			);
		});

		it("iftar reminder fires notify which emits to listeners", async () => {
			configRepo.getNotificationPreferences.mockReturnValue(enabledPrefs);

			const now = new Date();
			const iftarTime = new Date(now.getTime() + 60 * 60 * 1000);

			const listener = vi.fn();
			service.on(listener);

			service.scheduleIftarReminder(iftarTime, 15);

			// Advance past the scheduled time (45 min delay)
			await vi.advanceTimersByTimeAsync(45 * 60 * 1000);

			expect(listener).toHaveBeenCalledTimes(1);
			expect(listener).toHaveBeenCalledWith(
				expect.objectContaining({
					type: "reminder",
					title: "notification.iftarReminder",
					message: "notification.iftarIn",
				}),
			);
		});
	});
});
