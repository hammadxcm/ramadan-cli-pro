/**
 * @module services/badge
 * @description Badge/achievement evaluation service that checks earned badges
 * against current tracking, streak, goal, and charity data.
 */

import { BADGES } from "../data/badges.js";
import type { Badge } from "../types/badge.js";
import type { CharityService } from "./charity.service.js";
import type { GoalService } from "./goal.service.js";
import type { StreakService } from "./streak.service.js";

interface DayTrack {
	fajr: boolean;
	dhuhr: boolean;
	asr: boolean;
	maghrib: boolean;
	isha: boolean;
	taraweeh?: boolean;
}

/**
 * Evaluates badge conditions against current user data.
 */
export class BadgeService {
	constructor(
		private readonly streakService: StreakService,
		private readonly goalService: GoalService,
		private readonly charityService: CharityService,
	) {}

	/**
	 * Checks all badge conditions and returns the earned badges.
	 */
	checkEarned(trackData: Readonly<Record<string, DayTrack>>): Badge[] {
		const earned: Badge[] = [];

		for (const badge of BADGES) {
			if (this.isBadgeEarned(badge, trackData)) {
				earned.push(badge);
			}
		}

		return earned;
	}

	private isBadgeEarned(badge: Badge, trackData: Readonly<Record<string, DayTrack>>): boolean {
		switch (badge.id) {
			case "first-fast":
				return this.checkFirstFast();
			case "week-warrior":
				return this.checkWeekWarrior();
			case "streak-master":
				return this.checkStreakMaster();
			case "full-month":
				return this.checkFullMonth();
			case "halfway-hero":
				return this.checkHalfwayHero(trackData);
			case "prayer-perfect":
				return this.checkPrayerPerfect(trackData);
			case "early-bird":
				return this.checkEarlyBird(trackData);
			case "taraweeh-regular":
				return this.checkTaraweehRegular(trackData);
			case "generous-soul":
				return this.checkGenerousSoul();
			case "big-giver":
				return this.checkBigGiver();
			case "goal-setter":
				return this.checkGoalSetter();
			case "goal-achiever":
				return this.checkGoalAchiever();
			default:
				return false;
		}
	}

	// -- Fasting / Streak badges --

	private checkFirstFast(): boolean {
		return this.streakService.getTotalDaysFasted() >= 1;
	}

	private checkWeekWarrior(): boolean {
		return this.streakService.getLongestStreak() >= 7;
	}

	private checkStreakMaster(): boolean {
		return this.streakService.getLongestStreak() >= 15;
	}

	private checkFullMonth(): boolean {
		return this.streakService.getTotalDaysFasted() >= 30;
	}

	// -- Prayer / Track-data badges --

	private checkHalfwayHero(trackData: Readonly<Record<string, DayTrack>>): boolean {
		return Object.keys(trackData).length >= 15;
	}

	private checkPrayerPerfect(trackData: Readonly<Record<string, DayTrack>>): boolean {
		return Object.values(trackData).some(
			(day) => day.fajr && day.dhuhr && day.asr && day.maghrib && day.isha,
		);
	}

	private checkEarlyBird(trackData: Readonly<Record<string, DayTrack>>): boolean {
		const fajrCount = Object.values(trackData).filter((day) => day.fajr).length;
		return fajrCount >= 7;
	}

	private checkTaraweehRegular(trackData: Readonly<Record<string, DayTrack>>): boolean {
		const taraweehCount = Object.values(trackData).filter((day) => day.taraweeh === true).length;
		return taraweehCount >= 10;
	}

	// -- Charity badges --

	private checkGenerousSoul(): boolean {
		return this.charityService.listEntries().length > 0;
	}

	private checkBigGiver(): boolean {
		return this.charityService.getTotalAmount() >= 100;
	}

	// -- Goal badges --

	private checkGoalSetter(): boolean {
		return this.goalService.listGoals().length > 0;
	}

	private checkGoalAchiever(): boolean {
		return this.goalService.listGoals().some((g) => g.current >= g.target);
	}
}
