/**
 * @module cli
 * @description CLI entry point. Configures Commander.js with all commands,
 * options, and argument parsing, then dispatches to the appropriate command handler.
 */

import { createRequire } from "node:module";
import { InvalidArgumentError, program } from "commander";
import pc from "picocolors";
import updateNotifier from "update-notifier";
import type { AdhkarCommand } from "./commands/adhkar.command.js";
import type { CacheCommand, CacheCommandOptions } from "./commands/cache.command.js";
import type { CharityCommand, CharityCommandOptions } from "./commands/charity.command.js";
import type { CompareCommand } from "./commands/compare.command.js";
import { generateCompletion } from "./commands/completion.command.js";
import type { ConfigCommandOptions } from "./commands/config.command.js";
import type { ExportCommand, ExportCommandOptions } from "./commands/export.command.js";
import type { GoalCommand, GoalCommandOptions } from "./commands/goal.command.js";
import type { HadithCommand } from "./commands/hadith.command.js";
import type { NotifyCommandOptions } from "./commands/notify.command.js";
import type { QuranCommand } from "./commands/quran.command.js";
import type { StatsCommand } from "./commands/stats.command.js";
import type { WidgetCommand } from "./commands/widget.command.js";
import type { ZakatCommand, ZakatCommandOptions } from "./commands/zakat.command.js";
import { createContainer } from "./container.js";
import { CommandError } from "./errors/command.error.js";
import { setActivePrimary } from "./ui/theme.js";

/**
 * Wraps an async action handler with centralized CommandError handling.
 * If the action throws a CommandError, the message is printed and process exits.
 */
const handleAction = <T extends (...args: never[]) => Promise<void>>(fn: T): T =>
	(async (...args: Parameters<T>) => {
		try {
			await fn(...args);
		} catch (error) {
			if (error instanceof CommandError) {
				console.error(pc.red(error.message));
				process.exit(1);
			}
			throw error;
		}
	}) as unknown as T;

/**
 * Parsed root-level CLI options from Commander.js.
 */
interface RootOptions {
	readonly city?: string | undefined;
	readonly all?: boolean | undefined;
	readonly number?: number | undefined;
	readonly plain?: boolean | undefined;
	readonly json?: boolean | undefined;
	readonly status?: boolean | undefined;
	readonly tui?: boolean | undefined;
	readonly locale?: string | undefined;
	readonly theme?: string | undefined;
	readonly firstRozaDate?: string | undefined;
	readonly clearFirstRozaDate?: boolean | undefined;
}

const require = createRequire(import.meta.url);
const pkg = require("../package.json") as { readonly name: string; readonly version: string };

updateNotifier({ pkg }).notify();

/**
 * Commander argument parser for the `--number` flag.
 * Validates that the value is an integer between 1 and 30.
 *
 * @param value - Raw string from the CLI.
 * @returns The parsed roza number.
 * @throws {InvalidArgumentError} If the value is not a valid roza number.
 */
const parseRozaNumber = (value: string): number => {
	const parsed = Number.parseInt(value, 10);
	const isInvalid = Number.isNaN(parsed) || !Number.isInteger(parsed) || parsed < 1 || parsed > 30;

	if (isInvalid) {
		throw new InvalidArgumentError("Roza number must be between 1 and 30.");
	}

	return parsed;
};

const container = createContainer();

// Activate theme and initialize i18n before any command runs
program.hook("preAction", async (thisCommand) => {
	const opts = thisCommand.optsWithGlobals() as { theme?: string; locale?: string };
	const activeTheme = container.themeService.getActiveTheme(opts.theme);
	setActivePrimary(activeTheme.cli.primary);
	await container.i18nService.init(opts.locale);
});

program
	.name("ramadan-cli-pro")
	.description("Professional-grade Ramadan CLI for Sehar and Iftar timings")
	.enablePositionalOptions()
	.version(pkg.version, "-v, --version")
	.argument("[city]", 'City name (e.g. "San Francisco", "sf", "Vancouver", "Lahore")')
	.option("-c, --city <city>", "City")
	.option("-a, --all", "Show complete Ramadan month")
	.option("-n, --number <number>", "Show a specific roza day (1-30)", parseRozaNumber)
	.option("-p, --plain", "Plain text output")
	.option("-j, --json", "JSON output")
	.option("-s, --status", "Status line output (next event only, for status bars)")
	.option("-t, --tui", "Launch TUI dashboard")
	.option("-l, --locale <locale>", "Language (en, ar, ur, tr, ms, bn, fr, id, es, de, hi, fa)")
	.option(
		"--theme <name>",
		"Color theme (ramadan-green, classic-gold, ocean-blue, royal-purple, minimal-mono, high-contrast)",
	)
	.option("--first-roza-date <YYYY-MM-DD>", "Set and use a custom first roza date")
	.option("--clear-first-roza-date", "Clear custom first roza date and use API Ramadan date")
	.action(
		handleAction(async (cityArg: string | undefined, opts: RootOptions) => {
			const context = {
				city: cityArg || opts.city,
				all: opts.all,
				rozaNumber: opts.number,
				plain: opts.plain,
				json: opts.json,
				status: opts.status,
				tui: opts.tui,
				locale: opts.locale,
				firstRozaDate: opts.firstRozaDate,
				clearFirstRozaDate: opts.clearFirstRozaDate,
			};

			if (context.tui) {
				const dashboard = container.commandFactory.get("dashboard");
				await dashboard?.execute(context);
				return;
			}

			const ramadan = container.commandFactory.get("ramadan") as {
				validate: (ctx: typeof context) => void;
				execute: (ctx: typeof context) => Promise<void>;
			};
			ramadan.validate(context);
			await ramadan.execute(context);
		}),
	);

program
	.command("reset")
	.description("Clear saved configuration")
	.action(
		handleAction(async () => {
			const reset = container.commandFactory.get("reset") as { execute: () => void };
			reset.execute();
		}),
	);

program
	.command("config")
	.description("Configure saved settings (non-interactive)")
	.option("--city <city>", "Save city")
	.option("--country <country>", "Save country")
	.option("--latitude <latitude>", "Save latitude (-90 to 90)")
	.option("--longitude <longitude>", "Save longitude (-180 to 180)")
	.option("--method <id>", "Save calculation method (0-23)")
	.option("--school <id>", "Save school (0=Shafi, 1=Hanafi)")
	.option("--timezone <timezone>", "Save timezone (e.g., America/Los_Angeles)")
	.option("--show", "Show current configuration")
	.option("--clear", "Clear saved configuration")
	.option("--export", "Export configuration as JSON to stdout")
	.option("--import <file>", "Import configuration from a JSON file")
	.action(
		handleAction(async (opts: ConfigCommandOptions) => {
			const config = container.commandFactory.get("config") as {
				execute: (opts: ConfigCommandOptions) => Promise<void>;
			};
			await config.execute(opts);
		}),
	);

program
	.command("dashboard")
	.description("Launch TUI dashboard")
	.action(
		handleAction(async () => {
			const dashboard = container.commandFactory.get("dashboard");
			await dashboard?.execute({});
		}),
	);

program
	.command("notify")
	.description("Manage notification preferences")
	.option("--enable", "Enable notifications")
	.option("--disable", "Disable notifications")
	.option("--sehar", "Toggle Sehar reminder")
	.option("--iftar", "Toggle Iftar reminder")
	.option("--minutes <minutes>", "Minutes before event for reminder (1-120)", (v: string) => {
		const n = Number.parseInt(v, 10);
		if (Number.isNaN(n) || n < 1 || n > 120) {
			throw new InvalidArgumentError("Minutes must be between 1 and 120.");
		}
		return n;
	})
	.action(
		handleAction(async (opts: NotifyCommandOptions) => {
			const notify = container.commandFactory.get("notify");
			await notify?.execute(opts);
		}),
	);

program
	.command("qibla")
	.description("Show Qibla direction for your location")
	.argument("[city]", "City name or alias")
	.action(
		handleAction(async (city: string | undefined) => {
			const qibla = container.commandFactory.get("qibla");
			await qibla?.execute({ city });
		}),
	);

program
	.command("dua")
	.description("Show the dua of the day for Ramadan")
	.option("-d, --day <number>", "Show dua for a specific day (1-30)", (v: string) => {
		const n = Number.parseInt(v, 10);
		if (Number.isNaN(n) || n < 1 || n > 30) {
			throw new InvalidArgumentError("Day number must be between 1 and 30.");
		}
		return n;
	})
	.action(
		handleAction(async (opts: { day?: number }) => {
			const dua = container.commandFactory.get("dua");
			await dua?.execute({ dayNumber: opts.day });
		}),
	);

program
	.command("track")
	.description("Track daily prayer completion and fasting")
	.option("--show", "Show today's prayer tracking status")
	.option("--date <YYYY-MM-DD>", "Track for a specific date")
	.option("--fasted", "Mark the day as fasted")
	.option("--vacation", "Mark the day as vacation (doesn't break streak)")
	.argument("[prayer]", "Prayer to mark as complete (fajr, dhuhr, asr, maghrib, isha, taraweeh)")
	.action(
		handleAction(
			async (
				prayer: string | undefined,
				opts: { show?: boolean; date?: string; fasted?: boolean; vacation?: boolean },
			) => {
				const track = container.commandFactory.get("track");
				await track?.execute({
					prayer: prayer as "fajr" | "dhuhr" | "asr" | "maghrib" | "isha" | "taraweeh" | undefined,
					show: opts.show,
					date: opts.date,
					fasted: opts.fasted,
					vacation: opts.vacation,
				});
			},
		),
	);

program
	.command("completion")
	.description("Output shell completion script")
	.argument("<shell>", "Shell type (bash, zsh, fish)")
	.action(
		handleAction(async (shell: string) => {
			generateCompletion(shell, container.commandFactory);
		}),
	);

program
	.command("profile")
	.description("Manage location profiles")
	.argument("<action>", "Action (add, use, list, delete)")
	.argument("[name]", "Profile name")
	.option("--city <city>", "City for the profile")
	.option("--country <country>", "Country for the profile")
	.action(
		handleAction(
			async (
				action: string,
				name: string | undefined,
				opts: { city?: string; country?: string },
			) => {
				const { ProfileCommand } = await import("./commands/profile.command.js");
				const cmd = new ProfileCommand(container.configRepository);
				await cmd.execute({ action: action as "add" | "use" | "list" | "delete", name, ...opts });
			},
		),
	);

const parseDayNumber = (v: string): number => {
	const n = Number.parseInt(v, 10);
	if (Number.isNaN(n) || n < 1 || n > 30) {
		throw new InvalidArgumentError("Day number must be between 1 and 30.");
	}
	return n;
};

program
	.command("quran")
	.description("Show the Quran verse of the day for Ramadan")
	.option("-d, --day <number>", "Show verse for a specific day (1-30)", parseDayNumber)
	.action(
		handleAction(async (opts: { day?: number }) => {
			const cmd = container.commandFactory.get<QuranCommand>("quran");
			await cmd?.execute({ dayNumber: opts.day });
		}),
	);

program
	.command("hadith")
	.description("Show the hadith of the day for Ramadan")
	.option("-d, --day <number>", "Show hadith for a specific day (1-30)", parseDayNumber)
	.action(
		handleAction(async (opts: { day?: number }) => {
			const cmd = container.commandFactory.get<HadithCommand>("hadith");
			await cmd?.execute({ dayNumber: opts.day });
		}),
	);

program
	.command("adhkar [collection]")
	.description("Show adhkar/dhikr collections (morning, evening, post-prayer)")
	.action(
		handleAction(async (collection?: string) => {
			const cmd = container.commandFactory.get<AdhkarCommand>("adhkar");
			await cmd?.execute({ collection });
		}),
	);

program
	.command("goal")
	.description("Manage Ramadan goals")
	.argument("<action>", "Action (add, update, list, delete)")
	.option("--title <title>", "Goal title")
	.option("--target <number>", "Target value", (v: string) => Number.parseInt(v, 10))
	.option("--unit <unit>", "Unit of measurement")
	.option("--id <id>", "Goal ID (for update/delete)")
	.option("--progress <number>", "Current progress (for update)", (v: string) =>
		Number.parseInt(v, 10),
	)
	.action(
		handleAction(async (action: string, opts: Omit<GoalCommandOptions, "action">) => {
			const cmd = container.commandFactory.get<GoalCommand>("goal");
			await cmd?.execute({ action: action as GoalCommandOptions["action"], ...opts });
		}),
	);

program
	.command("stats")
	.description("Show Ramadan statistics summary")
	.option("-w, --weekly", "Show weekly summary")
	.action(
		handleAction(async (opts: { weekly?: boolean }) => {
			const cmd = container.commandFactory.get<StatsCommand>("stats");
			await cmd?.execute({ weekly: opts.weekly });
		}),
	);

program
	.command("zakat")
	.description("Calculate Zakat based on your wealth")
	.option("--cash <amount>", "Cash on hand", (v: string) => Number.parseFloat(v))
	.option("--gold <grams>", "Gold in grams", (v: string) => Number.parseFloat(v))
	.option("--silver <grams>", "Silver in grams", (v: string) => Number.parseFloat(v))
	.option("--investments <amount>", "Investment value", (v: string) => Number.parseFloat(v))
	.option("--property <amount>", "Property value", (v: string) => Number.parseFloat(v))
	.option("--debts <amount>", "Outstanding debts", (v: string) => Number.parseFloat(v))
	.action(
		handleAction(async (opts: ZakatCommandOptions) => {
			const cmd = container.commandFactory.get<ZakatCommand>("zakat");
			await cmd?.execute(opts);
		}),
	);

program
	.command("charity")
	.description("Track charity/sadaqah donations")
	.argument("<action>", "Action (add, list, summary)")
	.option("--amount <amount>", "Donation amount", (v: string) => Number.parseFloat(v))
	.option("--description <text>", "Description of donation")
	.option("--category <category>", "Category (e.g., food, shelter, education)")
	.action(
		handleAction(async (action: string, opts: Omit<CharityCommandOptions, "action">) => {
			const cmd = container.commandFactory.get<CharityCommand>("charity");
			await cmd?.execute({ action: action as CharityCommandOptions["action"], ...opts });
		}),
	);

program
	.command("export")
	.description("Export prayer times to iCal/CSV/JSON format")
	.option("-f, --format <format>", "Export format (ical, csv, json)", "ical")
	.option("-o, --output <file>", "Output file path")
	.action(
		handleAction(async (opts: ExportCommandOptions) => {
			const cmd = container.commandFactory.get<ExportCommand>("export");
			await cmd?.execute(opts);
		}),
	);

program
	.command("compare")
	.description("Compare prayer times across multiple cities")
	.argument("<cities...>", "2-4 city names or aliases to compare")
	.action(
		handleAction(async (cities: Array<string>) => {
			const cmd = container.commandFactory.get<CompareCommand>("compare");
			await cmd?.execute({ cities });
		}),
	);

program
	.command("widget")
	.description("Launch compact terminal widget with auto-refresh")
	.argument("[city]", "City name or alias")
	.action(
		handleAction(async (city: string | undefined) => {
			const cmd = container.commandFactory.get<WidgetCommand>("widget");
			await cmd?.execute({ city });
		}),
	);

program
	.command("cache")
	.description("Manage prayer time cache for offline use")
	.option("--build", "Prefetch 30 days of prayer times")
	.option("--clear", "Clear cached data")
	.option("--city <city>", "City for cache build")
	.option("--days <days>", "Number of days to prefetch (default: 30)", (v: string) => {
		const n = Number.parseInt(v, 10);
		if (Number.isNaN(n) || n < 1 || n > 365) {
			throw new InvalidArgumentError("Days must be between 1 and 365.");
		}
		return n;
	})
	.action(
		handleAction(async (opts: CacheCommandOptions) => {
			const cmd = container.commandFactory.get<CacheCommand>("cache");
			await cmd?.execute(opts);
		}),
	);

program.parse();
