/**
 * @module data/recommendations
 * @description Country-based recommendation lookups for calculation method
 * and juristic school, used during first-run auto-configuration.
 */

const countryMethodMap: Readonly<Record<string, number>> = {
	"United States": 2,
	USA: 2,
	US: 2,
	Canada: 2,
	Mexico: 2,
	Pakistan: 1,
	Bangladesh: 1,
	India: 1,
	Afghanistan: 1,
	"United Kingdom": 3,
	UK: 3,
	Germany: 3,
	Netherlands: 3,
	Belgium: 3,
	Sweden: 3,
	Norway: 3,
	Denmark: 3,
	Finland: 3,
	Austria: 3,
	Switzerland: 3,
	Poland: 3,
	Italy: 3,
	Spain: 3,
	Greece: 3,
	Japan: 3,
	China: 3,
	"South Korea": 3,
	Australia: 3,
	"New Zealand": 3,
	"South Africa": 3,
	"Saudi Arabia": 4,
	Yemen: 4,
	Oman: 4,
	Bahrain: 4,
	Egypt: 5,
	Syria: 5,
	Lebanon: 5,
	Palestine: 5,
	Jordan: 5,
	Iraq: 5,
	Libya: 5,
	Sudan: 5,
	Iran: 7,
	Kuwait: 9,
	Qatar: 10,
	Singapore: 11,
	France: 12,
	Turkey: 13,
	Türkiye: 13,
	Russia: 14,
	"United Arab Emirates": 16,
	UAE: 16,
	Malaysia: 17,
	Brunei: 17,
	Tunisia: 18,
	Algeria: 19,
	Indonesia: 20,
	Morocco: 21,
	Portugal: 22,
};

const hanafiCountries = new Set<string>([
	"Pakistan",
	"Bangladesh",
	"India",
	"Afghanistan",
	"Turkey",
	"Türkiye",
	"Iraq",
	"Syria",
	"Jordan",
	"Palestine",
	"Kazakhstan",
	"Uzbekistan",
	"Tajikistan",
	"Turkmenistan",
	"Kyrgyzstan",
]);

/**
 * Returns the recommended Aladhan calculation method ID for a given country.
 *
 * @param country - Country name (case-insensitive).
 * @returns The recommended method ID, or `null` if no recommendation exists.
 *
 * @example
 * ```ts
 * getRecommendedMethod("Pakistan"); // 1
 * getRecommendedMethod("Unknown");  // null
 * ```
 */
export const getRecommendedMethod = (country: string): number | null => {
	const direct = countryMethodMap[country];
	if (direct !== undefined) {
		return direct;
	}

	const lowerCountry = country.toLowerCase();
	for (const [key, value] of Object.entries(countryMethodMap)) {
		if (key.toLowerCase() === lowerCountry) {
			return value;
		}
	}

	return null;
};

/**
 * Returns the recommended juristic school ID for a given country.
 * Countries in South Asia, Turkey, and Central Asia default to Hanafi (1);
 * all others default to Shafi (0).
 *
 * @param country - Country name (case-insensitive).
 * @returns `1` for Hanafi or `0` for Shafi.
 *
 * @example
 * ```ts
 * getRecommendedSchool("Pakistan"); // 1 (Hanafi)
 * getRecommendedSchool("Egypt");    // 0 (Shafi)
 * ```
 */
export const getRecommendedSchool = (country: string): number => {
	if (hanafiCountries.has(country)) {
		return 1;
	}

	const lowerCountry = country.toLowerCase();
	for (const listedCountry of hanafiCountries) {
		if (listedCountry.toLowerCase() === lowerCountry) {
			return 1;
		}
	}

	return 0;
};
