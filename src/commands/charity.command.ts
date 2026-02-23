/**
 * @module commands/charity
 * @description Charity/sadaqah tracker command.
 */

import pc from "picocolors";
import { CommandError } from "../errors/command.error.js";
import type { CharityService } from "../services/charity.service.js";
import type { I18nService } from "../services/i18n.service.js";

export interface CharityCommandOptions {
	readonly action: "add" | "list" | "summary";
	readonly amount?: number | undefined;
	readonly description?: string | undefined;
	readonly category?: string | undefined;
	readonly id?: string | undefined;
}

/**
 * CLI command for tracking charity/sadaqah.
 */
export class CharityCommand {
	private readonly i18n: I18nService | undefined;

	constructor(
		private readonly charityService: CharityService,
		i18nService?: I18nService,
	) {
		this.i18n = i18nService;
	}

	private t(key: string, fallback: string, options?: Record<string, unknown>): string {
		return this.i18n ? this.i18n.t(key, options) : fallback;
	}

	async execute(options: CharityCommandOptions): Promise<void> {
		switch (options.action) {
			case "add":
				this.addEntry(options);
				break;
			case "list":
				this.listEntries();
				break;
			case "summary":
				this.showSummary();
				break;
			default:
				throw new CommandError(
					this.t("charity.invalidAction", "Invalid action. Use: add, list, summary"),
				);
		}
	}

	private addEntry(options: CharityCommandOptions): void {
		if (!options.amount || !options.description) {
			throw new CommandError(this.t("charity.requiredAdd", "Required: --amount, --description"));
		}
		const entry = this.charityService.addEntry(
			options.amount,
			options.description,
			options.category ?? "general",
		);
		console.log(
			pc.green(
				this.t("charity.recorded", `Charity recorded: $${entry.amount} — ${entry.description}`, {
					amount: entry.amount,
					description: entry.description,
				}),
			),
		);
	}

	private listEntries(): void {
		const entries = this.charityService.listEntries();
		if (entries.length === 0) {
			console.log(
				pc.dim(
					`  ${this.t("charity.noEntries", "No charity entries. Use `ramadan charity add --amount ... --description ...`")}`,
				),
			);
			return;
		}

		console.log("");
		console.log(pc.bold(pc.green(`  ${this.t("charity.logTitle", "Charity/Sadaqah Log")}`)));
		console.log("");

		for (const entry of entries) {
			console.log(
				`  ${pc.dim(entry.date)} ${pc.bold(`$${entry.amount}`)} — ${entry.description} ${pc.dim(`[${entry.category}]`)}`,
			);
		}

		const total = this.charityService.getTotalAmount();
		console.log("");
		console.log(`  ${pc.bold(this.t("charity.total", "Total:"))} ${pc.green(`$${total}`)}`);
		console.log("");
	}

	private showSummary(): void {
		const total = this.charityService.getTotalAmount();
		const entries = this.charityService.listEntries();

		console.log("");
		console.log(pc.bold(pc.green(`  ${this.t("charity.summaryTitle", "Charity Summary")}`)));
		console.log("");
		console.log(
			`  ${pc.bold(this.t("charity.totalDonated", "Total donated:"))} ${pc.green(`$${total}`)}`,
		);
		console.log(`  ${pc.bold(this.t("charity.entries", "Entries:"))} ${entries.length}`);
		console.log("");
	}
}
