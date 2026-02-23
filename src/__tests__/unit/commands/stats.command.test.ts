import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { StatsCommand } from "../../../commands/stats.command.js";

describe("StatsCommand", () => {
	let logSpy: ReturnType<typeof vi.spyOn>;
	let errorSpy: ReturnType<typeof vi.spyOn>;
	let exitSpy: ReturnType<typeof vi.fn>;

	const mockStatsService = {
		getOverallSummary: vi.fn(),
	};

	beforeEach(() => {
		logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
		errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		exitSpy = vi.spyOn(process, "exit").mockImplementation(((code?: number) => {
			throw new Error(`process.exit(${code})`);
		}) as never) as unknown as ReturnType<typeof vi.fn>;

		mockStatsService.getOverallSummary.mockReturnValue({
			totalPrayersCompleted: 35,
			totalPrayersExpected: 50,
			prayerCompletionRate: 70,
			currentFastingStreak: 5,
			longestFastingStreak: 10,
			totalDaysFasted: 20,
			goalsCompleted: 1,
			goalsTotal: 3,
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("execute", () => {
		it("should output Ramadan Statistics header", async () => {
			const command = new StatsCommand(mockStatsService as never);

			await command.execute({});

			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("Ramadan Statistics");
		});

		it("should contain prayer completion rate", async () => {
			const command = new StatsCommand(mockStatsService as never);

			await command.execute({});

			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("70%");
			expect(allOutput).toContain("35");
			expect(allOutput).toContain("50");
		});

		it("should contain fasting streak info", async () => {
			const command = new StatsCommand(mockStatsService as never);

			await command.execute({});

			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("5");
			expect(allOutput).toContain("10");
			expect(allOutput).toContain("20");
		});

		it("should contain goals info", async () => {
			const command = new StatsCommand(mockStatsService as never);

			await command.execute({});

			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("1");
			expect(allOutput).toContain("3");
			expect(allOutput).toContain("completed");
		});

		it("should show 'No goals set' when goalsTotal is 0", async () => {
			mockStatsService.getOverallSummary.mockReturnValueOnce({
				totalPrayersCompleted: 0,
				totalPrayersExpected: 0,
				prayerCompletionRate: 0,
				currentFastingStreak: 0,
				longestFastingStreak: 0,
				totalDaysFasted: 0,
				goalsCompleted: 0,
				goalsTotal: 0,
			});
			const command = new StatsCommand(mockStatsService as never);
			await command.execute({});
			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("No goals set");
		});
	});
});
