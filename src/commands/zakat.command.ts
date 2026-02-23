/**
 * @module commands/zakat
 * @description Zakat calculator command.
 */

import pc from "picocolors";
import type { I18nService } from "../services/i18n.service.js";
import type { ZakatService } from "../services/zakat.service.js";

export interface ZakatCommandOptions {
	readonly cash?: number | undefined;
	readonly gold?: number | undefined;
	readonly silver?: number | undefined;
	readonly investments?: number | undefined;
	readonly property?: number | undefined;
	readonly debts?: number | undefined;
}

/**
 * CLI command for calculating Zakat.
 */
export class ZakatCommand {
	private readonly i18n: I18nService | undefined;

	constructor(
		private readonly zakatService: ZakatService,
		i18nService?: I18nService,
	) {
		this.i18n = i18nService;
	}

	private t(key: string, fallback: string, options?: Record<string, unknown>): string {
		return this.i18n ? this.i18n.t(key, options) : fallback;
	}

	async execute(options: ZakatCommandOptions): Promise<void> {
		const result = this.zakatService.calculateZakat({
			cash: options.cash,
			gold: options.gold,
			silver: options.silver,
			investments: options.investments,
			property: options.property,
			debts: options.debts,
		});

		console.log("");
		console.log(pc.bold(pc.green(`  ${this.t("zakat.title", "Zakat Calculator")}`)));
		console.log("");

		console.log(
			`  ${pc.bold(this.t("zakat.totalWealth", "Total Wealth:"))}     $${result.totalWealth.toFixed(2)}`,
		);
		if (result.totalDeductions > 0) {
			console.log(
				`  ${pc.bold(this.t("zakat.deductions", "Deductions:"))}       $${result.totalDeductions.toFixed(2)}`,
			);
		}
		console.log(
			`  ${pc.bold(this.t("zakat.netWorth", "Net Worth:"))}        $${result.netWorth.toFixed(2)}`,
		);
		console.log("");

		console.log(
			`  ${pc.dim(`${this.t("zakat.nisabGold", "Nisab (Gold):")}  $${result.nisabGold.toFixed(2)}`)}`,
		);
		console.log(
			`  ${pc.dim(`${this.t("zakat.nisabSilver", "Nisab (Silver):")} $${result.nisabSilver.toFixed(2)}`)}`,
		);
		console.log("");

		if (result.isAboveNisab) {
			console.log(
				`  ${pc.bold(pc.green(`${this.t("zakat.zakatDue", "Zakat Due:")} $${result.zakatDue.toFixed(2)}`))} ${pc.dim("(2.5%)")}`,
			);
		} else {
			console.log(
				pc.dim(
					`  ${this.t("zakat.belowNisab", "Net worth is below nisab threshold. No Zakat due.")}`,
				),
			);
		}

		console.log("");
	}
}
