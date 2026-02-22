import { describe, expect, it } from "vitest";
import type { FormatContext } from "../../../formatters/formatter.interface.js";
import { TableFormatter } from "../../../formatters/table.formatter.js";
import type { RamadanRow } from "../../../types/ramadan.js";

const makeRow = (roza: number): RamadanRow => ({
	roza,
	sehar: "5:15 AM",
	iftar: "5:55 PM",
	date: "01 Mar 2026",
	hijri: "1 Ramadan 1447",
});

const baseCtx = (overrides: Partial<FormatContext> = {}): FormatContext => ({
	output: {
		mode: "all",
		location: "Lahore, Pakistan",
		hijriYear: 1447,
		rows: [makeRow(1), makeRow(2), makeRow(3)],
	},
	highlight: null,
	...overrides,
});

describe("TableFormatter", () => {
	const formatter = new TableFormatter();

	it("format returns a string", () => {
		const result = formatter.format(baseCtx());
		expect(typeof result).toBe("string");
		expect(result.length).toBeGreaterThan(0);
	});

	it("contains location city name", () => {
		const result = formatter.format(baseCtx());
		expect(result).toContain("Lahore, Pakistan");
	});

	it("contains Roza/Sehar/Iftar column headers", () => {
		const result = formatter.format(baseCtx());
		expect(result).toContain("Roza");
		expect(result).toContain("Sehar");
		expect(result).toContain("Iftar");
	});

	it("contains Date and Hijri column headers", () => {
		const result = formatter.format(baseCtx());
		expect(result).toContain("Date");
		expect(result).toContain("Hijri");
	});

	it("contains row data (sehar/iftar times)", () => {
		const result = formatter.format(baseCtx());
		expect(result).toContain("5:15 AM");
		expect(result).toContain("5:55 PM");
	});

	it('"all" mode shows all rows', () => {
		const ctx = baseCtx();
		const result = formatter.format(ctx);
		expect(result).toContain("All Days");
		for (const row of ctx.output.rows) {
			expect(result).toContain(String(row.roza));
		}
	});

	it('"today" mode title differs from "all"', () => {
		const allResult = formatter.format(baseCtx());
		const todayResult = formatter.format(
			baseCtx({
				output: {
					mode: "today",
					location: "Lahore, Pakistan",
					hijriYear: 1447,
					rows: [makeRow(1)],
				},
			}),
		);
		expect(allResult).toContain("All Days");
		expect(todayResult).not.toContain("All Days");
		expect(todayResult).toContain("Today Sehar/Iftar");
	});

	it('"number" mode shows roza number in title', () => {
		const result = formatter.format(
			baseCtx({
				output: {
					mode: "number",
					location: "Lahore, Pakistan",
					hijriYear: 1447,
					rows: [makeRow(5)],
				},
			}),
		);
		expect(result).toContain("Roza 5 Sehar/Iftar");
	});

	it("plain mode does not include banner art", () => {
		const plainResult = formatter.format(baseCtx({ plain: true }));
		expect(plainResult).toContain("RAMADAN CLI");
		// The plain output should use "RAMADAN CLI" text, not the ASCII art banner
		// The non-plain output contains the full banner art
		const richResult = formatter.format(baseCtx({ plain: false }));
		expect(richResult).not.toContain("RAMADAN CLI");
	});

	it('annotations add "\u2190 current" marker', () => {
		const result = formatter.format(
			baseCtx({
				rowAnnotations: { 1: "current" },
			}),
		);
		expect(result).toContain("\u2190 current");
	});

	it('annotations add "\u2190 next" marker', () => {
		const result = formatter.format(
			baseCtx({
				rowAnnotations: { 2: "next" },
			}),
		);
		expect(result).toContain("\u2190 next");
	});

	it("annotations mark both current and next rows", () => {
		const result = formatter.format(
			baseCtx({
				rowAnnotations: { 1: "current", 2: "next" },
			}),
		);
		expect(result).toContain("\u2190 current");
		expect(result).toContain("\u2190 next");
	});

	it("highlight state adds countdown info", () => {
		const result = formatter.format(
			baseCtx({
				highlight: {
					current: "Roza in progress",
					next: "Iftar",
					countdown: "3h 20m",
				},
			}),
		);
		expect(result).toContain("Status:");
		expect(result).toContain("Roza in progress");
		expect(result).toContain("Up next:");
		expect(result).toContain("Iftar");
		expect(result).toContain("3h 20m");
	});

	it("no highlight state omits status section", () => {
		const result = formatter.format(baseCtx({ highlight: null }));
		expect(result).not.toContain("Status:");
		expect(result).not.toContain("Up next:");
	});

	it("empty rows still renders headers", () => {
		const result = formatter.format(
			baseCtx({
				output: {
					mode: "all",
					location: "Lahore, Pakistan",
					hijriYear: 1447,
					rows: [],
				},
			}),
		);
		expect(result).toContain("Roza");
		expect(result).toContain("Sehar");
		expect(result).toContain("Iftar");
		expect(result).toContain("Date");
		expect(result).toContain("Hijri");
	});

	it("always includes the footer note about Fajr/Maghrib", () => {
		const result = formatter.format(baseCtx());
		expect(result).toContain("Sehar uses Fajr");
		expect(result).toContain("Iftar uses Maghrib");
	});

	it('formatter name is "table"', () => {
		expect(formatter.name).toBe("table");
	});
});
