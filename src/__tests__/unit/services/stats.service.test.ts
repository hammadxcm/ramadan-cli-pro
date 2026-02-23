import { describe, expect, it, vi } from "vitest";
import { StatsService } from "../../../services/stats.service.js";

interface DayTrack {
	fajr: boolean;
	dhuhr: boolean;
	asr: boolean;
	maghrib: boolean;
	isha: boolean;
}

const mockStreakService = {
	getStreakData: vi.fn().mockReturnValue({
		currentStreak: 5,
		longestStreak: 10,
		totalDaysFasted: 20,
		lastFastedDate: "2026-03-15",
	}),
};

const mockGoalService = {
	listGoals: vi.fn().mockReturnValue([
		{ id: "1", title: "Read Quran", target: 30, current: 25, unit: "juz", createdAt: "2026-03-01" },
		{
			id: "2",
			title: "Charity",
			target: 1000,
			current: 1000,
			unit: "USD",
			createdAt: "2026-03-01",
		},
	]),
};

describe("StatsService", () => {
	const service = new StatsService(mockStreakService as never, mockGoalService as never);

	it("getOverallSummary: returns correct prayerCompletionRate", () => {
		const trackData: Record<string, DayTrack> = {
			"2026-03-14": { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true },
			"2026-03-15": { fajr: true, dhuhr: true, asr: false, maghrib: false, isha: false },
		};

		const summary = service.getOverallSummary(trackData);
		// 7 out of 10 prayers = 70%
		expect(summary.prayerCompletionRate).toBe(70);
		expect(summary.totalPrayersCompleted).toBe(7);
		expect(summary.totalPrayersExpected).toBe(10);
	});

	it("getOverallSummary: returns streak data from service", () => {
		const trackData: Record<string, DayTrack> = {};
		const summary = service.getOverallSummary(trackData);
		expect(summary.currentFastingStreak).toBe(5);
		expect(summary.longestFastingStreak).toBe(10);
		expect(summary.totalDaysFasted).toBe(20);
	});

	it("getOverallSummary: counts completed goals (current >= target)", () => {
		const trackData: Record<string, DayTrack> = {};
		const summary = service.getOverallSummary(trackData);
		// Only "Charity" goal has current (1000) >= target (1000)
		expect(summary.goalsCompleted).toBe(1);
		expect(summary.goalsTotal).toBe(2);
	});

	it("getOverallSummary: returns 0 rate for empty track data", () => {
		const trackData: Record<string, DayTrack> = {};
		const summary = service.getOverallSummary(trackData);
		expect(summary.prayerCompletionRate).toBe(0);
		expect(summary.totalPrayersCompleted).toBe(0);
		expect(summary.totalPrayersExpected).toBe(0);
	});
});
