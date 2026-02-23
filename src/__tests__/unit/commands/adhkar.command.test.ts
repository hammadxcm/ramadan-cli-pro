import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AdhkarCommand } from "../../../commands/adhkar.command.js";
import { ADHKAR_COLLECTIONS } from "../../../data/adhkar.js";

describe("AdhkarCommand", () => {
	let command: AdhkarCommand;
	let logSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		command = new AdhkarCommand();
		logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should be instantiable", () => {
		expect(command).toBeInstanceOf(AdhkarCommand);
	});

	describe("execute with 'morning' collection", () => {
		it("should print morning adhkar", async () => {
			await command.execute({ collection: "morning" });

			expect(logSpy).toHaveBeenCalled();
			const output = logSpy.mock.calls[0]?.[0] as string;
			const morning = ADHKAR_COLLECTIONS.find((c) => c.id === "morning")!;
			expect(output).toContain(morning.title);
			for (const dhikr of morning.items) {
				expect(output).toContain(dhikr.arabic);
				expect(output).toContain(dhikr.transliteration);
				expect(output).toContain(dhikr.translation);
			}
		});
	});

	describe("execute with 'evening' collection", () => {
		it("should print evening adhkar", async () => {
			await command.execute({ collection: "evening" });

			expect(logSpy).toHaveBeenCalled();
			const output = logSpy.mock.calls[0]?.[0] as string;
			const evening = ADHKAR_COLLECTIONS.find((c) => c.id === "evening")!;
			expect(output).toContain(evening.title);
			for (const dhikr of evening.items) {
				expect(output).toContain(dhikr.arabic);
				expect(output).toContain(dhikr.transliteration);
				expect(output).toContain(dhikr.translation);
			}
		});
	});

	describe("execute with 'post-prayer' collection", () => {
		it("should print post-prayer adhkar", async () => {
			await command.execute({ collection: "post-prayer" });

			expect(logSpy).toHaveBeenCalled();
			const output = logSpy.mock.calls[0]?.[0] as string;
			const postPrayer = ADHKAR_COLLECTIONS.find((c) => c.id === "post-prayer")!;
			expect(output).toContain(postPrayer.title);
			for (const dhikr of postPrayer.items) {
				expect(output).toContain(dhikr.arabic);
				expect(output).toContain(dhikr.transliteration);
				expect(output).toContain(dhikr.translation);
			}
		});
	});

	describe("execute without collection", () => {
		it("should default to morning collection", async () => {
			await command.execute({});

			expect(logSpy).toHaveBeenCalled();
			const output = logSpy.mock.calls[0]?.[0] as string;
			const morning = ADHKAR_COLLECTIONS.find((c) => c.id === "morning")!;
			expect(output).toContain(morning.title);
		});
	});

	describe("execute with undefined collection", () => {
		it("should default to morning collection", async () => {
			await command.execute({ collection: undefined });

			expect(logSpy).toHaveBeenCalled();
			const output = logSpy.mock.calls[0]?.[0] as string;
			const morning = ADHKAR_COLLECTIONS.find((c) => c.id === "morning")!;
			expect(output).toContain(morning.title);
		});
	});

	describe("execute with unknown collection", () => {
		it("should throw CommandError for invalid collection name", async () => {
			await expect(command.execute({ collection: "invalid" })).rejects.toThrow(
				'Unknown collection: "invalid"',
			);
		});

		it("should list available collections in error message", async () => {
			await expect(command.execute({ collection: "nonexistent" })).rejects.toThrow(
				"morning, evening, post-prayer",
			);
		});
	});

	describe("output formatting", () => {
		it("should include repetition count when dhikr has count", async () => {
			await command.execute({ collection: "post-prayer" });

			expect(logSpy).toHaveBeenCalled();
			const output = logSpy.mock.calls[0]?.[0] as string;
			// post-prayer collection has items with count (e.g., SubhanAllah x33)
			expect(output).toContain("33");
		});
	});
});
