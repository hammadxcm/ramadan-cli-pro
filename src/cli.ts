/**
 * @module cli
 * @description CLI entry point. Configures Commander.js with all commands,
 * options, and argument parsing, then dispatches to the appropriate command handler.
 */

import { createRequire } from "node:module";
import { InvalidArgumentError, program } from "commander";
import type { ConfigCommandOptions } from "./commands/config.command.js";
import type { NotifyCommandOptions } from "./commands/notify.command.js";
import { createContainer } from "./container.js";

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
	readonly firstRozaDate?: string | undefined;
	readonly clearFirstRozaDate?: boolean | undefined;
}

const require = createRequire(import.meta.url);
const pkg = require("../package.json") as { readonly version: string };

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

program
	.name("ramadan-cli-pro")
	.description("Professional-grade Ramadan CLI for Sehar and Iftar timings")
	.version(pkg.version, "-v, --version")
	.argument("[city]", 'City name (e.g. "San Francisco", "sf", "Vancouver", "Lahore")')
	.option("-c, --city <city>", "City")
	.option("-a, --all", "Show complete Ramadan month")
	.option("-n, --number <number>", "Show a specific roza day (1-30)", parseRozaNumber)
	.option("-p, --plain", "Plain text output")
	.option("-j, --json", "JSON output")
	.option("-s, --status", "Status line output (next event only, for status bars)")
	.option("-t, --tui", "Launch TUI dashboard")
	.option("-l, --locale <locale>", "Language (en, ar, ur, tr, ms)")
	.option("--first-roza-date <YYYY-MM-DD>", "Set and use a custom first roza date")
	.option("--clear-first-roza-date", "Clear custom first roza date and use API Ramadan date")
	.action(async (cityArg: string | undefined, opts: RootOptions) => {
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
			await container.commandFactory.dashboard.execute(context);
			return;
		}

		container.commandFactory.ramadan.validate(context);
		await container.commandFactory.ramadan.execute(context);
	});

program
	.command("reset")
	.description("Clear saved configuration")
	.action(() => {
		container.commandFactory.reset.execute();
	});

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
	.action(async (opts: ConfigCommandOptions) => {
		await container.commandFactory.config.execute(opts);
	});

program
	.command("dashboard")
	.description("Launch TUI dashboard")
	.action(async () => {
		await container.commandFactory.dashboard.execute({});
	});

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
	.action(async (opts: NotifyCommandOptions) => {
		await container.commandFactory.notify.execute(opts);
	});

program.parse();
