import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { QuranCommand } from "../../../commands/quran.command.js";
import { QURAN_VERSES } from "../../../data/quran-verses.js";

describe("QuranCommand", () => {
	let command: QuranCommand;
	let logSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		command = new QuranCommand();
		logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("execute with specific dayNumber", () => {
		it("should print verse for day 1", async () => {
			await command.execute({ dayNumber: 1 });

			expect(logSpy).toHaveBeenCalled();
			const output = logSpy.mock.calls[0]?.[0] as string;
			const verse =
				QURAN_VERSES.find((v) => v.day === 1) ??
				(() => {
					throw new Error("not found");
				})();
			expect(output).toContain(verse.arabic);
			expect(output).toContain(verse.transliteration);
			expect(output).toContain(verse.translation);
			expect(output).toContain("Day 1");
		});

		it("should print verse for day 15", async () => {
			await command.execute({ dayNumber: 15 });

			expect(logSpy).toHaveBeenCalled();
			const output = logSpy.mock.calls[0]?.[0] as string;
			const verse =
				QURAN_VERSES.find((v) => v.day === 15) ??
				(() => {
					throw new Error("not found");
				})();
			expect(output).toContain(verse.arabic);
			expect(output).toContain(verse.transliteration);
			expect(output).toContain(verse.translation);
			expect(output).toContain("Day 15");
		});

		it("should print verse for day 30", async () => {
			await command.execute({ dayNumber: 30 });

			expect(logSpy).toHaveBeenCalled();
			const output = logSpy.mock.calls[0]?.[0] as string;
			const verse =
				QURAN_VERSES.find((v) => v.day === 30) ??
				(() => {
					throw new Error("not found");
				})();
			expect(output).toContain(verse.arabic);
			expect(output).toContain(verse.transliteration);
			expect(output).toContain(verse.translation);
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
			await expect(command.execute({ dayNumber: 0 })).rejects.toThrow("No verse found for day 0");
		});

		it("should throw CommandError for day 31", async () => {
			await expect(command.execute({ dayNumber: 31 })).rejects.toThrow("No verse found for day 31");
		});
	});

	describe("output formatting", () => {
		it("should output contain Surah info", async () => {
			await command.execute({ dayNumber: 1 });

			expect(logSpy).toHaveBeenCalled();
			const output = logSpy.mock.calls[0]?.[0] as string;
			const verse =
				QURAN_VERSES.find((v) => v.day === 1) ??
				(() => {
					throw new Error("not found");
				})();
			expect(output).toContain(`Surah ${verse.surah}`);
		});
	});
});
