import { describe, expect, it } from "vitest";
import { IcalService } from "../../../services/ical.service.js";
import type { IcalEvent } from "../../../services/ical.service.js";

describe("IcalService", () => {
	const service = new IcalService();

	const sampleEvents: ReadonlyArray<IcalEvent> = [
		{ title: "Fajr", date: "15-03-2026", time: "05:30", duration: 15 },
		{ title: "Dhuhr", date: "15-03-2026", time: "12:30", duration: 15 },
		{ title: "Asr", date: "15-03-2026", time: "16:00", duration: 15 },
	];

	it("generateIcal: returns string starting with BEGIN:VCALENDAR", () => {
		const ical = service.generateIcal(sampleEvents);
		expect(ical.startsWith("BEGIN:VCALENDAR")).toBe(true);
	});

	it("generateIcal: returns string ending with END:VCALENDAR", () => {
		const ical = service.generateIcal(sampleEvents);
		expect(ical.endsWith("END:VCALENDAR")).toBe(true);
	});

	it("generateIcal: contains VERSION:2.0", () => {
		const ical = service.generateIcal(sampleEvents);
		expect(ical).toContain("VERSION:2.0");
	});

	it("generateIcal: contains VEVENT for each event passed in", () => {
		const ical = service.generateIcal(sampleEvents);
		const beginCount = (ical.match(/BEGIN:VEVENT/g) ?? []).length;
		const endCount = (ical.match(/END:VEVENT/g) ?? []).length;
		expect(beginCount).toBe(3);
		expect(endCount).toBe(3);
	});

	it("generateIcal: SUMMARY matches event title", () => {
		const ical = service.generateIcal(sampleEvents);
		expect(ical).toContain("SUMMARY:Fajr");
		expect(ical).toContain("SUMMARY:Dhuhr");
		expect(ical).toContain("SUMMARY:Asr");
	});

	it("generateIcal: empty events returns calendar with no events", () => {
		const ical = service.generateIcal([]);
		expect(ical).toContain("BEGIN:VCALENDAR");
		expect(ical).toContain("END:VCALENDAR");
		expect(ical).not.toContain("BEGIN:VEVENT");
		expect(ical).not.toContain("END:VEVENT");
	});

	describe("generateCsv", () => {
		it("starts with header row", () => {
			const csv = service.generateCsv(sampleEvents);
			const lines = csv.split("\n");
			expect(lines[0]).toBe("Title,Date,Time,Duration");
		});

		it("produces one data row per event", () => {
			const csv = service.generateCsv(sampleEvents);
			const lines = csv.split("\n");
			// 1 header + 3 data rows
			expect(lines).toHaveLength(4);
		});

		it("properly quotes title, date, and time fields", () => {
			const csv = service.generateCsv(sampleEvents);
			const lines = csv.split("\n");
			expect(lines[1]).toBe('"Fajr","15-03-2026","05:30",15');
			expect(lines[2]).toBe('"Dhuhr","15-03-2026","12:30",15');
			expect(lines[3]).toBe('"Asr","15-03-2026","16:00",15');
		});

		it("returns only header for empty events", () => {
			const csv = service.generateCsv([]);
			expect(csv).toBe("Title,Date,Time,Duration");
		});

		it("duration is not quoted (numeric)", () => {
			const csv = service.generateCsv([
				{ title: "Test", date: "01-01-2026", time: "06:00", duration: 30 },
			]);
			const lines = csv.split("\n");
			expect(lines[1]).toContain(",30");
			expect(lines[1]).not.toContain('"30"');
		});
	});

	describe("generateJson", () => {
		it("returns valid JSON", () => {
			const json = service.generateJson(sampleEvents);
			expect(() => JSON.parse(json)).not.toThrow();
		});

		it("produces an array with the same number of events", () => {
			const json = service.generateJson(sampleEvents);
			const parsed = JSON.parse(json) as unknown[];
			expect(parsed).toHaveLength(3);
		});

		it("preserves event structure", () => {
			const json = service.generateJson(sampleEvents);
			const parsed = JSON.parse(json) as Array<IcalEvent>;
			expect(parsed[0]).toEqual({
				title: "Fajr",
				date: "15-03-2026",
				time: "05:30",
				duration: 15,
			});
		});

		it("is pretty-printed with 2-space indentation", () => {
			const json = service.generateJson(sampleEvents);
			// JSON.stringify with 2-space indent starts the array on the first line
			// and indents each object with 2 spaces
			expect(json).toContain("  ");
			expect(json).toBe(JSON.stringify(sampleEvents, null, 2));
		});

		it("returns empty array for empty events", () => {
			const json = service.generateJson([]);
			expect(JSON.parse(json)).toEqual([]);
		});
	});
});
