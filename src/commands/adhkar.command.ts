/**
 * @module commands/adhkar
 * @description Displays adhkar/dhikr collections organized by category
 * (morning, evening, post-prayer).
 */

import pc from "picocolors";
import { ADHKAR_COLLECTIONS } from "../data/adhkar.js";
import { CommandError } from "../errors/command.error.js";

export interface AdhkarCommandOptions {
	readonly collection?: string | undefined;
}

/**
 * Displays an adhkar collection by category.
 * Defaults to the "morning" collection when no collection is specified.
 */
export class AdhkarCommand {
	async execute(options: AdhkarCommandOptions): Promise<void> {
		const collectionId = options.collection ?? "morning";
		const collection = ADHKAR_COLLECTIONS.find((c) => c.id === collectionId);

		if (!collection) {
			const validIds = ADHKAR_COLLECTIONS.map((c) => c.id).join(", ");
			throw new CommandError(
				`Unknown collection: "${collectionId}". Available collections: ${validIds}`,
			);
		}

		const lines: string[] = ["", pc.bold(pc.green(`  ${collection.title}`)), ""];

		for (const dhikr of collection.items) {
			lines.push(`  ${pc.bold(dhikr.arabic)}`);
			lines.push(`  ${pc.italic(pc.cyan(dhikr.transliteration))}`);
			lines.push(`  ${pc.dim(dhikr.translation)}`);
			if (dhikr.count) {
				lines.push(`  ${pc.yellow(`(Repeat ${dhikr.count}x)`)}`);
			}
			lines.push("");
		}

		console.log(lines.join("\n"));
	}
}
