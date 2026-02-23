/**
 * @module commands/widget
 * @description Compact 3-line terminal widget that auto-refreshes.
 */

import pc from "picocolors";
import { CommandError } from "../errors/command.error.js";
import type { HighlightService } from "../services/highlight.service.js";
import type { I18nService } from "../services/i18n.service.js";
import type { LocationService } from "../services/location.service.js";
import type { PrayerTimeService } from "../services/prayer-time.service.js";

export class WidgetCommand {
	private readonly i18n: I18nService | undefined;

	constructor(
		private readonly locationService: LocationService,
		private readonly prayerTimeService: PrayerTimeService,
		private readonly highlightService: HighlightService,
		i18nService?: I18nService,
	) {
		this.i18n = i18nService;
	}

	private t(key: string, fallback: string, options?: Record<string, unknown>): string {
		return this.i18n ? this.i18n.t(key, options) : fallback;
	}

	async execute(options: { city?: string | undefined }): Promise<void> {
		try {
			const query = await this.locationService.resolveQuery({
				city: options.city,
				allowInteractiveSetup: false,
			});
			const data = await this.prayerTimeService.fetchDay(query);
			const highlight = this.highlightService.getHighlightState(data);

			const fajr = data.timings.Fajr?.split(" ")[0] ?? "--:--";
			const maghrib = data.timings.Maghrib?.split(" ")[0] ?? "--:--";

			console.log("");
			console.log(pc.bold(pc.green(`  \u{1F319} ${this.t("widget.title", "Ramadan Widget")}`)));
			console.log(pc.dim(`  ${query.address} | Sehar: ${fajr} | Iftar: ${maghrib}`));
			if (highlight) {
				console.log(
					`  ${pc.yellow(highlight.current)} | ${highlight.next} in ${pc.bold(highlight.countdown)}`,
				);
			}
			console.log("");

			// Auto-refresh mode
			const refreshInterval = setInterval(async () => {
				try {
					const freshData = await this.prayerTimeService.fetchDay(query);
					const freshHighlight = this.highlightService.getHighlightState(freshData);
					const fajrTime = freshData.timings.Fajr?.split(" ")[0] ?? "--:--";
					const maghribTime = freshData.timings.Maghrib?.split(" ")[0] ?? "--:--";

					process.stdout.write("\x1B[2J\x1B[H");
					console.log("");
					console.log(pc.bold(pc.green(`  \u{1F319} ${this.t("widget.title", "Ramadan Widget")}`)));
					console.log(pc.dim(`  ${query.address} | Sehar: ${fajrTime} | Iftar: ${maghribTime}`));
					if (freshHighlight) {
						console.log(
							`  ${pc.yellow(freshHighlight.current)} | ${freshHighlight.next} in ${pc.bold(freshHighlight.countdown)}`,
						);
					}
					console.log(pc.dim(`  ${this.t("widget.exitHint", "Press Ctrl+C to exit")}`));
					console.log("");
				} catch {
					// silent refresh failure
				}
			}, 60_000);

			// Handle graceful exit
			process.once("SIGINT", () => {
				clearInterval(refreshInterval);
				process.exit(0);
			});

			// Keep process alive
			await new Promise(() => {});
		} catch {
			throw new CommandError(this.t("widget.error", "Widget error: could not fetch prayer times."));
		}
	}
}
