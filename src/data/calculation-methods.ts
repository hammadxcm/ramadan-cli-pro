/**
 * @module data/calculation-methods
 * @description Static list of Aladhan prayer-time calculation methods
 * and lookup helpers for display labels.
 */

/**
 * A selectable calculation method for the interactive setup prompt.
 */
export interface MethodOption {
	/** Aladhan method ID (0–23). */
	readonly value: number;
	/** Human-readable label shown in prompts and output. */
	readonly label: string;
	/** Optional hint displayed alongside the label. */
	readonly hint?: string;
}

/**
 * All supported calculation methods from the Aladhan API.
 * @readonly
 */
export const METHOD_OPTIONS: ReadonlyArray<MethodOption> = [
	{ value: 0, label: "Jafari (Shia Ithna-Ashari)" },
	{ value: 1, label: "Karachi (Pakistan)" },
	{ value: 2, label: "ISNA (North America)" },
	{ value: 3, label: "MWL (Muslim World League)" },
	{ value: 4, label: "Makkah (Umm al-Qura)" },
	{ value: 5, label: "Egypt" },
	{ value: 7, label: "Tehran (Shia)" },
	{ value: 8, label: "Gulf Region" },
	{ value: 9, label: "Kuwait" },
	{ value: 10, label: "Qatar" },
	{ value: 11, label: "Singapore" },
	{ value: 12, label: "France" },
	{ value: 13, label: "Turkey" },
	{ value: 14, label: "Russia" },
	{ value: 15, label: "Moonsighting Committee" },
	{ value: 16, label: "Dubai" },
	{ value: 17, label: "Malaysia (JAKIM)" },
	{ value: 18, label: "Tunisia" },
	{ value: 19, label: "Algeria" },
	{ value: 20, label: "Indonesia" },
	{ value: 21, label: "Morocco" },
	{ value: 22, label: "Portugal" },
	{ value: 23, label: "Jordan" },
];

/**
 * Returns the human-readable label for a calculation method ID.
 *
 * @param method - The method ID to look up.
 * @returns The method label, or `"Method {id}"` if not found.
 *
 * @example
 * ```ts
 * findMethodLabel(2); // "ISNA (North America)"
 * findMethodLabel(99); // "Method 99"
 * ```
 */
export const findMethodLabel = (method: number): string => {
	const option = METHOD_OPTIONS.find((entry) => entry.value === method);
	if (option) {
		return option.label;
	}
	return `Method ${method}`;
};
