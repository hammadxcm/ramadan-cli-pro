/**
 * @module data/school-options
 * @description Juristic school selection data for the interactive setup prompt.
 */

/**
 * A selectable juristic school for the interactive setup prompt.
 */
export interface SchoolOption {
	/** Aladhan school ID (`0` = Shafi, `1` = Hanafi). */
	readonly value: number;
	/** Human-readable label shown in prompts and output. */
	readonly label: string;
	/** Optional hint displayed alongside the label. */
	readonly hint?: string;
}

/**
 * Shafi school ID.
 * @readonly
 */
export const SCHOOL_SHAFI = 0;

/**
 * Hanafi school ID.
 * @readonly
 */
export const SCHOOL_HANAFI = 1;

/**
 * Returns the school options ordered so the recommended school appears first.
 *
 * @param recommendedSchool - The school ID to recommend (0 or 1).
 * @returns An array of school options with the recommended one first.
 *
 * @example
 * ```ts
 * getSchoolOptions(1); // Hanafi first, then Shafi
 * ```
 */
export const getSchoolOptions = (recommendedSchool: number): ReadonlyArray<SchoolOption> => {
	if (recommendedSchool === SCHOOL_HANAFI) {
		return [
			{
				value: SCHOOL_HANAFI,
				label: "Hanafi (Recommended)",
				hint: "Later Asr timing",
			},
			{
				value: SCHOOL_SHAFI,
				label: "Shafi",
				hint: "Standard Asr timing",
			},
		];
	}

	return [
		{
			value: SCHOOL_SHAFI,
			label: "Shafi (Recommended)",
			hint: "Standard Asr timing",
		},
		{
			value: SCHOOL_HANAFI,
			label: "Hanafi",
			hint: "Later Asr timing",
		},
	];
};
