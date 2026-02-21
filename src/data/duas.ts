/**
 * @module data/duas
 * @description Collection of 30 daily Ramadan duas with Arabic text,
 * transliteration, and English translation.
 */

export interface Dua {
	readonly day: number;
	readonly arabic: string;
	readonly transliteration: string;
	readonly translation: string;
}

export const RAMADAN_DUAS: ReadonlyArray<Dua> = [
	{
		day: 1,
		arabic:
			"\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0627\u062C\u0652\u0639\u064E\u0644\u0652 \u0635\u0650\u064A\u0627\u0645\u064A \u0641\u064A\u0647\u0650 \u0635\u0650\u064A\u0627\u0645\u064E \u0627\u0644\u0635\u0651\u0627\u0626\u0650\u0645\u064A\u0646\u064E",
		transliteration: "Allahummaj'al siyami fihi siyamas-sa'imin",
		translation: "O Allah, make my fasting in it the fasting of those who truly fast.",
	},
	{
		day: 2,
		arabic:
			"\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0642\u064E\u0631\u0651\u0650\u0628\u0652\u0646\u064A \u0641\u064A\u0647\u0650 \u0625\u0650\u0644\u0649 \u0645\u064E\u0631\u0652\u0636\u0627\u062A\u0650\u0643\u064E",
		transliteration: "Allahumma qarribni fihi ila mardatik",
		translation: "O Allah, bring me closer in it to Your pleasure.",
	},
	{
		day: 3,
		arabic:
			"\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0627\u0631\u0652\u0632\u064F\u0642\u0652\u0646\u064A \u0641\u064A\u0647\u0650 \u0627\u0644\u0630\u0651\u0650\u0647\u0652\u0646\u064E \u0648\u064E\u0627\u0644\u062A\u0651\u064E\u0646\u0652\u0628\u064A\u0647\u064E",
		transliteration: "Allahummar-zuqni fihidh-dhihna wat-tanbih",
		translation: "O Allah, grant me in it awareness and alertness.",
	},
	{
		day: 4,
		arabic:
			"\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0642\u064E\u0648\u0651\u0650\u0646\u064A \u0641\u064A\u0647\u0650 \u0639\u064E\u0644\u0649 \u0625\u0650\u0642\u0627\u0645\u064E\u0629\u0650 \u0623\u064E\u0645\u0652\u0631\u0650\u0643\u064E",
		transliteration: "Allahumma qawwini fihi 'ala iqamati amrik",
		translation: "O Allah, strengthen me in it to establish Your commands.",
	},
	{
		day: 5,
		arabic:
			"\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0627\u062C\u0652\u0639\u064E\u0644\u0652\u0646\u064A \u0641\u064A\u0647\u0650 \u0645\u0650\u0646\u064E \u0627\u0644\u0645\u064F\u0633\u0652\u062A\u064E\u063A\u0652\u0641\u0650\u0631\u064A\u0646\u064E",
		transliteration: "Allahummaj'alni fihiminal-mustaghfirin",
		translation: "O Allah, make me in it among those who seek forgiveness.",
	},
	{
		day: 6,
		arabic:
			"\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0644\u0627 \u062A\u064E\u062E\u0652\u0630\u064F\u0644\u0652\u0646\u064A \u0641\u064A\u0647\u0650 \u0644\u0650\u062A\u064E\u0639\u064E\u0631\u0651\u064F\u0636\u064A \u0644\u0650\u0645\u064E\u0639\u0627\u0635\u064A\u0643\u064E",
		transliteration: "Allahumma la takhdhulni fihi lita'arrudi lima'asik",
		translation: "O Allah, do not forsake me in it for exposing myself to Your disobedience.",
	},
	{
		day: 7,
		arabic:
			"\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0623\u064E\u0639\u0650\u0646\u0651\u064A \u0641\u064A\u0647\u0650 \u0639\u064E\u0644\u0649 \u0635\u0650\u064A\u0627\u0645\u0650\u0647\u0650 \u0648\u064E\u0642\u0650\u064A\u0627\u0645\u0650\u0647\u0650",
		transliteration: "Allahumma a'inni fihi 'ala siyamihi wa qiyamih",
		translation: "O Allah, help me in it to fast and pray at night.",
	},
	{
		day: 8,
		arabic:
			"\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0627\u0631\u0652\u0632\u064F\u0642\u0652\u0646\u064A \u0641\u064A\u0647\u0650 \u0631\u064E\u062D\u0652\u0645\u064E\u0629\u064E \u0627\u0644\u0623\u064E\u064A\u0652\u062A\u0627\u0645\u0650",
		transliteration: "Allahummar-zuqni fihi rahmat-al-aytam",
		translation: "O Allah, grant me in it mercy towards orphans.",
	},
	{
		day: 9,
		arabic:
			"\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0627\u062C\u0652\u0639\u064E\u0644\u0652 \u0644\u064A \u0641\u064A\u0647\u0650 \u0646\u064E\u0635\u064A\u0628\u0627\u064B \u0645\u0650\u0646\u0652 \u0631\u064E\u062D\u0652\u0645\u064E\u062A\u0650\u0643\u064E",
		transliteration: "Allahummaj'al li fihi nasiban min rahmatik",
		translation: "O Allah, make for me in it a share of Your mercy.",
	},
	{
		day: 10,
		arabic:
			"\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0627\u062C\u0652\u0639\u064E\u0644\u0652\u0646\u064A \u0641\u064A\u0647\u0650 \u0645\u0650\u0646\u064E \u0627\u0644\u0645\u064F\u062A\u064E\u0648\u064E\u0643\u0651\u0650\u0644\u064A\u0646\u064E \u0639\u064E\u0644\u064E\u064A\u0652\u0643\u064E",
		transliteration: "Allahummaj'alni fihiminal-mutawakkilina 'alayk",
		translation: "O Allah, make me in it among those who rely upon You.",
	},
	{
		day: 11,
		arabic:
			"\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u062D\u064E\u0628\u0651\u0650\u0628\u0652 \u0625\u0650\u0644\u064E\u064A\u0651\u064E \u0641\u064A\u0647\u0650 \u0627\u0644\u0625\u0650\u062D\u0652\u0633\u0627\u0646\u064E",
		transliteration: "Allahumma habbib ilayya fihil-ihsan",
		translation: "O Allah, make me love doing good in it.",
	},
	{
		day: 12,
		arabic:
			"\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0632\u064E\u064A\u0651\u0650\u0646\u0651\u064A \u0641\u064A\u0647\u0650 \u0628\u0650\u0627\u0644\u0633\u0651\u0650\u062A\u0652\u0631\u0650 \u0648\u064E\u0627\u0644\u0639\u064E\u0641\u0627\u0641\u0650",
		transliteration: "Allahumma zayyinni fihis-sitri wal-'afaf",
		translation: "O Allah, adorn me in it with modesty and chastity.",
	},
	{
		day: 13,
		arabic:
			"\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0637\u064E\u0647\u0651\u0650\u0631\u0652\u0646\u064A \u0641\u064A\u0647\u0650 \u0645\u0650\u0646\u064E \u0627\u0644\u062F\u0651\u064E\u0646\u064E\u0633\u0650",
		transliteration: "Allahumma tahhirni fihiminal-danas",
		translation: "O Allah, purify me in it from impurity.",
	},
	{
		day: 14,
		arabic:
			"\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0644\u0627 \u062A\u064F\u0624\u0627\u062E\u0650\u0630\u0652\u0646\u064A \u0641\u064A\u0647\u0650 \u0628\u0650\u0627\u0644\u0639\u064E\u062B\u064E\u0631\u0627\u062A\u0650",
		transliteration: "Allahumma la tu'akhidhni fihil-bil-'atharat",
		translation: "O Allah, do not take me to account in it for my slips.",
	},
	{
		day: 15,
		arabic:
			"\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0627\u0631\u0652\u0632\u064F\u0642\u0652\u0646\u064A \u0641\u064A\u0647\u0650 \u0637\u0627\u0639\u064E\u0629\u064E \u0627\u0644\u062E\u0627\u0634\u0650\u0639\u064A\u0646\u064E",
		transliteration: "Allahummar-zuqni fihi ta'atal-khashi'in",
		translation: "O Allah, grant me in it the obedience of the humble.",
	},
	{
		day: 16,
		arabic:
			"\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0648\u064E\u0641\u0651\u0650\u0642\u0652\u0646\u064A \u0641\u064A\u0647\u0650 \u0644\u0650\u0645\u064F\u0648\u0627\u0641\u064E\u0642\u064E\u0629\u0650 \u0627\u0644\u0623\u064E\u0628\u0652\u0631\u0627\u0631\u0650",
		transliteration: "Allahumma waffiqni fihi limuwafaqatil-abrar",
		translation: "O Allah, grant me in it the company of the righteous.",
	},
	{
		day: 17,
		arabic:
			"\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0627\u0647\u0652\u062F\u0650\u0646\u064A \u0641\u064A\u0647\u0650 \u0644\u0650\u0635\u0627\u0644\u0650\u062D\u0650 \u0627\u0644\u0623\u064E\u0639\u0652\u0645\u0627\u0644\u0650",
		transliteration: "Allahummah-dini fihi lisalihil-a'mal",
		translation: "O Allah, guide me in it to righteous deeds.",
	},
	{
		day: 18,
		arabic:
			"\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0646\u064E\u0628\u0651\u0650\u0647\u0652\u0646\u064A \u0641\u064A\u0647\u0650 \u0644\u0650\u0628\u064E\u0631\u064E\u0643\u0627\u062A\u0650 \u0623\u064E\u0633\u0652\u062D\u0627\u0631\u0650\u0647\u0650",
		transliteration: "Allahumma nabbihni fihi libarakati asharih",
		translation: "O Allah, awaken me in it to the blessings of its pre-dawn hours.",
	},
	{
		day: 19,
		arabic:
			"\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0648\u064E\u0641\u0651\u0650\u0631\u0652 \u0644\u064A \u0630\u064F\u0646\u0648\u0628\u064A \u0641\u064A\u0647\u0650",
		transliteration: "Allahumma waffir li dhunubi fih",
		translation: "O Allah, multiply my share of forgiveness in it.",
	},
	{
		day: 20,
		arabic:
			"\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0627\u0641\u0652\u062A\u064E\u062D\u0652 \u0644\u064A \u0641\u064A\u0647\u0650 \u0623\u064E\u0628\u0652\u0648\u0627\u0628\u064E \u0627\u0644\u062C\u0650\u0646\u0627\u0646\u0650",
		transliteration: "Allahummaf-tah li fihi abwabal-jinan",
		translation: "O Allah, open for me in it the gates of Paradise.",
	},
	{
		day: 21,
		arabic:
			"\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0627\u062C\u0652\u0639\u064E\u0644\u0652 \u0644\u064A \u0641\u064A\u0647\u0650 \u0625\u0650\u0644\u0649 \u0645\u064E\u0631\u0652\u0636\u0627\u062A\u0650\u0643\u064E \u062F\u064E\u0644\u064A\u0644\u0627\u064B",
		transliteration: "Allahummaj'al li fihi ila mardatika dalila",
		translation: "O Allah, make for me in it a guide to Your pleasure.",
	},
	{
		day: 22,
		arabic:
			"\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0627\u0641\u0652\u062A\u064E\u062D\u0652 \u0644\u064A \u0641\u064A\u0647\u0650 \u0623\u064E\u0628\u0652\u0648\u0627\u0628\u064E \u0641\u064E\u0636\u0652\u0644\u0650\u0643\u064E",
		transliteration: "Allahummaf-tah li fihi abwaba fadlik",
		translation: "O Allah, open for me in it the doors of Your grace.",
	},
	{
		day: 23,
		arabic:
			"\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0627\u063A\u0652\u0633\u0650\u0644\u0652\u0646\u064A \u0641\u064A\u0647\u0650 \u0645\u0650\u0646\u064E \u0627\u0644\u0630\u0651\u064F\u0646\u0648\u0628\u0650",
		transliteration: "Allahummagh-silni fihiminal-dhunub",
		translation: "O Allah, wash me in it from sins.",
	},
	{
		day: 24,
		arabic:
			"\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0625\u0650\u0646\u0651\u064A \u0623\u064E\u0633\u0652\u0623\u064E\u0644\u064F\u0643\u064E \u0641\u064A\u0647\u0650 \u0645\u0627 \u064A\u064F\u0631\u0652\u0636\u064A\u0643\u064E",
		transliteration: "Allahumma inni as'aluka fihi ma yurdik",
		translation: "O Allah, I ask You in it for what pleases You.",
	},
	{
		day: 25,
		arabic:
			"\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0627\u062C\u0652\u0639\u064E\u0644\u0652\u0646\u064A \u0641\u064A\u0647\u0650 \u0645\u064F\u062D\u0650\u0628\u0651\u0627\u064B \u0644\u0650\u0623\u064E\u0648\u0652\u0644\u0650\u064A\u0627\u0626\u0650\u0643\u064E",
		transliteration: "Allahummaj'alni fihi muhibban li-awliya'ik",
		translation: "O Allah, make me in it a lover of Your friends.",
	},
	{
		day: 26,
		arabic:
			"\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0627\u062C\u0652\u0639\u064E\u0644\u0652 \u0633\u064E\u0639\u0652\u064A\u064A \u0641\u064A\u0647\u0650 \u0645\u064E\u0634\u0652\u0643\u0648\u0631\u0627\u064B",
		transliteration: "Allahummaj'al sa'yi fihi mashkura",
		translation: "O Allah, make my efforts in it appreciated.",
	},
	{
		day: 27,
		arabic:
			"\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0627\u0631\u0652\u0632\u064F\u0642\u0652\u0646\u064A \u0641\u064A\u0647\u0650 \u0641\u064E\u0636\u0652\u0644\u064E \u0644\u064E\u064A\u0652\u0644\u064E\u0629\u0650 \u0627\u0644\u0642\u064E\u062F\u0652\u0631\u0650",
		transliteration: "Allahummar-zuqni fihi fadla laylat-il-qadr",
		translation: "O Allah, grant me in it the virtue of Laylat al-Qadr.",
	},
	{
		day: 28,
		arabic:
			"\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0648\u064E\u0641\u0651\u0650\u0631\u0652 \u0644\u064A \u0643\u064F\u0644\u0651\u064E \u0630\u064E\u0646\u0652\u0628\u064D \u0641\u064A\u0647\u0650",
		transliteration: "Allahumma waffir li kulla dhanbin fih",
		translation: "O Allah, forgive me every sin in it.",
	},
	{
		day: 29,
		arabic:
			"\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u063A\u064E\u0634\u0651\u0650\u0646\u064A \u0641\u064A\u0647\u0650 \u0628\u0650\u0627\u0644\u0631\u0651\u064E\u062D\u0652\u0645\u064E\u0629\u0650",
		transliteration: "Allahumma ghashshini fihir-rahmah",
		translation: "O Allah, cover me in it with mercy.",
	},
	{
		day: 30,
		arabic:
			"\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0627\u062C\u0652\u0639\u064E\u0644\u0652 \u0635\u0650\u064A\u0627\u0645\u064A \u0641\u064A\u0647\u0650 \u0628\u0650\u0627\u0644\u0634\u0651\u064F\u0643\u0652\u0631\u0650 \u0648\u064E\u0627\u0644\u0642\u064E\u0628\u0648\u0644\u0650",
		transliteration: "Allahummaj'al siyami fihi bish-shukri wal-qabul",
		translation: "O Allah, make my fasting in it with gratitude and acceptance.",
	},
];
