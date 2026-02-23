/**
 * @module commands/cache
 * @description Manages the prayer time cache: build (prefetch), clear, and status.
 */

import pc from "picocolors";
import { CommandError } from "../errors/command.error.js";
import type { CacheService } from "../services/cache.service.js";
import type { LocationService } from "../services/location.service.js";
import type { PrayerTimeService } from "../services/prayer-time.service.js";

export interface CacheCommandOptions {
	readonly build?: boolean | undefined;
	readonly clear?: boolean | undefined;
	readonly city?: string | undefined;
	readonly days?: number | undefined;
}

/**
 * CLI command for managing the prayer time cache.
 *
 * - `--build`: Prefetch prayer times for the next 30 days (or custom via `--days`).
 * - `--clear`: Remove all cached data.
 * - Default: Show cache usage hint.
 */
export class CacheCommand {
	constructor(
		private readonly cacheService: CacheService,
		private readonly locationService: LocationService,
		private readonly prayerTimeService: PrayerTimeService,
	) {}

	async execute(options: CacheCommandOptions): Promise<void> {
		if (options.clear) {
			this.cacheService.clear();
			console.log(pc.green("Cache cleared."));
			return;
		}

		if (options.build) {
			const query = await this.resolveLocation(options.city);

			const days = options.days ?? 30;
			console.log(pc.dim(`Building cache for ${query.address} (${days} days)...`));

			let count = 0;
			const now = new Date();
			for (let i = 0; i < days; i++) {
				const date = new Date(now);
				date.setDate(now.getDate() + i);
				try {
					await this.prayerTimeService.fetchDay(query, date);
					count++;
				} catch {
					// skip failed days silently
				}
			}

			console.log(pc.green(`Cached ${count} days of prayer times.`));
			return;
		}

		// Default: show cache status / usage hint
		console.log(pc.dim("Use --build to prefetch 30 days, or --clear to clear cache."));
	}

	private async resolveLocation(city?: string | undefined) {
		try {
			return await this.locationService.resolveQuery({
				city,
				allowInteractiveSetup: false,
			});
		} catch {
			throw new CommandError("Could not resolve location. Use --city to specify a city.");
		}
	}
}
