/**
 * @module types/badge
 * @description Types for the badge/achievement system.
 */

export interface Badge {
	readonly id: string;
	readonly title: string;
	readonly description: string;
	readonly icon: string;
	readonly condition: string;
}
