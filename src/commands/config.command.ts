/**
 * @module commands/config
 * @description Non-interactive `config` subcommand for viewing and updating
 * persisted settings (location, method, school, timezone).
 */

import { readFileSync } from "node:fs";
import pc from "picocolors";
import { type z, z as zod } from "zod";
import type { ConfigRepository } from "../repositories/config.repository.js";
import {
	LatitudeSchema,
	LongitudeSchema,
	MethodSchema,
	SchoolSchema,
} from "../schemas/config.schema.js";

const ImportConfigSchema = zod.object({
	city: zod.string().optional(),
	country: zod.string().optional(),
	latitude: LatitudeSchema.optional(),
	longitude: LongitudeSchema.optional(),
	method: MethodSchema.optional(),
	school: SchoolSchema.optional(),
	timezone: zod.string().optional(),
});

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
	readonly export?: boolean | undefined;
	readonly import?: string | undefined;
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

		if (options.export) {
			this.exportConfig();
			return;
		}

		if (options.import) {
			this.importConfig(options.import);
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

	private exportConfig(): void {
		const location = this.configRepository.getStoredLocation();
		const settings = this.configRepository.getStoredPrayerSettings();
		const exported = {
			...(location.city ? { city: location.city } : {}),
			...(location.country ? { country: location.country } : {}),
			...(location.latitude !== undefined ? { latitude: location.latitude } : {}),
			...(location.longitude !== undefined ? { longitude: location.longitude } : {}),
			method: settings.method,
			school: settings.school,
			...(settings.timezone ? { timezone: settings.timezone } : {}),
		};
		console.log(JSON.stringify(exported, null, 2));
	}

	private importConfig(filePath: string): void {
		let raw: string;
		try {
			raw = readFileSync(filePath, "utf-8");
		} catch {
			console.error(pc.red(`Could not read file: ${filePath}`));
			process.exit(1);
		}

		let parsed: unknown;
		try {
			parsed = JSON.parse(raw);
		} catch {
			console.error(pc.red("Invalid JSON in config file."));
			process.exit(1);
		}

		const result = ImportConfigSchema.safeParse(parsed);
		if (!result.success) {
			console.error(pc.red("Invalid config format:"));
			for (const issue of result.error.issues) {
				console.error(pc.dim(`  ${issue.path.join(".")}: ${issue.message}`));
			}
			process.exit(1);
		}

		const data = result.data;
		this.configRepository.setStoredLocation({
			city: data.city,
			country: data.country,
			latitude: data.latitude,
			longitude: data.longitude,
		});
		if (data.method !== undefined) this.configRepository.setStoredMethod(data.method);
		if (data.school !== undefined) this.configRepository.setStoredSchool(data.school);
		if (data.timezone) this.configRepository.setStoredTimezone(data.timezone);

		console.log(pc.green("Configuration imported successfully."));
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
