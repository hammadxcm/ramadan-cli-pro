import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CharityCommand } from "../../../commands/charity.command.js";

describe("CharityCommand", () => {
	let logSpy: ReturnType<typeof vi.spyOn>;

	const mockCharityService = {
		addEntry: vi.fn(),
		listEntries: vi.fn(),
		deleteEntry: vi.fn(),
		getDailySummary: vi.fn(),
		getTotalAmount: vi.fn(),
	};

	beforeEach(() => {
		logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

		mockCharityService.addEntry.mockReturnValue({
			id: "x",
			date: "2026-03-15",
			amount: 50,
			description: "Food",
			category: "general",
		});
		mockCharityService.listEntries.mockReturnValue([
			{
				id: "x",
				date: "2026-03-15",
				amount: 50,
				description: "Food",
				category: "general",
			},
		]);
		mockCharityService.getTotalAmount.mockReturnValue(50);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("add", () => {
		it("should call addEntry and log success with amount", async () => {
			const command = new CharityCommand(mockCharityService as never);

			await command.execute({
				action: "add",
				amount: 50,
				description: "Food",
			});

			expect(mockCharityService.addEntry).toHaveBeenCalledWith(50, "Food", "general");
			expect(logSpy).toHaveBeenCalled();
			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("50");
		});

		it("should throw error when missing fields", async () => {
			const command = new CharityCommand(mockCharityService as never);

			await expect(command.execute({ action: "add", amount: 50 })).rejects.toThrow(
				"Required: --amount, --description",
			);
		});
	});

	describe("list", () => {
		it("should show entries with date, amount, and description", async () => {
			const command = new CharityCommand(mockCharityService as never);

			await command.execute({ action: "list" });

			expect(mockCharityService.listEntries).toHaveBeenCalled();
			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("2026-03-15");
			expect(allOutput).toContain("50");
			expect(allOutput).toContain("Food");
		});

		it("should show dim message when no entries", async () => {
			mockCharityService.listEntries.mockReturnValueOnce([]);
			const command = new CharityCommand(mockCharityService as never);

			await command.execute({ action: "list" });

			expect(logSpy).toHaveBeenCalled();
			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("No charity entries");
		});
	});

	describe("summary", () => {
		it("should show total and entry count", async () => {
			const command = new CharityCommand(mockCharityService as never);

			await command.execute({ action: "summary" });

			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("50");
			expect(allOutput).toContain("1");
		});
	});

	describe("invalid action", () => {
		it("should throw error for invalid action", async () => {
			const command = new CharityCommand(mockCharityService as never);
			await expect(command.execute({ action: "invalid" as "add" })).rejects.toThrow(
				"Invalid action",
			);
		});
	});
});
