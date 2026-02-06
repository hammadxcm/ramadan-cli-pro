/**
 * @module data/city-aliases
 * @description Maps common city abbreviations to their full names,
 * enabling shorthand input (e.g. `"khi"` → `"Karachi"`).
 */

/**
 * Lookup table mapping lowercase abbreviations to canonical city names.
 * @readonly
 */
const CITY_ALIAS_MAP: Readonly<Record<string, string>> = {
	sf: "San Francisco",
	nyc: "New York",
	la: "Los Angeles",
	dc: "Washington",
	chi: "Chicago",
	lhr: "Lahore",
	isb: "Islamabad",
	khi: "Karachi",
	dxb: "Dubai",
	jed: "Jeddah",
	ist: "Istanbul",
	cai: "Cairo",
	kul: "Kuala Lumpur",
	jkt: "Jakarta",
	lon: "London",
};

/**
 * Resolves a city alias to its full name, or returns the input unchanged if no alias matches.
 *
 * @param city - A city name or abbreviation.
 * @returns The full city name.
 *
 * @example
 * ```ts
 * normalizeCityAlias("khi"); // "Karachi"
 * normalizeCityAlias("Berlin"); // "Berlin"
 * ```
 */
export const normalizeCityAlias = (city: string): string => {
	const trimmed = city.trim();
	const alias = CITY_ALIAS_MAP[trimmed.toLowerCase()];
	if (!alias) {
		return trimmed;
	}
	return alias;
};

export { CITY_ALIAS_MAP };
