import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TrackCommand } from "../../../commands/track.command.js";
import { ConfigRepository } from "../../../repositories/config.repository.js";

describe("TrackCommand", () => {
	let command: TrackCommand;
	let configDir: string;
	let storeDir: string;
	let configRepo: ConfigRepository;
	let logSpy: ReturnType<typeof vi.spyOn>;
	let errorSpy: ReturnType<typeof vi.spyOn>;
	let exitSpy: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		configDir = mkdtempSync(join(tmpdir(), "track-test-"));
		storeDir = mkdtempSync(join(tmpdir(), "track-store-"));
		configRepo = new ConfigRepository({ cwd: configDir });
		command = new TrackCommand(configRepo, undefined, storeDir);
		logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
		errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		exitSpy = vi.spyOn(process, "exit").mockImplementation(((code?: number) => {
			throw new Error(`process.exit(${code})`);
		}) as never) as unknown as ReturnType<typeof vi.fn>;
	});

	afterEach(() => {
		vi.restoreAllMocks();
		rmSync(configDir, { recursive: true, force: true });
		rmSync(storeDir, { recursive: true, force: true });
	});

	describe("show empty status", () => {
		it("should display all prayers as incomplete when no prayers are tracked", async () => {
			await command.execute({ show: true, date: "2026-03-01" });

			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("Prayer Tracking");
			expect(allOutput).toContain("2026-03-01");
			expect(allOutput).toContain("0/5 prayers completed");
		});

		it("should show status when no prayer is specified", async () => {
			await command.execute({ date: "2026-03-01" });

			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("Prayer Tracking");
			expect(allOutput).toContain("0/5 prayers completed");
		});
	});

	describe("marking a prayer", () => {
		it("should mark fajr as complete", async () => {
			await command.execute({ prayer: "fajr", date: "2026-03-01" });

			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("Fajr marked as complete");
			expect(allOutput).toContain("2026-03-01");
			expect(allOutput).toContain("1/5 prayers completed");
		});

		it("should mark dhuhr as complete", async () => {
			await command.execute({ prayer: "dhuhr", date: "2026-03-01" });

			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("Dhuhr marked as complete");
			expect(allOutput).toContain("1/5 prayers completed");
		});

		it("should mark asr as complete", async () => {
			await command.execute({ prayer: "asr", date: "2026-03-01" });

			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("Asr marked as complete");
		});

		it("should mark maghrib as complete", async () => {
			await command.execute({ prayer: "maghrib", date: "2026-03-01" });

			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("Maghrib marked as complete");
		});

		it("should mark isha as complete", async () => {
			await command.execute({ prayer: "isha", date: "2026-03-01" });

			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("Isha marked as complete");
		});
	});

	describe("showing status after marking prayers", () => {
		it("should show updated count after marking prayers", async () => {
			await command.execute({ prayer: "fajr", date: "2026-03-02" });
			logSpy.mockClear();

			await command.execute({ prayer: "dhuhr", date: "2026-03-02" });
			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("2/5 prayers completed");
		});

		it("should persist prayer status across calls", async () => {
			await command.execute({ prayer: "fajr", date: "2026-03-03" });
			await command.execute({ prayer: "asr", date: "2026-03-03" });
			logSpy.mockClear();

			await command.execute({ show: true, date: "2026-03-03" });
			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("2/5 prayers completed");
		});
	});

	describe("marking all 5 prayers", () => {
		it("should show MashaAllah message when all prayers are completed", async () => {
			const date = "2026-03-04";
			await command.execute({ prayer: "fajr", date });
			await command.execute({ prayer: "dhuhr", date });
			await command.execute({ prayer: "asr", date });
			await command.execute({ prayer: "maghrib", date });
			logSpy.mockClear();

			await command.execute({ prayer: "isha", date });
			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("5/5 prayers completed");
			expect(allOutput).toContain("MashaAllah");
		});
	});

	describe("with specific --date", () => {
		it("should track prayers for different dates independently", async () => {
			await command.execute({ prayer: "fajr", date: "2026-03-05" });
			await command.execute({ prayer: "dhuhr", date: "2026-03-06" });
			logSpy.mockClear();

			await command.execute({ show: true, date: "2026-03-05" });
			const output1 = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(output1).toContain("1/5 prayers completed");
			expect(output1).toContain("2026-03-05");

			logSpy.mockClear();

			await command.execute({ show: true, date: "2026-03-06" });
			const output2 = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(output2).toContain("1/5 prayers completed");
			expect(output2).toContain("2026-03-06");
		});
	});

	describe("default date (today)", () => {
		it("should use today's date when no date is specified", async () => {
			const now = new Date();
			const expectedKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

			await command.execute({ prayer: "fajr" });

			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("Fajr marked as complete");
			expect(allOutput).toContain(expectedKey);
		});
	});

	describe("invalid prayer name", () => {
		it("should throw CommandError for invalid prayer", async () => {
			await expect(
				command.execute({
					prayer: "invalid" as "fajr",
					date: "2026-03-07",
				}),
			).rejects.toThrow("Invalid prayer");
		});

		it("should show status for empty prayer name (falsy value)", async () => {
			await command.execute({
				prayer: "" as "fajr",
				date: "2026-03-07",
			});

			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("Prayer Tracking");
			expect(allOutput).toContain("0/5 prayers completed");
		});
	});

	describe("re-marking the same prayer", () => {
		it("should not change count when marking same prayer twice", async () => {
			const date = "2026-03-08";
			await command.execute({ prayer: "fajr", date });
			logSpy.mockClear();

			await command.execute({ prayer: "fajr", date });
			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("1/5 prayers completed");
		});
	});

	describe("taraweeh tracking", () => {
		it("should mark taraweeh as complete", async () => {
			await command.execute({ prayer: "taraweeh", date: "2026-03-01" });
			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("Taraweeh marked as complete");
		});
	});

	describe("vacation tracking", () => {
		it("should mark day as vacation with streak service", async () => {
			const mockStreakService = {
				markVacation: vi.fn(),
			};
			const cmdWithStreak = new TrackCommand(configRepo, mockStreakService as never, storeDir);

			await cmdWithStreak.execute({ vacation: true, date: "2026-03-10" });

			expect(mockStreakService.markVacation).toHaveBeenCalledWith("2026-03-10");
			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("Vacation marked for 2026-03-10");
			expect(allOutput).toContain("streak preserved");
		});

		it("should mark day as vacation without streak service", async () => {
			await command.execute({ vacation: true, date: "2026-03-10" });

			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("Vacation marked for 2026-03-10");
		});
	});

	describe("fasted tracking", () => {
		it("should mark day as fasted without streak service", async () => {
			await command.execute({ fasted: true, date: "2026-03-10" });
			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("Fasting marked for 2026-03-10");
		});

		it("should mark day as fasted with streak service and show streak", async () => {
			const mockStreakService = {
				markDay: vi.fn(),
				getCurrentStreak: vi.fn().mockReturnValue(3),
			};
			const cmdWithStreak = new TrackCommand(configRepo, mockStreakService as never, storeDir);

			await cmdWithStreak.execute({ fasted: true, date: "2026-03-10" });

			expect(mockStreakService.markDay).toHaveBeenCalledWith("2026-03-10");
			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("Fasting marked for 2026-03-10");
			expect(allOutput).toContain("Current streak: 3 days");
		});

		it("should mark day as fasted with streak service but zero streak", async () => {
			const mockStreakService = {
				markDay: vi.fn(),
				getCurrentStreak: vi.fn().mockReturnValue(0),
			};
			const cmdWithStreak = new TrackCommand(configRepo, mockStreakService as never, storeDir);

			await cmdWithStreak.execute({ fasted: true, date: "2026-03-10" });

			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("Fasting marked for 2026-03-10");
			expect(allOutput).not.toContain("Current streak");
		});
	});
});
