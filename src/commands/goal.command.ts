/**
 * @module commands/goal
 * @description Manages Ramadan goals — add, update, list, delete.
 */

import pc from "picocolors";
import { CommandError } from "../errors/command.error.js";
import type { GoalService } from "../services/goal.service.js";
import type { I18nService } from "../services/i18n.service.js";

export interface GoalCommandOptions {
	readonly action: "add" | "update" | "list" | "delete";
	readonly title?: string | undefined;
	readonly target?: number | undefined;
	readonly unit?: string | undefined;
	readonly id?: string | undefined;
	readonly progress?: number | undefined;
}

/**
 * CLI command for managing Ramadan goals.
 */
export class GoalCommand {
	private readonly i18n: I18nService | undefined;

	constructor(
		private readonly goalService: GoalService,
		i18nService?: I18nService,
	) {
		this.i18n = i18nService;
	}

	private t(key: string, fallback: string, options?: Record<string, unknown>): string {
		return this.i18n ? this.i18n.t(key, options) : fallback;
	}

	async execute(options: GoalCommandOptions): Promise<void> {
		switch (options.action) {
			case "add":
				this.addGoal(options);
				break;
			case "update":
				this.updateGoal(options);
				break;
			case "list":
				this.listGoals();
				break;
			case "delete":
				this.deleteGoal(options);
				break;
			default:
				throw new CommandError(
					this.t("goal.invalidAction", "Invalid action. Use: add, update, list, delete"),
				);
		}
	}

	private addGoal(options: GoalCommandOptions): void {
		if (!options.title || !options.target || !options.unit) {
			throw new CommandError(this.t("goal.requiredAdd", "Required: --title, --target, --unit"));
		}
		const goal = this.goalService.addGoal(options.title, options.target, options.unit);
		console.log(
			pc.green(
				this.t("goal.added", `Goal added: "${goal.title}" (${goal.target} ${goal.unit})`, {
					title: goal.title,
					target: goal.target,
					unit: goal.unit,
				}),
			),
		);
	}

	private updateGoal(options: GoalCommandOptions): void {
		if (!options.id || options.progress === undefined) {
			throw new CommandError(this.t("goal.requiredUpdate", "Required: --id, --progress"));
		}
		const updated = this.goalService.updateGoal(options.id, options.progress);
		if (!updated) {
			throw new CommandError(
				this.t("goal.notFound", `Goal "${options.id}" not found.`, { id: options.id }),
			);
		}
		console.log(
			pc.green(
				this.t(
					"goal.updated",
					`Goal updated: "${updated.title}" — ${updated.current}/${updated.target} ${updated.unit}`,
					{
						title: updated.title,
						current: updated.current,
						target: updated.target,
						unit: updated.unit,
					},
				),
			),
		);
	}

	private listGoals(): void {
		const goals = this.goalService.listGoals();
		if (goals.length === 0) {
			console.log(
				pc.dim(
					`  ${this.t("goal.noGoals", "No goals set. Use `ramadan goal add --title ... --target ... --unit ...`")}`,
				),
			);
			return;
		}

		console.log("");
		console.log(pc.bold(pc.green(`  ${this.t("goal.title", "Ramadan Goals")}`)));
		console.log("");

		for (const goal of goals) {
			const percent =
				goal.target > 0 ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : 0;
			const bar = this.progressBar(percent);
			const status = goal.current >= goal.target ? pc.green(" \u2713") : "";
			console.log(`  ${pc.bold(goal.title)} [${goal.id}]`);
			console.log(`  ${bar} ${percent}% (${goal.current}/${goal.target} ${goal.unit})${status}`);
			console.log("");
		}
	}

	private deleteGoal(options: GoalCommandOptions): void {
		if (!options.id) {
			throw new CommandError(this.t("goal.requiredDelete", "Required: goal ID"));
		}
		const deleted = this.goalService.deleteGoal(options.id);
		if (!deleted) {
			throw new CommandError(
				this.t("goal.notFound", `Goal "${options.id}" not found.`, { id: options.id }),
			);
		}
		console.log(
			pc.green(this.t("goal.deleted", `Goal "${options.id}" deleted.`, { id: options.id })),
		);
	}

	private progressBar(percent: number): string {
		const width = 20;
		const filled = Math.round((percent / 100) * width);
		const empty = width - filled;
		return `${pc.green("\u2588".repeat(filled))}${pc.dim("\u2591".repeat(empty))}`;
	}
}
