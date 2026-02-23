import { describe, expect, it, vi } from "vitest";
import { BadgeService } from "../../../services/badge.service.js";

interface DayTrack {
	fajr: boolean;
	dhuhr: boolean;
	asr: boolean;
	maghrib: boolean;
	isha: boolean;
	taraweeh?: boolean;
}

function createMockStreakService(
	overrides: Partial<{
		getTotalDaysFasted: number;
		getLongestStreak: number;
	}> = {},
) {
	return {
		getTotalDaysFasted: vi.fn().mockReturnValue(overrides.getTotalDaysFasted ?? 0),
		getLongestStreak: vi.fn().mockReturnValue(overrides.getLongestStreak ?? 0),
		getCurrentStreak: vi.fn().mockReturnValue(0),
		getStreakData: vi.fn().mockReturnValue({
			currentStreak: 0,
			longestStreak: overrides.getLongestStreak ?? 0,
			totalDaysFasted: overrides.getTotalDaysFasted ?? 0,
		}),
		markDay: vi.fn(),
		unmarkDay: vi.fn(),
	};
}

function createMockGoalService(
	overrides: Partial<{
		goals: Array<{
			id: string;
			title: string;
			target: number;
			current: number;
			unit: string;
			createdAt: string;
		}>;
	}> = {},
) {
	return {
		listGoals: vi.fn().mockReturnValue(overrides.goals ?? []),
		addGoal: vi.fn(),
		updateGoal: vi.fn(),
		deleteGoal: vi.fn(),
		getGoal: vi.fn(),
	};
}

function createMockCharityService(
	overrides: Partial<{
		entries: Array<{
			id: string;
			date: string;
			amount: number;
			description: string;
			category: string;
		}>;
		totalAmount: number;
	}> = {},
) {
	return {
		listEntries: vi.fn().mockReturnValue(overrides.entries ?? []),
		getTotalAmount: vi.fn().mockReturnValue(overrides.totalAmount ?? 0),
		addEntry: vi.fn(),
		deleteEntry: vi.fn(),
		getDailySummary: vi.fn(),
	};
}

const emptyTrack: Record<string, DayTrack> = {};

describe("BadgeService", () => {
	it("should return no badges with empty data", () => {
		const service = new BadgeService(
			createMockStreakService() as never,
			createMockGoalService() as never,
			createMockCharityService() as never,
		);

		const earned = service.checkEarned(emptyTrack);
		expect(earned).toHaveLength(0);
	});

	it("should earn first-fast badge when at least 1 day fasted", () => {
		const service = new BadgeService(
			createMockStreakService({ getTotalDaysFasted: 1 }) as never,
			createMockGoalService() as never,
			createMockCharityService() as never,
		);

		const earned = service.checkEarned(emptyTrack);
		const ids = earned.map((b) => b.id);
		expect(ids).toContain("first-fast");
	});

	it("should earn week-warrior badge when longest streak >= 7", () => {
		const service = new BadgeService(
			createMockStreakService({ getTotalDaysFasted: 7, getLongestStreak: 7 }) as never,
			createMockGoalService() as never,
			createMockCharityService() as never,
		);

		const earned = service.checkEarned(emptyTrack);
		const ids = earned.map((b) => b.id);
		expect(ids).toContain("week-warrior");
	});

	it("should earn streak-master badge when longest streak >= 15", () => {
		const service = new BadgeService(
			createMockStreakService({ getTotalDaysFasted: 15, getLongestStreak: 15 }) as never,
			createMockGoalService() as never,
			createMockCharityService() as never,
		);

		const earned = service.checkEarned(emptyTrack);
		const ids = earned.map((b) => b.id);
		expect(ids).toContain("streak-master");
	});

	it("should earn full-month badge when 30 total days fasted", () => {
		const service = new BadgeService(
			createMockStreakService({ getTotalDaysFasted: 30, getLongestStreak: 30 }) as never,
			createMockGoalService() as never,
			createMockCharityService() as never,
		);

		const earned = service.checkEarned(emptyTrack);
		const ids = earned.map((b) => b.id);
		expect(ids).toContain("full-month");
	});

	it("should earn prayer-perfect badge when all 5 prayers completed in a day", () => {
		const service = new BadgeService(
			createMockStreakService() as never,
			createMockGoalService() as never,
			createMockCharityService() as never,
		);

		const trackData: Record<string, DayTrack> = {
			"2026-03-15": { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true },
		};

		const earned = service.checkEarned(trackData);
		const ids = earned.map((b) => b.id);
		expect(ids).toContain("prayer-perfect");
	});

	it("should not earn prayer-perfect badge when prayers are incomplete", () => {
		const service = new BadgeService(
			createMockStreakService() as never,
			createMockGoalService() as never,
			createMockCharityService() as never,
		);

		const trackData: Record<string, DayTrack> = {
			"2026-03-15": { fajr: true, dhuhr: true, asr: false, maghrib: true, isha: true },
		};

		const earned = service.checkEarned(trackData);
		const ids = earned.map((b) => b.id);
		expect(ids).not.toContain("prayer-perfect");
	});

	it("should earn early-bird badge when fajr tracked 7 times", () => {
		const service = new BadgeService(
			createMockStreakService() as never,
			createMockGoalService() as never,
			createMockCharityService() as never,
		);

		const trackData: Record<string, DayTrack> = {};
		for (let i = 1; i <= 7; i++) {
			trackData[`2026-03-${String(i).padStart(2, "0")}`] = {
				fajr: true,
				dhuhr: false,
				asr: false,
				maghrib: false,
				isha: false,
			};
		}

		const earned = service.checkEarned(trackData);
		const ids = earned.map((b) => b.id);
		expect(ids).toContain("early-bird");
	});

	it("should earn taraweeh-regular badge when taraweeh tracked 10 times", () => {
		const service = new BadgeService(
			createMockStreakService() as never,
			createMockGoalService() as never,
			createMockCharityService() as never,
		);

		const trackData: Record<string, DayTrack> = {};
		for (let i = 1; i <= 10; i++) {
			trackData[`2026-03-${String(i).padStart(2, "0")}`] = {
				fajr: false,
				dhuhr: false,
				asr: false,
				maghrib: false,
				isha: false,
				taraweeh: true,
			};
		}

		const earned = service.checkEarned(trackData);
		const ids = earned.map((b) => b.id);
		expect(ids).toContain("taraweeh-regular");
	});

	it("should earn halfway-hero badge when 15 days tracked", () => {
		const service = new BadgeService(
			createMockStreakService() as never,
			createMockGoalService() as never,
			createMockCharityService() as never,
		);

		const trackData: Record<string, DayTrack> = {};
		for (let i = 1; i <= 15; i++) {
			trackData[`2026-03-${String(i).padStart(2, "0")}`] = {
				fajr: false,
				dhuhr: false,
				asr: false,
				maghrib: false,
				isha: false,
			};
		}

		const earned = service.checkEarned(trackData);
		const ids = earned.map((b) => b.id);
		expect(ids).toContain("halfway-hero");
	});

	it("should earn generous-soul badge when charity has entries", () => {
		const service = new BadgeService(
			createMockStreakService() as never,
			createMockGoalService() as never,
			createMockCharityService({
				entries: [
					{ id: "1", date: "2026-03-15", amount: 10, description: "Sadaqah", category: "general" },
				],
				totalAmount: 10,
			}) as never,
		);

		const earned = service.checkEarned(emptyTrack);
		const ids = earned.map((b) => b.id);
		expect(ids).toContain("generous-soul");
	});

	it("should earn big-giver badge when total charity >= $100", () => {
		const service = new BadgeService(
			createMockStreakService() as never,
			createMockGoalService() as never,
			createMockCharityService({
				entries: [
					{ id: "1", date: "2026-03-15", amount: 100, description: "Zakat", category: "zakat" },
				],
				totalAmount: 100,
			}) as never,
		);

		const earned = service.checkEarned(emptyTrack);
		const ids = earned.map((b) => b.id);
		expect(ids).toContain("big-giver");
	});

	it("should earn goal-setter badge when goals exist", () => {
		const service = new BadgeService(
			createMockStreakService() as never,
			createMockGoalService({
				goals: [
					{
						id: "1",
						title: "Read Quran",
						target: 30,
						current: 0,
						unit: "juz",
						createdAt: "2026-03-01",
					},
				],
			}) as never,
			createMockCharityService() as never,
		);

		const earned = service.checkEarned(emptyTrack);
		const ids = earned.map((b) => b.id);
		expect(ids).toContain("goal-setter");
	});

	it("should earn goal-achiever badge when a goal is completed", () => {
		const service = new BadgeService(
			createMockStreakService() as never,
			createMockGoalService({
				goals: [
					{
						id: "1",
						title: "Read Quran",
						target: 30,
						current: 30,
						unit: "juz",
						createdAt: "2026-03-01",
					},
				],
			}) as never,
			createMockCharityService() as never,
		);

		const earned = service.checkEarned(emptyTrack);
		const ids = earned.map((b) => b.id);
		expect(ids).toContain("goal-achiever");
	});

	it("should not earn goal-achiever badge when no goal is completed", () => {
		const service = new BadgeService(
			createMockStreakService() as never,
			createMockGoalService({
				goals: [
					{
						id: "1",
						title: "Read Quran",
						target: 30,
						current: 10,
						unit: "juz",
						createdAt: "2026-03-01",
					},
				],
			}) as never,
			createMockCharityService() as never,
		);

		const earned = service.checkEarned(emptyTrack);
		const ids = earned.map((b) => b.id);
		expect(ids).not.toContain("goal-achiever");
		// But goal-setter should still be earned
		expect(ids).toContain("goal-setter");
	});

	it("should earn multiple badges simultaneously", () => {
		const service = new BadgeService(
			createMockStreakService({ getTotalDaysFasted: 7, getLongestStreak: 7 }) as never,
			createMockGoalService({
				goals: [
					{
						id: "1",
						title: "Read Quran",
						target: 30,
						current: 30,
						unit: "juz",
						createdAt: "2026-03-01",
					},
				],
			}) as never,
			createMockCharityService({
				entries: [
					{ id: "1", date: "2026-03-15", amount: 50, description: "Sadaqah", category: "general" },
				],
				totalAmount: 50,
			}) as never,
		);

		const trackData: Record<string, DayTrack> = {
			"2026-03-15": { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true },
		};

		const earned = service.checkEarned(trackData);
		const ids = earned.map((b) => b.id);

		expect(ids).toContain("first-fast");
		expect(ids).toContain("week-warrior");
		expect(ids).toContain("prayer-perfect");
		expect(ids).toContain("generous-soul");
		expect(ids).toContain("goal-setter");
		expect(ids).toContain("goal-achiever");
	});
});
