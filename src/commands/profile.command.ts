/**
 * @module commands/profile
 * @description Manages named location profiles for quick switching.
 */

import Conf from "conf";
import pc from "picocolors";
import type { ConfigRepository } from "../repositories/config.repository.js";

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
	private readonly store: Conf<{ profiles: ProfileStore }>;

	constructor(
		private readonly configRepository: ConfigRepository,
		storeCwd?: string,
	) {
		const isTestRuntime = process.env.VITEST === "true" || process.env.NODE_ENV === "test";
		this.store = new Conf<{ profiles: ProfileStore }>({
			projectName: "ramadan-cli-pro-profiles",
			...(storeCwd ? { cwd: storeCwd } : isTestRuntime ? { cwd: "/tmp" } : {}),
			defaults: { profiles: {} },
		});
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
				console.error(pc.red("Invalid action. Use: add, use, list, delete"));
				process.exit(1);
		}
	}

	private addProfile(options: ProfileCommandOptions): void {
		if (!options.name) {
			console.error(pc.red("Profile name is required."));
			process.exit(1);
			return;
		}
		if (!options.city) {
			console.error(pc.red("City is required. Use --city <city>"));
			process.exit(1);
			return;
		}

		const profiles = this.store.get("profiles");
		profiles[options.name] = {
			city: options.city,
			...(options.country ? { country: options.country } : {}),
		};
		this.store.set("profiles", profiles);

		console.log(
			pc.green(
				`Profile "${options.name}" saved (${options.city}${options.country ? `, ${options.country}` : ""}).`,
			),
		);
	}

	private useProfile(name: string | undefined): void {
		if (!name) {
			console.error(pc.red("Profile name is required."));
			process.exit(1);
			return;
		}

		const profiles = this.store.get("profiles");
		const profile = profiles[name];
		if (!profile) {
			console.error(pc.red(`Profile "${name}" not found.`));
			process.exit(1);
			return;
		}

		this.configRepository.setStoredLocation({
			city: profile.city,
			country: profile.country,
		});

		console.log(
			pc.green(
				`Switched to profile "${name}" (${profile.city}${profile.country ? `, ${profile.country}` : ""}).`,
			),
		);
	}

	private listProfiles(): void {
		const profiles = this.store.get("profiles");
		const entries = Object.entries(profiles);

		if (entries.length === 0) {
			console.log(
				pc.dim(
					"No profiles saved. Use `ramadan-pro profile add <name> --city <city>` to create one.",
				),
			);
			return;
		}

		console.log("");
		console.log(pc.bold("  Location Profiles"));
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
			console.error(pc.red("Profile name is required."));
			process.exit(1);
			return;
		}

		const profiles = this.store.get("profiles");
		if (!profiles[name]) {
			console.error(pc.red(`Profile "${name}" not found.`));
			process.exit(1);
		}

		delete profiles[name];
		this.store.set("profiles", profiles);

		console.log(pc.green(`Profile "${name}" deleted.`));
	}
}
