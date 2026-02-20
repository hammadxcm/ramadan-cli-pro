/**
 * @module formatters/formatter-factory
 * @description Factory for selecting the appropriate output formatter
 * based on CLI flags.
 */

import type { IOutputFormatter } from "./formatter.interface.js";
import { JsonFormatter } from "./json.formatter.js";
import { PlainFormatter } from "./plain.formatter.js";
import { StatusLineFormatter } from "./status-line.formatter.js";
import { TableFormatter } from "./table.formatter.js";

/**
 * Registers all available formatters and selects one based on CLI options.
 *
 * @example
 * ```ts
 * const factory = new FormatterFactory();
 * const formatter = factory.select({ json: true });
 * console.log(formatter.format(ctx));
 * ```
 */
export class FormatterFactory {
	private readonly formatters: Map<string, IOutputFormatter>;

	constructor() {
		this.formatters = new Map();
		this.formatters.set("table", new TableFormatter());
		this.formatters.set("json", new JsonFormatter());
		this.formatters.set("plain", new PlainFormatter());
		this.formatters.set("status-line", new StatusLineFormatter());
	}

	/**
	 * Returns a formatter by name, falling back to the table formatter.
	 *
	 * @param name - Formatter name (e.g. `"json"`, `"table"`).
	 * @returns The matching formatter.
	 */
	get(name: string): IOutputFormatter {
		const formatter = this.formatters.get(name);
		if (!formatter) {
			// biome-ignore lint/style/noNonNullAssertion: "table" is always registered in the constructor
			return this.formatters.get("table")!;
		}
		return formatter;
	}

	/**
	 * Selects a formatter based on boolean CLI flags.
	 *
	 * @param options - The CLI output flags.
	 * @returns The selected formatter.
	 */
	select(options: {
		json?: boolean | undefined;
		plain?: boolean | undefined;
		status?: boolean | undefined;
	}): IOutputFormatter {
		if (options.json) return this.get("json");
		if (options.status) return this.get("status-line");
		if (options.plain) return this.get("plain");
		return this.get("table");
	}
}
