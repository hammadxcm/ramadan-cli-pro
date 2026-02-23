import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DuaCommand } from "../../../commands/dua.command.js";
import { RAMADAN_DUAS } from "../../../data/duas.js";

describe("DuaCommand", () => {
	let command: DuaCommand;
	let logSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		command = new DuaCommand();
		logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("execute with specific dayNumber", () => {
		it("should print dua for day 1", async () => {
			await command.execute({ dayNumber: 1 });

			expect(logSpy).toHaveBeenCalled();
			const output = logSpy.mock.calls[0]?.[0] as string;
			const dua =
				RAMADAN_DUAS.find((d) => d.day === 1) ??
				(() => {
					throw new Error("not found");
				})();
			expect(output).toContain(dua.arabic);
			expect(output).toContain(dua.transliteration);
			expect(output).toContain(dua.translation);
			expect(output).toContain("Day 1");
		});

		it("should print dua for day 15", async () => {
			await command.execute({ dayNumber: 15 });

			expect(logSpy).toHaveBeenCalled();
			const output = logSpy.mock.calls[0]?.[0] as string;
			const dua =
				RAMADAN_DUAS.find((d) => d.day === 15) ??
				(() => {
					throw new Error("not found");
				})();
			expect(output).toContain(dua.arabic);
			expect(output).toContain(dua.transliteration);
			expect(output).toContain(dua.translation);
			expect(output).toContain("Day 15");
		});

		it("should print dua for day 30", async () => {
			await command.execute({ dayNumber: 30 });

			expect(logSpy).toHaveBeenCalled();
			const output = logSpy.mock.calls[0]?.[0] as string;
			const dua =
				RAMADAN_DUAS.find((d) => d.day === 30) ??
				(() => {
					throw new Error("not found");
				})();
			expect(output).toContain(dua.arabic);
			expect(output).toContain(dua.transliteration);
			expect(output).toContain(dua.translation);
			expect(output).toContain("Day 30");
		});
	});

	describe("execute without dayNumber", () => {
		it("should use current day of month clamped to 1-30", async () => {
			const today = new Date();
			const expectedDay = Math.max(1, Math.min(30, today.getDate()));

			await command.execute({});

			expect(logSpy).toHaveBeenCalled();
			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain(`Day ${expectedDay}`);
		});

		it("should use day from mocked date", async () => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date(2026, 2, 10)); // March 10 -> day 10

			const freshCommand = new DuaCommand();
			await freshCommand.execute({});

			expect(logSpy).toHaveBeenCalled();
			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("Day 10");

			vi.useRealTimers();
		});

		it("should clamp day 31 to 30 when using current date", async () => {
			vi.useFakeTimers();
			vi.setSystemTime(new Date(2026, 0, 31)); // January 31 -> clamped to 30

			const freshCommand = new DuaCommand();
			await freshCommand.execute({});

			expect(logSpy).toHaveBeenCalled();
			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("Day 30");

			vi.useRealTimers();
		});
	});

	describe("execute with invalid dayNumber", () => {
		it("should throw error for day 0", async () => {
			await expect(command.execute({ dayNumber: 0 })).rejects.toThrow("No dua found for day 0");
		});

		it("should throw error for day 31", async () => {
			await expect(command.execute({ dayNumber: 31 })).rejects.toThrow("No dua found for day 31");
		});

		it("should throw error for negative day", async () => {
			await expect(command.execute({ dayNumber: -5 })).rejects.toThrow("No dua found for day -5");
		});

		it("should throw error for day 100", async () => {
			await expect(command.execute({ dayNumber: 100 })).rejects.toThrow("No dua found for day 100");
		});
	});

	describe("output formatting", () => {
		it("should output multi-line formatted dua text", async () => {
			await command.execute({ dayNumber: 1 });

			expect(logSpy).toHaveBeenCalledTimes(1);
			const output = logSpy.mock.calls[0]?.[0] as string;
			// Should contain newlines (formatted as joined lines)
			expect(output).toContain("\n");
		});

		it("should not call console.error for valid day", async () => {
			const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
			await command.execute({ dayNumber: 1 });

			expect(errorSpy).not.toHaveBeenCalled();
		});
	});
});
