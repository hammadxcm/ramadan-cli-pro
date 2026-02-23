/**
 * @module commands/compare
 * @description Compares prayer times across multiple cities side by side.
 */

import pc from "picocolors";
import { CommandError } from "../errors/command.error.js";
import type { I18nService } from "../services/i18n.service.js";
import type { LocationService } from "../services/location.service.js";
import type { PrayerTimeService } from "../services/prayer-time.service.js";

export interface CompareCommandOptions {
	readonly cities: ReadonlyArray<string>;
}

export class CompareCommand {
	private readonly i18n: I18nService | undefined;

	constructor(
		private readonly locationService: LocationService,
		private readonly prayerTimeService: PrayerTimeService,
		i18nService?: I18nService,
	) {
		this.i18n = i18nService;
	}

	private t(key: string, fallback: string, options?: Record<string, unknown>): string {
		return this.i18n ? this.i18n.t(key, options) : fallback;
	}

	async execute(options: CompareCommandOptions): Promise<void> {
		const cities = options.cities;
		if (cities.length < 2 || cities.length > 4) {
			throw new CommandError(this.t("compare.needCities", "Provide 2-4 cities to compare."));
		}

		console.log("");
		console.log(pc.bold(pc.green(`  ${this.t("compare.title", "Prayer Time Comparison")}`)));
		console.log("");

		const results = await Promise.all(
			cities.map(async (city) => {
				try {
					const query = await this.locationService.resolveQuery({
						city,
						allowInteractiveSetup: false,
					});
					const data = await this.prayerTimeService.fetchDay(query);
					return { city: query.address, timings: data.timings, error: null };
				} catch {
					return { city, timings: null, error: this.t("compare.fetchFailed", "Failed to fetch") };
				}
			}),
		);

		// Header
		const prayerLabel = this.t("compare.prayer", "Prayer");
		const cityHeaders = results.map((r) => r.city.padEnd(18)).join("");
		console.log(pc.dim(`  ${prayerLabel.padEnd(12)}${cityHeaders}`));
		console.log(pc.dim(`  ${"-".repeat(12 + results.length * 18)}`));

		// Prayer rows
		const prayers = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
		for (const prayer of prayers) {
			const values = results
				.map((r) => {
					const na = this.t("compare.na", "N/A");
					if (!r.timings) return na.padEnd(18);
					const time = r.timings[prayer]?.split(" ")[0] ?? na;
					return time.padEnd(18);
				})
				.join("");
			console.log(`  ${prayer.padEnd(12)}${values}`);
		}
		console.log("");
	}
}
