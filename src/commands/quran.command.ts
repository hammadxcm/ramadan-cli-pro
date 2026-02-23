/**
 * @module commands/quran
 * @description Displays the Quran verse of the day for Ramadan.
 */

import pc from "picocolors";
import { QURAN_VERSES } from "../data/quran-verses.js";
import { CommandError } from "../errors/command.error.js";

export interface QuranCommandOptions {
	readonly dayNumber?: number | undefined;
}

/**
 * Displays a daily Quran verse based on the day number.
 */
export class QuranCommand {
	async execute(options: QuranCommandOptions): Promise<void> {
		const dayNumber = options.dayNumber ?? this.getCurrentRamadanDay();
		const verse = QURAN_VERSES.find((v) => v.day === dayNumber);

		if (!verse) {
			throw new CommandError(`No verse found for day ${dayNumber}.`);
		}

		const lines = [
			"",
			pc.bold(pc.green(`  Quran Verse for Day ${verse.day} of Ramadan`)),
			"",
			`  ${pc.bold(verse.arabic)}`,
			"",
			`  ${pc.italic(pc.cyan(verse.transliteration))}`,
			"",
			`  ${pc.dim(verse.translation)}`,
			"",
			`  ${pc.dim(`Surah ${verse.surah}, Ayah ${verse.ayah}`)}`,
			"",
		];

		console.log(lines.join("\n"));
	}

	private getCurrentRamadanDay(): number {
		const today = new Date();
		const dayOfMonth = today.getDate();
		return Math.max(1, Math.min(30, dayOfMonth));
	}
}
