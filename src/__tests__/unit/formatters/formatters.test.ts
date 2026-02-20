import { describe, expect, it } from "vitest";
import { FormatterFactory } from "../../../formatters/formatter.factory.js";
import type { FormatContext } from "../../../formatters/formatter.interface.js";
import { JsonFormatter } from "../../../formatters/json.formatter.js";
import { PlainFormatter } from "../../../formatters/plain.formatter.js";
import { StatusLineFormatter } from "../../../formatters/status-line.formatter.js";

const baseContext: FormatContext = {
	output: {
		mode: "today",
		location: "Lahore, Pakistan",
		hijriYear: 1447,
		rows: [
			{
				roza: 1,
				sehar: "5:15 AM",
				iftar: "5:55 PM",
				date: "01 Mar 2026",
				hijri: "1 Ramadan 1447",
			},
		],
	},
	highlight: {
		current: "Roza in progress",
		next: "Iftar",
		countdown: "3h 20m",
	},
};

describe("JsonFormatter", () => {
	it("outputs valid JSON", () => {
		const formatter = new JsonFormatter();
		const result = formatter.format(baseContext);
		const parsed = JSON.parse(result);
		expect(parsed.mode).toBe("today");
		expect(parsed.rows).toHaveLength(1);
	});
});

describe("PlainFormatter", () => {
	it("outputs text without ANSI", () => {
		const formatter = new PlainFormatter();
		const result = formatter.format(baseContext);
		expect(result).toContain("Today Sehar/Iftar");
		expect(result).toContain("Lahore, Pakistan");
		expect(result).toContain("5:15 AM");
	});
});

describe("StatusLineFormatter", () => {
	it("outputs single-line status", () => {
		const formatter = new StatusLineFormatter();
		const result = formatter.format(baseContext);
		expect(result).toBe("Iftar in 3h 20m");
	});

	it("returns empty for no highlight", () => {
		const formatter = new StatusLineFormatter();
		const result = formatter.format({ ...baseContext, highlight: null });
		expect(result).toBe("");
	});

	it("maps Sehar labels correctly", () => {
		const formatter = new StatusLineFormatter();
		const result = formatter.format({
			...baseContext,
			highlight: {
				current: "Iftar time",
				next: "Next day Sehar",
				countdown: "10h 0m",
			},
		});
		expect(result).toBe("Sehar in 10h 0m");
	});
});

describe("FormatterFactory", () => {
	it("selects json formatter", () => {
		const factory = new FormatterFactory();
		const formatter = factory.select({ json: true });
		expect(formatter.name).toBe("json");
	});

	it("selects status-line formatter", () => {
		const factory = new FormatterFactory();
		const formatter = factory.select({ status: true });
		expect(formatter.name).toBe("status-line");
	});

	it("selects plain formatter", () => {
		const factory = new FormatterFactory();
		const formatter = factory.select({ plain: true });
		expect(formatter.name).toBe("plain");
	});

	it("defaults to table formatter", () => {
		const factory = new FormatterFactory();
		const formatter = factory.select({});
		expect(formatter.name).toBe("table");
	});
});
