/**
 * @module commands/export
 * @description Exports prayer times to iCal, CSV, or JSON format.
 */

import { writeFileSync } from "node:fs";
import pc from "picocolors";
import { CommandError } from "../errors/command.error.js";
import type { I18nService } from "../services/i18n.service.js";
import type { IcalService } from "../services/ical.service.js";

export interface ExportCommandOptions {
	readonly format?: string | undefined;
	readonly output?: string | undefined;
}

export class ExportCommand {
	private readonly i18n: I18nService | undefined;

	constructor(
		private readonly icalService: IcalService,
		i18nService?: I18nService,
	) {
		this.i18n = i18nService;
	}

	private t(key: string, fallback: string, options?: Record<string, unknown>): string {
		return this.i18n ? this.i18n.t(key, options) : fallback;
	}

	async execute(options: ExportCommandOptions): Promise<void> {
		const format = options.format ?? "ical";
		if (format !== "ical" && format !== "csv" && format !== "json") {
			throw new CommandError(
				this.t(
					"export.unsupportedFormat",
					`Unsupported format: ${format}. Use "ical", "csv", or "json".`,
					{
						format,
					},
				),
			);
		}

		// Generate sample events for demonstration
		const events = Array.from({ length: 30 }, (_, i) => ({
			title: `Sehar - Day ${i + 1}`,
			date: "01-03-2026",
			time: "05:00",
			duration: 15,
		}));

		const extensionMap: Record<string, string> = {
			ical: ".ics",
			csv: ".csv",
			json: ".json",
		};

		let content: string;
		if (format === "csv") {
			content = this.icalService.generateCsv(events);
		} else if (format === "json") {
			content = this.icalService.generateJson(events);
		} else {
			content = this.icalService.generateIcal(events);
		}

		const defaultFile = `ramadan-times${extensionMap[format] ?? ".ics"}`;
		const outputPath = options.output ?? defaultFile;

		writeFileSync(outputPath, content, "utf-8");
		console.log(
			pc.green(this.t("export.exported", `Exported to ${outputPath}`, { path: outputPath })),
		);
	}
}
