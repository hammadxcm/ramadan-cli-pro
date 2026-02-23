/**
 * @module commands/profile
 * @description Manages named location profiles for quick switching.
 */

import pc from "picocolors";
import { CommandError } from "../errors/command.error.js";
import type { ConfigRepository } from "../repositories/config.repository.js";
import type { I18nService } from "../services/i18n.service.js";
import { createConfStore } from "../utils/store.js";

interface LocationProfile {
	readonly city: string;
	readonly country?: string | undefined;
}

type ProfileStore = Record<string, LocationProfile>;

export interface ProfileCommandOptions {
	readonly action: "add" | "use" | "list" | "delete";
	readonly name?: string | undefined;
	readonly city?: string | undefined;
	readonly country?: string | undefined;
}

/**
 * Manages named location profiles for quick city switching.
 */
export class ProfileCommand {
	private readonly store;
	private readonly i18n: I18nService | undefined;

	constructor(
		private readonly configRepository: ConfigRepository,
		storeCwd?: string,
		i18nService?: I18nService,
	) {
		this.i18n = i18nService;
		this.store = createConfStore<{ profiles: ProfileStore }>({
			projectName: "ramadan-cli-pro-profiles",
			cwd: storeCwd,
			defaults: { profiles: {} },
		});
	}

	private t(key: string, fallback: string, options?: Record<string, unknown>): string {
		return this.i18n ? this.i18n.t(key, options) : fallback;
	}

	async execute(options: ProfileCommandOptions): Promise<void> {
		switch (options.action) {
			case "add":
				this.addProfile(options);
				break;
			case "use":
				this.useProfile(options.name);
				break;
			case "list":
				this.listProfiles();
				break;
			case "delete":
				this.deleteProfile(options.name);
				break;
			default:
				throw new CommandError(
					this.t("profile.invalidAction", "Invalid action. Use: add, use, list, delete"),
				);
		}
	}

	private addProfile(options: ProfileCommandOptions): void {
		if (!options.name) {
			throw new CommandError(this.t("profile.nameRequired", "Profile name is required."));
		}
		if (!options.city) {
			throw new CommandError(this.t("profile.cityRequired", "City is required. Use --city <city>"));
		}

		const profiles = this.store.get("profiles");
		profiles[options.name] = {
			city: options.city,
			...(options.country ? { country: options.country } : {}),
		};
		this.store.set("profiles", profiles);

		const location = `${options.city}${options.country ? `, ${options.country}` : ""}`;
		console.log(
			pc.green(
				this.t("profile.saved", `Profile "${options.name}" saved (${location}).`, {
					name: options.name,
					location,
				}),
			),
		);
	}

	private useProfile(name: string | undefined): void {
		if (!name) {
			throw new CommandError(this.t("profile.nameRequired", "Profile name is required."));
		}

		const profiles = this.store.get("profiles");
		const profile = profiles[name];
		if (!profile) {
			throw new CommandError(this.t("profile.notFound", `Profile "${name}" not found.`, { name }));
		}

		this.configRepository.setStoredLocation({
			city: profile.city,
			country: profile.country,
		});

		const location = `${profile.city}${profile.country ? `, ${profile.country}` : ""}`;
		console.log(
			pc.green(
				this.t("profile.switched", `Switched to profile "${name}" (${location}).`, {
					name,
					location,
				}),
			),
		);
	}

	private listProfiles(): void {
		const profiles = this.store.get("profiles");
		const entries = Object.entries(profiles);

		if (entries.length === 0) {
			console.log(
				pc.dim(
					this.t(
						"profile.noProfiles",
						"No profiles saved. Use `ramadan-pro profile add <name> --city <city>` to create one.",
					),
				),
			);
			return;
		}

		console.log("");
		console.log(pc.bold(`  ${this.t("profile.title", "Location Profiles")}`));
		console.log("");
		for (const [name, profile] of entries) {
			console.log(
				`  ${pc.cyan(name)} - ${profile.city}${profile.country ? `, ${profile.country}` : ""}`,
			);
		}
		console.log("");
	}

	private deleteProfile(name: string | undefined): void {
		if (!name) {
			throw new CommandError(this.t("profile.nameRequired", "Profile name is required."));
		}

		const profiles = this.store.get("profiles");
		if (!profiles[name]) {
			throw new CommandError(this.t("profile.notFound", `Profile "${name}" not found.`, { name }));
		}

		delete profiles[name];
		this.store.set("profiles", profiles);

		console.log(pc.green(this.t("profile.deleted", `Profile "${name}" deleted.`, { name })));
	}
}
