/**
 * @module data/hijri-events
 * @description Static data for notable Ramadan events and special nights.
 */

/**
 * Represents a notable event during the month of Ramadan.
 */
export interface HijriEvent {
	/** Day of Ramadan (1-30). */
	readonly day: number;
	/** Short title for the event. */
	readonly title: string;
	/** Longer description of the event. */
	readonly description: string;
	/** Whether this night is considered one of the special odd nights in the last ten days. */
	readonly isSpecialNight: boolean;
}

/**
 * Notable events and special nights during Ramadan.
 * @readonly
 */
export const RAMADAN_EVENTS: readonly HijriEvent[] = [
	{
		day: 1,
		title: "First day of Ramadan",
		description: "Beginning of the blessed month",
		isSpecialNight: false,
	},
	{
		day: 15,
		title: "Mid-Ramadan",
		description: "Halfway through the blessed month",
		isSpecialNight: false,
	},
	{
		day: 20,
		title: "Last 10 Nights Begin",
		description: "Beginning of the most blessed nights of Ramadan",
		isSpecialNight: false,
	},
	{
		day: 21,
		title: "21st Night",
		description: "Possible Laylat al-Qadr (odd night)",
		isSpecialNight: true,
	},
	{
		day: 23,
		title: "23rd Night",
		description: "Possible Laylat al-Qadr (odd night)",
		isSpecialNight: true,
	},
	{
		day: 25,
		title: "25th Night",
		description: "Possible Laylat al-Qadr (odd night)",
		isSpecialNight: true,
	},
	{
		day: 27,
		title: "27th Night (Laylat al-Qadr)",
		description: "Most likely night of Laylat al-Qadr",
		isSpecialNight: true,
	},
	{
		day: 29,
		title: "29th Night",
		description: "Possible Laylat al-Qadr (odd night)",
		isSpecialNight: true,
	},
	{
		day: 30,
		title: "Last Day of Ramadan",
		description: "Eve of Eid al-Fitr",
		isSpecialNight: false,
	},
];
