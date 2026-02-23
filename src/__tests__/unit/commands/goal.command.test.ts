import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GoalCommand } from "../../../commands/goal.command.js";
import { CommandError } from "../../../errors/command.error.js";

describe("GoalCommand", () => {
	let logSpy: ReturnType<typeof vi.spyOn>;

	const mockGoalService = {
		addGoal: vi.fn(),
		updateGoal: vi.fn(),
		deleteGoal: vi.fn(),
		listGoals: vi.fn(),
		getGoal: vi.fn(),
	};

	beforeEach(() => {
		logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

		mockGoalService.addGoal.mockReturnValue({
			id: "abc",
			title: "Read Quran",
			target: 30,
			current: 0,
			unit: "juz",
			createdAt: "2026-03-01T00:00:00.000Z",
		});
		mockGoalService.updateGoal.mockReturnValue({
			id: "abc",
			title: "Read Quran",
			target: 30,
			current: 10,
			unit: "juz",
			createdAt: "2026-03-01T00:00:00.000Z",
		});
		mockGoalService.deleteGoal.mockReturnValue(true);
		mockGoalService.listGoals.mockReturnValue([
			{
				id: "abc",
				title: "Read Quran",
				target: 30,
				current: 10,
				unit: "juz",
				createdAt: "2026-03-01T00:00:00.000Z",
			},
		]);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("add", () => {
		it("should call addGoal with title, target, unit and log success", async () => {
			const command = new GoalCommand(mockGoalService as never);

			await command.execute({
				action: "add",
				title: "Read Quran",
				target: 30,
				unit: "juz",
			});

			expect(mockGoalService.addGoal).toHaveBeenCalledWith("Read Quran", 30, "juz");
			expect(logSpy).toHaveBeenCalled();
			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("Read Quran");
		});

		it("should throw CommandError when missing fields", async () => {
			const command = new GoalCommand(mockGoalService as never);

			await expect(command.execute({ action: "add", title: "Read Quran" })).rejects.toThrow(
				CommandError,
			);
			await expect(command.execute({ action: "add", title: "Read Quran" })).rejects.toThrow(
				"Required: --title, --target, --unit",
			);
		});
	});

	describe("update", () => {
		it("should call updateGoal and log success", async () => {
			const command = new GoalCommand(mockGoalService as never);

			await command.execute({
				action: "update",
				id: "abc",
				progress: 10,
			});

			expect(mockGoalService.updateGoal).toHaveBeenCalledWith("abc", 10);
			expect(logSpy).toHaveBeenCalled();
			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("Goal updated");
		});

		it("should throw CommandError when updateGoal returns null", async () => {
			mockGoalService.updateGoal.mockReturnValueOnce(null);
			const command = new GoalCommand(mockGoalService as never);

			await expect(command.execute({ action: "update", id: "xyz", progress: 5 })).rejects.toThrow(
				CommandError,
			);
		});

		it("should throw CommandError when missing id or progress", async () => {
			const command = new GoalCommand(mockGoalService as never);
			await expect(command.execute({ action: "update" })).rejects.toThrow(
				"Required: --id, --progress",
			);
		});
	});

	describe("list", () => {
		it("should show goals with progress bar", async () => {
			const command = new GoalCommand(mockGoalService as never);

			await command.execute({ action: "list" });

			expect(mockGoalService.listGoals).toHaveBeenCalled();
			expect(logSpy).toHaveBeenCalled();
			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("Read Quran");
			expect(allOutput).toContain("10");
			expect(allOutput).toContain("30");
		});

		it("should show dim message when no goals", async () => {
			mockGoalService.listGoals.mockReturnValueOnce([]);
			const command = new GoalCommand(mockGoalService as never);

			await command.execute({ action: "list" });

			expect(logSpy).toHaveBeenCalled();
			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("No goals set");
		});

		it("should show checkmark for completed goals", async () => {
			mockGoalService.listGoals.mockReturnValueOnce([
				{
					id: "done",
					title: "Finish Quran",
					target: 30,
					current: 30,
					unit: "juz",
					createdAt: "2026-03-01T00:00:00.000Z",
				},
			]);
			const command = new GoalCommand(mockGoalService as never);
			await command.execute({ action: "list" });
			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("100%");
		});
	});

	describe("delete", () => {
		it("should call deleteGoal and log success", async () => {
			const command = new GoalCommand(mockGoalService as never);

			await command.execute({ action: "delete", id: "abc" });

			expect(mockGoalService.deleteGoal).toHaveBeenCalledWith("abc");
			expect(logSpy).toHaveBeenCalled();
			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("deleted");
		});

		it("should throw CommandError when deleteGoal returns false", async () => {
			mockGoalService.deleteGoal.mockReturnValueOnce(false);
			const command = new GoalCommand(mockGoalService as never);

			await expect(command.execute({ action: "delete", id: "xyz" })).rejects.toThrow(CommandError);
		});

		it("should throw CommandError when missing id", async () => {
			const command = new GoalCommand(mockGoalService as never);
			await expect(command.execute({ action: "delete" })).rejects.toThrow("Required: goal ID");
		});
	});

	describe("invalid action", () => {
		it("should throw CommandError for invalid action", async () => {
			const command = new GoalCommand(mockGoalService as never);
			await expect(command.execute({ action: "invalid" as "add" })).rejects.toThrow(
				"Invalid action",
			);
		});
	});
});
