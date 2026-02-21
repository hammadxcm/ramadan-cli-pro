import { describe, expect, it } from "vitest";
import type { FormatContext } from "../../../formatters/formatter.interface.js";
import { StatusLineFormatter } from "../../../formatters/status-line.formatter.js";

const makeCtx = (highlight: FormatContext["highlight"]): FormatContext => ({
	output: {
		mode: "today",
		location: "Lahore, Pakistan",
		hijriYear: 1447,
		rows: [],
	},
	highlight,
});

describe("StatusLineFormatter", () => {
	const formatter = new StatusLineFormatter();

	it('formatter name is "status-line"', () => {
		expect(formatter.name).toBe("status-line");
	});

	it("returns empty string when no highlight", () => {
		const result = formatter.format(makeCtx(null));
		expect(result).toBe("");
	});

	it('returns "Iftar in Xh Ym" format when highlight has next=Iftar', () => {
		const result = formatter.format(
			makeCtx({
				current: "Roza in progress",
				next: "Iftar",
				countdown: "2h 15m",
			}),
		);
		expect(result).toBe("Iftar in 2h 15m");
	});

	it('maps "First Sehar" to "Sehar"', () => {
		const result = formatter.format(
			makeCtx({
				current: "Before Ramadan",
				next: "First Sehar",
				countdown: "5h 30m",
			}),
		);
		expect(result).toBe("Sehar in 5h 30m");
	});

	it('maps "Next day Sehar" to "Sehar"', () => {
		const result = formatter.format(
			makeCtx({
				current: "Iftar time",
				next: "Next day Sehar",
				countdown: "10h 0m",
			}),
		);
		expect(result).toBe("Sehar in 10h 0m");
	});

	it('maps "Roza starts (Fajr)" to "Fast starts"', () => {
		const result = formatter.format(
			makeCtx({
				current: "Sehar time",
				next: "Roza starts (Fajr)",
				countdown: "0h 45m",
			}),
		);
		expect(result).toBe("Fast starts in 0h 45m");
	});

	it("returns label + countdown when highlight is present", () => {
		const result = formatter.format(
			makeCtx({
				current: "Some state",
				next: "Maghrib",
				countdown: "1h 10m",
			}),
		);
		expect(result).toBe("Maghrib in 1h 10m");
	});

	it("passes through unrecognized next labels unchanged", () => {
		const result = formatter.format(
			makeCtx({
				current: "Active",
				next: "CustomEvent",
				countdown: "4h 0m",
			}),
		);
		expect(result).toBe("CustomEvent in 4h 0m");
	});
});
