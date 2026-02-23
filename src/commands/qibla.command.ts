/**
 * @module commands/qibla
 * @description Displays the Qibla (direction of Mecca) for a given location.
 */

import { CommandError } from "../errors/command.error.js";
import { formatQiblaOutput } from "../formatters/qibla.formatter.js";
import type { PrayerApiRepository } from "../repositories/prayer-api.repository.js";
import type { LocationService } from "../services/location.service.js";
import { createSpinner } from "../ui/spinner.js";

/**
 * Options parsed from `ramadan-cli-pro qibla` arguments.
 */
export interface QiblaCommandOptions {
	readonly city?: string | undefined;
}

/**
 * Resolves location, fetches Qibla direction, and prints an ASCII compass.
 */
export class QiblaCommand {
	constructor(
		private readonly locationService: LocationService,
		private readonly prayerApiRepository: PrayerApiRepository,
	) {}

	async execute(options: QiblaCommandOptions): Promise<void> {
		const spinner = createSpinner("Fetching Qibla direction...");

		try {
			const query = await this.locationService.resolveQuery({
				city: options.city,
				allowInteractiveSetup: false,
			});

			if (query.latitude === undefined || query.longitude === undefined) {
				throw new Error(
					"Could not determine coordinates. Please provide a city or configure latitude/longitude.",
				);
			}

			spinner.start();
			const qibla = await this.prayerApiRepository.fetchQibla(query.latitude, query.longitude);
			spinner.stop();

			console.log(
				formatQiblaOutput({
					direction: qibla.direction,
					latitude: qibla.latitude,
					longitude: qibla.longitude,
					location: query.address,
				}),
			);
		} catch (error) {
			spinner.fail(error instanceof Error ? error.message : "Failed to fetch Qibla direction");
			throw new CommandError(
				error instanceof Error ? error.message : "Failed to fetch Qibla direction",
			);
		}
	}
}
