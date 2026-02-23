import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CharityService } from "../../../services/charity.service.js";

describe("CharityService", () => {
	let tmpDir: string;
	let service: CharityService;

	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date(2026, 2, 15)); // March 15, 2026
		tmpDir = mkdtempSync(join(tmpdir(), "charity-test-"));
		service = new CharityService(tmpDir);
	});

	afterEach(() => {
		vi.useRealTimers();
		rmSync(tmpDir, { recursive: true, force: true });
	});

	it("addEntry: adds entry and returns it with id, date, amount, description, category", () => {
		const entry = service.addEntry(50, "Food bank donation", "food");
		expect(entry.amount).toBe(50);
		expect(entry.description).toBe("Food bank donation");
		expect(entry.category).toBe("food");
		expect(entry.id).toBeDefined();
		expect(typeof entry.id).toBe("string");
		expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
	});

	it("listEntries: returns empty initially", () => {
		expect(service.listEntries()).toEqual([]);
	});

	it("listEntries: returns all added entries", () => {
		service.addEntry(50, "Food bank", "food");
		service.addEntry(100, "Masjid donation", "masjid");
		const entries = service.listEntries();
		expect(entries).toHaveLength(2);
		expect(entries[0]?.description).toBe("Food bank");
		expect(entries[1]?.description).toBe("Masjid donation");
	});

	it("deleteEntry: removes by id, returns true", () => {
		const entry = service.addEntry(50, "Food bank", "food");
		expect(service.deleteEntry(entry.id)).toBe(true);
		expect(service.listEntries()).toEqual([]);
	});

	it("deleteEntry: returns false for non-existent id", () => {
		expect(service.deleteEntry("nonexistent")).toBe(false);
	});

	it("getTotalAmount: sums all entry amounts", () => {
		service.addEntry(50, "Food bank", "food");
		service.addEntry(100, "Masjid donation", "masjid");
		service.addEntry(25, "Clothing drive", "clothing");
		expect(service.getTotalAmount()).toBe(175);
	});

	it("getDailySummary: filters by date", () => {
		const entry1 = service.addEntry(50, "Food bank", "food");
		const date1 = entry1.date;

		// Change date forward by 1 day
		vi.setSystemTime(new Date(2026, 2, 16));
		const entry2 = service.addEntry(100, "Masjid donation", "masjid");
		const date2 = entry2.date;

		// Dates may differ from calendar dates due to UTC conversion,
		// but they should be distinct from each other
		expect(date1).not.toBe(date2);

		const summaryDate1 = service.getDailySummary(date1);
		expect(summaryDate1).toHaveLength(1);
		expect(summaryDate1[0]?.description).toBe("Food bank");

		const summaryDate2 = service.getDailySummary(date2);
		expect(summaryDate2).toHaveLength(1);
		expect(summaryDate2[0]?.description).toBe("Masjid donation");
	});

	it("addEntry: throws error for zero amount", () => {
		expect(() => service.addEntry(0, "Food bank", "food")).toThrow(
			"Charity amount must be greater than zero.",
		);
	});

	it("addEntry: throws error for negative amount", () => {
		expect(() => service.addEntry(-50, "Food bank", "food")).toThrow(
			"Charity amount must be greater than zero.",
		);
	});

	it("addEntry: throws error for empty description", () => {
		expect(() => service.addEntry(50, "", "food")).toThrow("Charity description cannot be empty.");
		expect(() => service.addEntry(50, "   ", "food")).toThrow(
			"Charity description cannot be empty.",
		);
	});
});
