/**
 * @module commands/dua
 * @description Displays the Ramadan dua of the day.
 */

import pc from "picocolors";
import { RAMADAN_DUAS } from "../data/duas.js";
import { CommandError } from "../errors/command.error.js";

export interface DuaCommandOptions {
	readonly dayNumber?: number | undefined;
}

/**
 * Displays a daily Ramadan dua based on the day number.
 */
export class DuaCommand {
	async execute(options: DuaCommandOptions): Promise<void> {
		const dayNumber = options.dayNumber ?? this.getCurrentRamadanDay();
		const dua = RAMADAN_DUAS.find((d) => d.day === dayNumber);

		if (!dua) {
			throw new CommandError(`No dua found for day ${dayNumber}.`);
		}

		const lines = [
			"",
			pc.bold(pc.green(`  Dua for Day ${dua.day} of Ramadan`)),
			"",
			`  ${pc.bold(dua.arabic)}`,
			"",
			`  ${pc.italic(pc.cyan(dua.transliteration))}`,
			"",
			`  ${pc.dim(dua.translation)}`,
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
