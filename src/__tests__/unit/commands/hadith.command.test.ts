import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HadithCommand } from "../../../commands/hadith.command.js";
import { RAMADAN_HADITHS } from "../../../data/hadiths.js";

describe("HadithCommand", () => {
	let command: HadithCommand;
	let logSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		command = new HadithCommand();
		logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("execute with specific dayNumber", () => {
		it("should print hadith for day 1", async () => {
			await command.execute({ dayNumber: 1 });

			expect(logSpy).toHaveBeenCalled();
			const output = logSpy.mock.calls[0]?.[0] as string;
			const hadith =
				RAMADAN_HADITHS.find((h) => h.day === 1) ??
				(() => {
					throw new Error("not found");
				})();
			expect(output).toContain(hadith.arabic);
			expect(output).toContain(hadith.transliteration);
			expect(output).toContain(hadith.translation);
			expect(output).toContain("Day 1");
			expect(output).toContain(hadith.source);
			expect(output).toContain(hadith.narrator);
		});

		it("should print hadith for day 30", async () => {
			await command.execute({ dayNumber: 30 });

			expect(logSpy).toHaveBeenCalled();
			const output = logSpy.mock.calls[0]?.[0] as string;
			const hadith =
				RAMADAN_HADITHS.find((h) => h.day === 30) ??
				(() => {
					throw new Error("not found");
				})();
			expect(output).toContain(hadith.arabic);
			expect(output).toContain(hadith.transliteration);
			expect(output).toContain(hadith.translation);
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
	});

	describe("execute with invalid dayNumber", () => {
		it("should throw CommandError for day 0", async () => {
			await expect(command.execute({ dayNumber: 0 })).rejects.toThrow("No hadith found for day 0");
		});

		it("should throw CommandError for day 31", async () => {
			await expect(command.execute({ dayNumber: 31 })).rejects.toThrow(
				"No hadith found for day 31",
			);
		});
	});
});
