/**
 * @module data/badges
 * @description Collection of achievable badges for Ramadan gamification.
 */

import type { Badge } from "../types/badge.js";

export const BADGES: ReadonlyArray<Badge> = [
	{
		id: "first-fast",
		title: "First Fast",
		description: "Complete your first day of fasting",
		icon: "\u{1F319}",
		condition: "Fast for at least 1 day",
	},
	{
		id: "week-warrior",
		title: "Week Warrior",
		description: "Fast for 7 consecutive days",
		icon: "\u{1F4AA}",
		condition: "Maintain a 7-day fasting streak",
	},
	{
		id: "prayer-perfect",
		title: "Prayer Perfect",
		description: "Complete all 5 prayers in a day",
		icon: "\u2728",
		condition: "Complete fajr, dhuhr, asr, maghrib, and isha in one day",
	},
	{
		id: "generous-soul",
		title: "Generous Soul",
		description: "Make your first charity donation",
		icon: "\u{1F49D}",
		condition: "Record at least one charity entry",
	},
	{
		id: "goal-setter",
		title: "Goal Setter",
		description: "Set your first Ramadan goal",
		icon: "\u{1F3AF}",
		condition: "Create at least one goal",
	},
	{
		id: "goal-achiever",
		title: "Goal Achiever",
		description: "Complete a Ramadan goal",
		icon: "\u{1F3C6}",
		condition: "Have a goal where current >= target",
	},
	{
		id: "streak-master",
		title: "Streak Master",
		description: "Maintain a 15-day fasting streak",
		icon: "\u{1F525}",
		condition: "Maintain a 15-day fasting streak",
	},
	{
		id: "full-month",
		title: "Full Month",
		description: "Fast for all 30 days",
		icon: "\u{1F31F}",
		condition: "Fast for 30 total days",
	},
	{
		id: "big-giver",
		title: "Big Giver",
		description: "Donate $100 or more total",
		icon: "\u{1F48E}",
		condition: "Total charity donations reach $100 or more",
	},
	{
		id: "taraweeh-regular",
		title: "Taraweeh Regular",
		description: "Complete taraweeh 10 times",
		icon: "\u{1F54C}",
		condition: "Track taraweeh prayer on 10 different days",
	},
	{
		id: "early-bird",
		title: "Early Bird",
		description: "Track fajr prayer 7 times",
		icon: "\u{1F305}",
		condition: "Track fajr prayer on 7 different days",
	},
	{
		id: "halfway-hero",
		title: "Halfway Hero",
		description: "Reach the 15th day of Ramadan tracking",
		icon: "\u{1F3C5}",
		condition: "Have tracking data for at least 15 days",
	},
] as const;
