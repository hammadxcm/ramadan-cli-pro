/**
 * @module setup/first-run
 * @description Interactive first-run setup wizard using @clack/prompts.
 * Guides the user through city, country, method, school, and timezone configuration.
 */

import * as p from "@clack/prompts";
import { getRecommendedMethod, getRecommendedSchool } from "../data/recommendations.js";
import type { GeoProviderFactory } from "../providers/geo/geo-provider.factory.js";
import type { IGeocodingProvider } from "../providers/geocoding/geocoding.interface.js";
import type { ConfigRepository } from "../repositories/config.repository.js";
import type { GeoLocation } from "../types/geo.js";
import { MOON_EMOJI, ramadanGreen } from "../ui/theme.js";
import { normalize, toNonEmptyString } from "../utils/string.js";
import { getMethodOptions, getSchoolOptions } from "./setup.utils.js";

type TimezoneChoice = "detected" | "custom" | "skip";

const DEFAULT_METHOD = 2;

interface SelectOption<TValue> {
	readonly value: TValue;
	readonly label: string;
	readonly hint?: string;
}

const toNumberSelection = (value: unknown): number | null => {
	if (typeof value !== "number") {
		return null;
	}
	return value;
};

const toTimezoneChoice = (value: unknown, hasDetectedOption: boolean): TimezoneChoice | null => {
	if (value === "custom") return "custom";
	if (value === "skip") return "skip";
	if (hasDetectedOption && value === "detected") return "detected";
	return null;
};

const cityCountryMatchesGuess = (city: string, country: string, guess: GeoLocation): boolean =>
	normalize(city) === normalize(guess.city) && normalize(country) === normalize(guess.country);

/**
 * Interactive setup wizard that runs on first use (or when no stored config exists).
 * Prompts for city, country, calculation method, school, and timezone.
 */
export class FirstRunSetup {
	constructor(
		private readonly configRepository: ConfigRepository,
		private readonly geoProviderFactory: GeoProviderFactory,
		private readonly geocodingProvider: IGeocodingProvider,
	) {}

	private async resolveDetectedDetails(
		city: string,
		country: string,
		ipGuess: GeoLocation | null,
	): Promise<
		Readonly<{
			latitude?: number;
			longitude?: number;
			timezone?: string;
		}>
	> {
		const geocoded = await this.geocodingProvider.search(`${city}, ${country}`);
		if (geocoded) {
			return {
				latitude: geocoded.latitude,
				longitude: geocoded.longitude,
				...(geocoded.timezone !== undefined ? { timezone: geocoded.timezone } : {}),
			};
		}

		if (!ipGuess) return {};
		if (!cityCountryMatchesGuess(city, country, ipGuess)) return {};

		return {
			latitude: ipGuess.latitude,
			longitude: ipGuess.longitude,
			timezone: ipGuess.timezone,
		};
	}

	private handleCancelledPrompt(): false {
		p.cancel("Setup cancelled");
		return false;
	}

	async run(): Promise<boolean> {
		p.intro(ramadanGreen(`${MOON_EMOJI} Ramadan CLI Pro Setup`));

		const ipSpinner = p.spinner();
		ipSpinner.start(`${MOON_EMOJI} Detecting your location...`);
		const ipGuess = await this.geoProviderFactory.detect();
		ipSpinner.stop(
			ipGuess ? `Detected: ${ipGuess.city}, ${ipGuess.country}` : "Could not detect location",
		);

		const cityAnswer = await p.text({
			message: "Enter your city",
			placeholder: "e.g., Lahore",
			...(ipGuess?.city ? { defaultValue: ipGuess.city, initialValue: ipGuess.city } : {}),
			validate: (value) => {
				if (!value.trim()) return "City is required.";
				return undefined;
			},
		});
		if (p.isCancel(cityAnswer)) return this.handleCancelledPrompt();

		const city = toNonEmptyString(cityAnswer);
		if (!city) {
			p.log.error("Invalid city value.");
			return false;
		}

		const countryAnswer = await p.text({
			message: "Enter your country",
			placeholder: "e.g., Pakistan",
			...(ipGuess?.country
				? {
						defaultValue: ipGuess.country,
						initialValue: ipGuess.country,
					}
				: {}),
			validate: (value) => {
				if (!value.trim()) return "Country is required.";
				return undefined;
			},
		});
		if (p.isCancel(countryAnswer)) return this.handleCancelledPrompt();

		const country = toNonEmptyString(countryAnswer);
		if (!country) {
			p.log.error("Invalid country value.");
			return false;
		}

		const detailsSpinner = p.spinner();
		detailsSpinner.start(`${MOON_EMOJI} Resolving city details...`);
		const detectedDetails = await this.resolveDetectedDetails(city, country, ipGuess);
		detailsSpinner.stop(
			detectedDetails.timezone
				? `Detected timezone: ${detectedDetails.timezone}`
				: "Could not detect timezone for this city",
		);

		const recommendedMethod = getRecommendedMethod(country);
		const methodAnswer = await p.select({
			message: "Select calculation method",
			initialValue: recommendedMethod ?? DEFAULT_METHOD,
			options: [...getMethodOptions(recommendedMethod)],
		});
		if (p.isCancel(methodAnswer)) return this.handleCancelledPrompt();

		const method = toNumberSelection(methodAnswer);
		if (method === null) {
			p.log.error("Invalid method selection.");
			return false;
		}

		const recommendedSchool = getRecommendedSchool(country);
		const schoolAnswer = await p.select({
			message: "Select Asr school",
			initialValue: recommendedSchool,
			options: [...getSchoolOptions(recommendedSchool)],
		});
		if (p.isCancel(schoolAnswer)) return this.handleCancelledPrompt();

		const school = toNumberSelection(schoolAnswer);
		if (school === null) {
			p.log.error("Invalid school selection.");
			return false;
		}

		const hasDetectedTimezone = Boolean(detectedDetails.timezone);
		const timezoneOptions: ReadonlyArray<SelectOption<TimezoneChoice>> = hasDetectedTimezone
			? [
					{
						value: "detected" as const,
						label: `Use detected timezone (${detectedDetails.timezone ?? ""})`,
					},
					{ value: "custom" as const, label: "Set custom timezone" },
					{
						value: "skip" as const,
						label: "Do not set timezone override",
					},
				]
			: [
					{ value: "custom" as const, label: "Set custom timezone" },
					{
						value: "skip" as const,
						label: "Do not set timezone override",
					},
				];

		const timezoneAnswer = await p.select({
			message: "Timezone preference",
			initialValue: hasDetectedTimezone ? ("detected" as const) : ("skip" as const),
			options: [...timezoneOptions],
		});
		if (p.isCancel(timezoneAnswer)) return this.handleCancelledPrompt();

		const timezoneChoice = toTimezoneChoice(timezoneAnswer, hasDetectedTimezone);
		if (!timezoneChoice) {
			p.log.error("Invalid timezone selection.");
			return false;
		}

		let timezone = timezoneChoice === "detected" ? detectedDetails.timezone : undefined;

		if (timezoneChoice === "custom") {
			const timezoneInput = await p.text({
				message: "Enter timezone",
				placeholder: detectedDetails.timezone ?? "e.g., Asia/Karachi",
				...(detectedDetails.timezone
					? {
							defaultValue: detectedDetails.timezone,
							initialValue: detectedDetails.timezone,
						}
					: {}),
				validate: (value) => {
					if (!value.trim()) return "Timezone is required.";
					return undefined;
				},
			});
			if (p.isCancel(timezoneInput)) return this.handleCancelledPrompt();

			const customTimezone = toNonEmptyString(timezoneInput);
			if (!customTimezone) {
				p.log.error("Invalid timezone value.");
				return false;
			}
			timezone = customTimezone;
		}

		this.configRepository.setStoredLocation({
			city,
			country,
			...(detectedDetails.latitude !== undefined ? { latitude: detectedDetails.latitude } : {}),
			...(detectedDetails.longitude !== undefined ? { longitude: detectedDetails.longitude } : {}),
		});
		this.configRepository.setStoredMethod(method);
		this.configRepository.setStoredSchool(school);
		this.configRepository.setStoredTimezone(timezone);

		p.outro(ramadanGreen(`${MOON_EMOJI} Setup complete.`));
		return true;
	}
}
