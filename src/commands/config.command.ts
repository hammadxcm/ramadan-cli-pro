/**
 * @module commands/config
 * @description Non-interactive `config` subcommand for viewing and updating
 * persisted settings (location, method, school, timezone).
 */

import pc from "picocolors";
import type { z } from "zod";
import type { ConfigRepository } from "../repositories/config.repository.js";
import {
	LatitudeSchema,
	LongitudeSchema,
	MethodSchema,
	SchoolSchema,
} from "../schemas/config.schema.js";

/**
 * Options parsed from `ramadan-cli-pro config` flags.
 */
export interface ConfigCommandOptions {
	readonly city?: string | undefined;
	readonly country?: string | undefined;
	readonly latitude?: string | undefined;
	readonly longitude?: string | undefined;
	readonly method?: string | undefined;
	readonly school?: string | undefined;
	readonly timezone?: string | undefined;
	readonly show?: boolean | undefined;
	readonly clear?: boolean | undefined;
}

interface ParsedConfigUpdates {
	readonly city?: string | undefined;
	readonly country?: string | undefined;
	readonly latitude?: number | undefined;
	readonly longitude?: number | undefined;
	readonly method?: number | undefined;
	readonly school?: number | undefined;
	readonly timezone?: string | undefined;
}

const parseOptionalWithSchema = <T>(
	value: string | undefined,
	schema: z.ZodType<T>,
	label: string,
): T | undefined => {
	if (value === undefined) return undefined;
	const parsed = schema.safeParse(value);
	if (!parsed.success) throw new Error(`Invalid ${label}.`);
	return parsed.data;
};

const parseConfigUpdates = (options: ConfigCommandOptions): ParsedConfigUpdates => ({
	...(options.city ? { city: options.city.trim() } : {}),
	...(options.country ? { country: options.country.trim() } : {}),
	...(options.latitude !== undefined
		? { latitude: parseOptionalWithSchema(options.latitude, LatitudeSchema, "latitude") }
		: {}),
	...(options.longitude !== undefined
		? { longitude: parseOptionalWithSchema(options.longitude, LongitudeSchema, "longitude") }
		: {}),
	...(options.method !== undefined
		? { method: parseOptionalWithSchema(options.method, MethodSchema, "method") }
		: {}),
	...(options.school !== undefined
		? { school: parseOptionalWithSchema(options.school, SchoolSchema, "school") }
		: {}),
	...(options.timezone ? { timezone: options.timezone.trim() } : {}),
});

/**
 * Handles the `config` subcommand: show, clear, or update persisted settings.
 */
export class ConfigCommand {
	constructor(private readonly configRepository: ConfigRepository) {}

	async execute(options: ConfigCommandOptions): Promise<void> {
		if (options.clear) {
			this.configRepository.clearAll();
			console.log(pc.green("Configuration cleared."));
			return;
		}

		if (options.show) {
			this.printCurrentConfig();
			return;
		}

		if (!this.hasConfigUpdateFlags(options)) {
			console.log(
				pc.dim("No config updates provided. Use `ramadan-cli-pro config --show` to inspect."),
			);
			return;
		}

		const updates = parseConfigUpdates(options);
		const currentLocation = this.configRepository.getStoredLocation();
		const nextLocation = {
			...(updates.city !== undefined
				? { city: updates.city }
				: currentLocation.city
					? { city: currentLocation.city }
					: {}),
			...(updates.country !== undefined
				? { country: updates.country }
				: currentLocation.country
					? { country: currentLocation.country }
					: {}),
			...(updates.latitude !== undefined
				? { latitude: updates.latitude }
				: currentLocation.latitude !== undefined
					? { latitude: currentLocation.latitude }
					: {}),
			...(updates.longitude !== undefined
				? { longitude: updates.longitude }
				: currentLocation.longitude !== undefined
					? { longitude: currentLocation.longitude }
					: {}),
		};
		this.configRepository.setStoredLocation(nextLocation);

		if (updates.method !== undefined) {
			this.configRepository.setStoredMethod(updates.method);
		}
		if (updates.school !== undefined) {
			this.configRepository.setStoredSchool(updates.school);
		}
		if (updates.timezone) {
			this.configRepository.setStoredTimezone(updates.timezone);
		}

		console.log(pc.green("Configuration updated."));
	}

	private hasConfigUpdateFlags(options: ConfigCommandOptions): boolean {
		return Boolean(
			options.city ||
				options.country ||
				options.latitude !== undefined ||
				options.longitude !== undefined ||
				options.method !== undefined ||
				options.school !== undefined ||
				options.timezone,
		);
	}

	private printCurrentConfig(): void {
		const location = this.configRepository.getStoredLocation();
		const settings = this.configRepository.getStoredPrayerSettings();
		const firstRozaDate = this.configRepository.getStoredFirstRozaDate();

		console.log(pc.dim("Current configuration:"));
		if (location.city) console.log(`  City: ${location.city}`);
		if (location.country) console.log(`  Country: ${location.country}`);
		if (location.latitude !== undefined) console.log(`  Latitude: ${location.latitude}`);
		if (location.longitude !== undefined) console.log(`  Longitude: ${location.longitude}`);
		console.log(`  Method: ${settings.method}`);
		console.log(`  School: ${settings.school}`);
		if (settings.timezone) console.log(`  Timezone: ${settings.timezone}`);
		if (firstRozaDate) console.log(`  First Roza Date: ${firstRozaDate}`);
	}
}
