/**
 * @module commands/hadith
 * @description Displays the hadith of the day for Ramadan.
 */

import pc from "picocolors";
import { RAMADAN_HADITHS } from "../data/hadiths.js";
import { CommandError } from "../errors/command.error.js";

export interface HadithCommandOptions {
	readonly dayNumber?: number | undefined;
}

/**
 * Displays a daily hadith based on the day number.
 */
export class HadithCommand {
	async execute(options: HadithCommandOptions): Promise<void> {
		const dayNumber = options.dayNumber ?? this.getCurrentRamadanDay();
		const hadith = RAMADAN_HADITHS.find((h) => h.day === dayNumber);

		if (!hadith) {
			throw new CommandError(`No hadith found for day ${dayNumber}.`);
		}

		const lines = [
			"",
			pc.bold(pc.green(`  Hadith for Day ${hadith.day} of Ramadan`)),
			"",
			`  ${pc.bold(hadith.arabic)}`,
			"",
			`  ${pc.italic(pc.cyan(hadith.transliteration))}`,
			"",
			`  ${pc.dim(hadith.translation)}`,
			"",
			`  ${pc.dim(`Source: ${hadith.source} | Narrator: ${hadith.narrator}`)}`,
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
