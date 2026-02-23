import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { StreakService } from "../../../services/streak.service.js";

describe("StreakService", () => {
	let tmpDir: string;
	let service: StreakService;

	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date(2026, 2, 15)); // March 15, 2026
		tmpDir = mkdtempSync(join(tmpdir(), "streak-test-"));
		service = new StreakService(tmpDir);
	});

	afterEach(() => {
		vi.useRealTimers();
		rmSync(tmpDir, { recursive: true, force: true });
	});

	it("markDay: marks a date, getCurrentStreak returns 1 if date is today", () => {
		service.markDay("2026-03-15");
		expect(service.getCurrentStreak()).toBe(1);
	});

	it("unmarkDay: unmarking removes the entry", () => {
		service.markDay("2026-03-15");
		expect(service.getCurrentStreak()).toBe(1);
		service.unmarkDay("2026-03-15");
		expect(service.getCurrentStreak()).toBe(0);
	});

	it("getCurrentStreak: returns 0 when no days fasted", () => {
		expect(service.getCurrentStreak()).toBe(0);
	});

	it("getCurrentStreak: returns consecutive days ending today", () => {
		service.markDay("2026-03-13");
		service.markDay("2026-03-14");
		service.markDay("2026-03-15");
		expect(service.getCurrentStreak()).toBe(3);
	});

	it("getLongestStreak: returns longest run of consecutive dates", () => {
		// First run: 4 consecutive days
		service.markDay("2026-03-01");
		service.markDay("2026-03-02");
		service.markDay("2026-03-03");
		service.markDay("2026-03-04");

		// Gap on March 5

		// Second run: 2 consecutive days
		service.markDay("2026-03-06");
		service.markDay("2026-03-07");

		expect(service.getLongestStreak()).toBe(4);
	});

	it("getTotalDaysFasted: returns count of marked days", () => {
		service.markDay("2026-03-01");
		service.markDay("2026-03-05");
		service.markDay("2026-03-10");
		expect(service.getTotalDaysFasted()).toBe(3);
	});

	it("getStreakData: returns aggregate data object with all fields", () => {
		service.markDay("2026-03-14");
		service.markDay("2026-03-15");

		const data = service.getStreakData();
		expect(data).toEqual({
			currentStreak: 2,
			longestStreak: 2,
			lastFastedDate: "2026-03-15",
			totalDaysFasted: 2,
		});
	});

	it("markDay: throws error for invalid date format", () => {
		expect(() => service.markDay("2026/03/15")).toThrow("Invalid date format. Use YYYY-MM-DD.");
		expect(() => service.markDay("15-03-2026")).toThrow("Invalid date format. Use YYYY-MM-DD.");
		expect(() => service.markDay("March 15")).toThrow("Invalid date format. Use YYYY-MM-DD.");
		expect(() => service.markDay("")).toThrow("Invalid date format. Use YYYY-MM-DD.");
	});

	it("unmarkDay: throws error for invalid date format", () => {
		expect(() => service.unmarkDay("2026/03/15")).toThrow("Invalid date format. Use YYYY-MM-DD.");
		expect(() => service.unmarkDay("not-a-date")).toThrow("Invalid date format. Use YYYY-MM-DD.");
		expect(() => service.unmarkDay("")).toThrow("Invalid date format. Use YYYY-MM-DD.");
	});

	describe("vacation mode", () => {
		it("markVacation: stores vacation flag for a date", () => {
			service.markVacation("2026-03-14");
			expect(service.isVacation("2026-03-14")).toBe(true);
		});

		it("isVacation: returns true for vacation days and false for non-vacation days", () => {
			expect(service.isVacation("2026-03-14")).toBe(false);
			service.markVacation("2026-03-14");
			expect(service.isVacation("2026-03-14")).toBe(true);
			expect(service.isVacation("2026-03-15")).toBe(false);
		});

		it("vacation days don't break current streak", () => {
			// Day 13 fasted, day 14 vacation, day 15 (today) fasted = streak of 2
			service.markDay("2026-03-13");
			service.markVacation("2026-03-14");
			service.markDay("2026-03-15");
			expect(service.getCurrentStreak()).toBe(2);
		});

		it("vacation days don't break longest streak", () => {
			// 4 fasted days with a vacation gap in between
			service.markDay("2026-03-01");
			service.markDay("2026-03-02");
			service.markVacation("2026-03-03");
			service.markDay("2026-03-04");
			service.markDay("2026-03-05");

			expect(service.getLongestStreak()).toBe(4);
		});

		it("vacation days don't count toward streak total", () => {
			service.markDay("2026-03-13");
			service.markVacation("2026-03-14");
			service.markDay("2026-03-15");
			// Streak is 2, not 3 (vacation doesn't count)
			expect(service.getCurrentStreak()).toBe(2);
			expect(service.getTotalDaysFasted()).toBe(2);
		});

		it("markVacation: throws error for invalid date format", () => {
			expect(() => service.markVacation("2026/03/15")).toThrow(
				"Invalid date format. Use YYYY-MM-DD.",
			);
			expect(() => service.markVacation("bad-date")).toThrow(
				"Invalid date format. Use YYYY-MM-DD.",
			);
			expect(() => service.markVacation("")).toThrow("Invalid date format. Use YYYY-MM-DD.");
		});
	});
});
