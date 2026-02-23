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
	// Americas
	sf: "San Francisco",
	nyc: "New York",
	la: "Los Angeles",
	dc: "Washington",
	chi: "Chicago",
	tor: "Toronto",
	hou: "Houston",
	det: "Detroit",
	phi: "Philadelphia",
	bos: "Boston",
	mia: "Miami",
	atl: "Atlanta",
	van: "Vancouver",
	mtl: "Montreal",

	// South Asia
	lhr: "Lahore",
	isb: "Islamabad",
	khi: "Karachi",
	mum: "Mumbai",
	del: "Delhi",
	dhk: "Dhaka",
	cmb: "Colombo",
	hyd: "Hyderabad",
	pew: "Peshawar",
	fsd: "Faisalabad",
	rwp: "Rawalpindi",
	ktm: "Kathmandu",

	// Middle East
	dxb: "Dubai",
	jed: "Jeddah",
	ruh: "Riyadh",
	mak: "Makkah, Saudi Arabia",
	makkah: "Makkah, Saudi Arabia",
	mecca: "Makkah, Saudi Arabia",
	mad: "Madinah, Saudi Arabia",
	madinah: "Madinah, Saudi Arabia",
	medina: "Madinah, Saudi Arabia",
	doh: "Doha",
	kwt: "Kuwait City",
	mus: "Muscat",
	amm: "Amman",
	bgd: "Baghdad",
	bei: "Beirut",
	dam: "Damascus",

	// Turkey
	ist: "Istanbul",

	// North Africa
	cai: "Cairo",
	tun: "Tunis",
	alg: "Algiers",
	cas: "Casablanca",
	rab: "Rabat",
	tri: "Tripoli",

	// Sub-Saharan Africa
	lag: "Lagos",
	abj: "Abuja",
	nbo: "Nairobi",
	dar: "Dar es Salaam",
	mgq: "Mogadishu",
	acc: "Accra",
	kmp: "Kampala",
	dkr: "Dakar",

	// Europe
	lon: "London",
	par: "Paris",
	ber: "Berlin",
	ams: "Amsterdam",
	bru: "Brussels",
	osl: "Oslo",
	sto: "Stockholm",
	mdr: "Madrid",
	rom: "Rome",
	mun: "Munich",
	vie: "Vienna",
	cop: "Copenhagen",

	// Southeast Asia
	kul: "Kuala Lumpur",
	jkt: "Jakarta",
	sg: "Singapore",

	// East Asia
	bkk: "Bangkok",
	hcm: "Ho Chi Minh City",
	tok: "Tokyo",
	pek: "Beijing",
	seo: "Seoul",

	// Central Asia
	tsh: "Tashkent",
	ala: "Almaty",
	bak: "Baku",

	// Oceania
	syd: "Sydney",
	mel: "Melbourne",
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
