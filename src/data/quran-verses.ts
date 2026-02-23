/**
 * @module data/quran-verses
 * @description Collection of 30 curated Quran verses for daily reflection
 * during Ramadan, with Arabic text, transliteration, translation, and source.
 */

export interface QuranVerse {
	readonly day: number;
	readonly arabic: string;
	readonly transliteration: string;
	readonly translation: string;
	readonly surah: string;
	readonly ayah: number;
}

export const QURAN_VERSES: ReadonlyArray<QuranVerse> = [
	{
		day: 1,
		arabic:
			"\u0634\u064E\u0647\u0652\u0631\u064F \u0631\u064E\u0645\u064E\u0636\u0627\u0646\u064E \u0627\u0644\u0651\u064E\u0630\u064A \u0623\u064F\u0646\u0632\u0650\u0644\u064E \u0641\u064A\u0647\u0650 \u0627\u0644\u0652\u0642\u064F\u0631\u0652\u0622\u0646\u064F",
		transliteration: "Shahru Ramadanal-ladhi unzila fihil-Quran",
		translation: "The month of Ramadan in which the Quran was revealed.",
		surah: "Al-Baqarah",
		ayah: 185,
	},
	{
		day: 2,
		arabic:
			"\u064A\u0627 \u0623\u064E\u064A\u0651\u064F\u0647\u0627 \u0627\u0644\u0651\u064E\u0630\u064A\u0646\u064E \u0622\u0645\u064E\u0646\u0648\u0627 \u0643\u064F\u062A\u0650\u0628\u064E \u0639\u064E\u0644\u064E\u064A\u0652\u0643\u064F\u0645\u064F \u0627\u0644\u0635\u0651\u0650\u064A\u0627\u0645\u064F",
		transliteration: "Ya ayyuhal-ladhina amanu kutiba 'alaykumus-siyam",
		translation: "O you who believe, fasting is prescribed for you.",
		surah: "Al-Baqarah",
		ayah: 183,
	},
	{
		day: 3,
		arabic:
			"\u0648\u064E\u0625\u0650\u0630\u0627 \u0633\u064E\u0623\u064E\u0644\u064E\u0643\u064E \u0639\u0650\u0628\u0627\u062F\u064A \u0639\u064E\u0646\u0651\u064A \u0641\u064E\u0625\u0650\u0646\u0651\u064A \u0642\u064E\u0631\u064A\u0628\u064C",
		transliteration: "Wa idha sa'alaka 'ibadi 'anni fa-inni qarib",
		translation: "And when My servants ask you about Me, indeed I am near.",
		surah: "Al-Baqarah",
		ayah: 186,
	},
	{
		day: 4,
		arabic:
			"\u0625\u0650\u0646\u0651\u064E\u0627 \u0623\u064E\u0646\u0632\u064E\u0644\u0652\u0646\u0627\u0647\u064F \u0641\u064A \u0644\u064E\u064A\u0652\u0644\u064E\u0629\u0650 \u0627\u0644\u0652\u0642\u064E\u062F\u0652\u0631\u0650",
		transliteration: "Inna anzalnahu fi laylat-il-qadr",
		translation: "Indeed, We sent it down during the Night of Decree.",
		surah: "Al-Qadr",
		ayah: 1,
	},
	{
		day: 5,
		arabic:
			"\u0644\u064E\u064A\u0652\u0644\u064E\u0629\u064F \u0627\u0644\u0652\u0642\u064E\u062F\u0652\u0631\u0650 \u062E\u064E\u064A\u0652\u0631\u064C \u0645\u0650\u0646\u0652 \u0623\u064E\u0644\u0652\u0641\u0650 \u0634\u064E\u0647\u0652\u0631\u064D",
		transliteration: "Laylat-ul-qadri khayrum-min alfi shahr",
		translation: "The Night of Decree is better than a thousand months.",
		surah: "Al-Qadr",
		ayah: 3,
	},
	{
		day: 6,
		arabic:
			"\u0648\u064E\u0623\u064E\u0642\u064A\u0645\u0648\u0627 \u0627\u0644\u0635\u0651\u064E\u0644\u0627\u0629\u064E \u0648\u064E\u0622\u062A\u0648\u0627 \u0627\u0644\u0632\u0651\u064E\u0643\u0627\u0629\u064E",
		transliteration: "Wa aqimus-salata wa atuz-zakat",
		translation: "And establish prayer and give zakat.",
		surah: "Al-Baqarah",
		ayah: 43,
	},
	{
		day: 7,
		arabic:
			"\u0627\u0644\u0651\u064E\u0630\u064A\u0646\u064E \u064A\u064F\u0624\u0652\u0645\u0650\u0646\u0648\u0646\u064E \u0628\u0650\u0627\u0644\u0652\u063A\u064E\u064A\u0652\u0628\u0650 \u0648\u064E\u064A\u064F\u0642\u064A\u0645\u0648\u0646\u064E \u0627\u0644\u0635\u0651\u064E\u0644\u0627\u0629\u064E",
		transliteration: "Alladhina yu'minuna bil-ghaybi wa yuqimunas-salah",
		translation: "Those who believe in the unseen and establish prayer.",
		surah: "Al-Baqarah",
		ayah: 3,
	},
	{
		day: 8,
		arabic:
			"\u0641\u064E\u0627\u0630\u0652\u0643\u064F\u0631\u0648\u0646\u064A \u0623\u064E\u0630\u0652\u0643\u064F\u0631\u0652\u0643\u064F\u0645\u0652 \u0648\u064E\u0627\u0634\u0652\u0643\u064F\u0631\u0648\u0627 \u0644\u064A \u0648\u064E\u0644\u0627 \u062A\u064E\u0643\u0652\u0641\u064F\u0631\u0648\u0646\u0650",
		transliteration: "Fadhkuruni adhkurkum wash-kuru li wa la takfurun",
		translation: "So remember Me; I will remember you. Be grateful and do not deny Me.",
		surah: "Al-Baqarah",
		ayah: 152,
	},
	{
		day: 9,
		arabic:
			"\u0648\u064E\u0627\u0633\u0652\u062A\u064E\u0639\u064A\u0646\u0648\u0627 \u0628\u0650\u0627\u0644\u0635\u0651\u064E\u0628\u0652\u0631\u0650 \u0648\u064E\u0627\u0644\u0635\u0651\u064E\u0644\u0627\u0629\u0650",
		transliteration: "Wasta'inu bis-sabri was-salah",
		translation: "And seek help through patience and prayer.",
		surah: "Al-Baqarah",
		ayah: 45,
	},
	{
		day: 10,
		arabic:
			"\u0625\u0650\u0646\u0651\u064E \u0627\u0644\u0644\u0651\u064E\u0647\u064E \u0645\u064E\u0639\u064E \u0627\u0644\u0635\u0651\u0627\u0628\u0650\u0631\u064A\u0646\u064E",
		transliteration: "Innal-laha ma'as-sabirin",
		translation: "Indeed, Allah is with the patient.",
		surah: "Al-Baqarah",
		ayah: 153,
	},
	{
		day: 11,
		arabic:
			"\u0648\u064E\u0645\u064E\u0646 \u064A\u064E\u062A\u064E\u0648\u064E\u0643\u0651\u064E\u0644\u0652 \u0639\u064E\u0644\u064E\u0649 \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0641\u064E\u0647\u064F\u0648\u064E \u062D\u064E\u0633\u0652\u0628\u064F\u0647\u064F",
		transliteration: "Wa man yatawakkal 'alal-lahi fahuwa hasbuh",
		translation: "And whoever relies upon Allah — then He is sufficient for him.",
		surah: "At-Talaq",
		ayah: 3,
	},
	{
		day: 12,
		arabic:
			"\u0648\u064E\u0644\u0627 \u062A\u064E\u064A\u0652\u0623\u064E\u0633\u0648\u0627 \u0645\u0650\u0646 \u0631\u0651\u064E\u0648\u0652\u062D\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u0650",
		transliteration: "Wa la tay'asu mir-rawhil-lah",
		translation: "And do not despair of the mercy of Allah.",
		surah: "Yusuf",
		ayah: 87,
	},
	{
		day: 13,
		arabic:
			"\u0625\u0650\u0646\u0651\u064E \u0645\u064E\u0639\u064E \u0627\u0644\u0652\u0639\u064F\u0633\u0652\u0631\u0650 \u064A\u064F\u0633\u0652\u0631\u0627\u064B",
		transliteration: "Inna ma'al-'usri yusra",
		translation: "Indeed, with hardship comes ease.",
		surah: "Ash-Sharh",
		ayah: 6,
	},
	{
		day: 14,
		arabic:
			"\u0627\u062F\u0652\u0639\u064F\u0648\u0646\u064A \u0623\u064E\u0633\u0652\u062A\u064E\u062C\u0650\u0628\u0652 \u0644\u064E\u0643\u064F\u0645\u0652",
		transliteration: "Ud'uni astajib lakum",
		translation: "Call upon Me; I will respond to you.",
		surah: "Ghafir",
		ayah: 60,
	},
	{
		day: 15,
		arabic:
			"\u0648\u064E\u0627\u0644\u0644\u0651\u064E\u0647\u064F \u064A\u064F\u062D\u0650\u0628\u0651\u064F \u0627\u0644\u0652\u0645\u064F\u062D\u0652\u0633\u0650\u0646\u064A\u0646\u064E",
		transliteration: "Wallahu yuhibb-ul-muhsinin",
		translation: "And Allah loves the doers of good.",
		surah: "Al-Imran",
		ayah: 134,
	},
	{
		day: 16,
		arabic:
			"\u0648\u064E\u0645\u0627 \u062A\u064F\u0642\u064E\u062F\u0651\u0650\u0645\u0648\u0627 \u0644\u0650\u0623\u064E\u0646\u0641\u064F\u0633\u0650\u0643\u064F\u0645 \u0645\u0650\u0646\u0652 \u062E\u064E\u064A\u0652\u0631\u064D \u062A\u064E\u062C\u0650\u062F\u0648\u0647\u064F \u0639\u0650\u0646\u062F\u064E \u0627\u0644\u0644\u0651\u064E\u0647\u0650",
		transliteration: "Wa ma tuqaddimu li-anfusikum min khayrin tajiduhu 'indal-lah",
		translation: "Whatever good you send forth for yourselves, you will find it with Allah.",
		surah: "Al-Baqarah",
		ayah: 110,
	},
	{
		day: 17,
		arabic:
			"\u0625\u0650\u0646\u0651\u064E \u0627\u0644\u0644\u0651\u064E\u0647\u064E \u0644\u0627 \u064A\u064F\u0636\u064A\u0639\u064F \u0623\u064E\u062C\u0652\u0631\u064E \u0627\u0644\u0652\u0645\u064F\u062D\u0652\u0633\u0650\u0646\u064A\u0646\u064E",
		transliteration: "Innal-laha la yudi'u ajral-muhsinin",
		translation: "Indeed, Allah does not waste the reward of the doers of good.",
		surah: "At-Tawbah",
		ayah: 120,
	},
	{
		day: 18,
		arabic:
			"\u0648\u064E\u062A\u064E\u0639\u0627\u0648\u064E\u0646\u0648\u0627 \u0639\u064E\u0644\u064E\u0649 \u0627\u0644\u0652\u0628\u0650\u0631\u0651\u0650 \u0648\u064E\u0627\u0644\u062A\u0651\u064E\u0642\u0652\u0648\u0649",
		transliteration: "Wa ta'awanu 'alal-birri wat-taqwa",
		translation: "And cooperate in righteousness and piety.",
		surah: "Al-Ma'idah",
		ayah: 2,
	},
	{
		day: 19,
		arabic:
			"\u0648\u064E\u0623\u064E\u0646\u0641\u0650\u0642\u0648\u0627 \u0641\u064A \u0633\u064E\u0628\u064A\u0644\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u0650",
		transliteration: "Wa anfiqu fi sabilil-lah",
		translation: "And spend in the way of Allah.",
		surah: "Al-Baqarah",
		ayah: 195,
	},
	{
		day: 20,
		arabic:
			"\u0642\u064F\u0644\u0652 \u0647\u064F\u0648\u064E \u0627\u0644\u0644\u0651\u064E\u0647\u064F \u0623\u064E\u062D\u064E\u062F\u064C",
		transliteration: "Qul huwal-lahu ahad",
		translation: "Say: He is Allah, the One.",
		surah: "Al-Ikhlas",
		ayah: 1,
	},
	{
		day: 21,
		arabic:
			"\u0631\u064E\u0628\u0651\u064E\u0646\u0627 \u0622\u062A\u0650\u0646\u0627 \u0641\u064A \u0627\u0644\u062F\u0651\u064F\u0646\u0652\u064A\u0627 \u062D\u064E\u0633\u064E\u0646\u064E\u0629\u064B \u0648\u064E\u0641\u064A \u0627\u0644\u0622\u062E\u0650\u0631\u064E\u0629\u0650 \u062D\u064E\u0633\u064E\u0646\u064E\u0629\u064B",
		transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanah",
		translation: "Our Lord, give us good in this world and good in the Hereafter.",
		surah: "Al-Baqarah",
		ayah: 201,
	},
	{
		day: 22,
		arabic:
			"\u0648\u064E\u0644\u064E\u0646\u064E\u0628\u0652\u0644\u064F\u0648\u064E\u0646\u0651\u064E\u0643\u064F\u0645 \u0628\u0650\u0634\u064E\u064A\u0652\u0621\u064D \u0645\u0650\u0646\u064E \u0627\u0644\u0652\u062E\u064E\u0648\u0652\u0641\u0650 \u0648\u064E\u0627\u0644\u0652\u062C\u0648\u0639\u0650",
		transliteration: "Wa lanabluwannakum bi-shay'im-minal-khawfi wal-ju'",
		translation: "And We will surely test you with something of fear and hunger.",
		surah: "Al-Baqarah",
		ayah: 155,
	},
	{
		day: 23,
		arabic:
			"\u0648\u064E\u0627\u0644\u0630\u0651\u0627\u0643\u0650\u0631\u064A\u0646\u064E \u0627\u0644\u0644\u0651\u064E\u0647\u064E \u0643\u064E\u062B\u064A\u0631\u0627\u064B \u0648\u064E\u0627\u0644\u0630\u0651\u0627\u0643\u0650\u0631\u0627\u062A\u0650",
		transliteration: "Wadh-dhakirin-Allaha kathiran wadh-dhakirati",
		translation: "And the men who remember Allah often and the women who remember.",
		surah: "Al-Ahzab",
		ayah: 35,
	},
	{
		day: 24,
		arabic:
			"\u0623\u064E\u0644\u0627 \u0628\u0650\u0630\u0650\u0643\u0652\u0631\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u062A\u064E\u0637\u0652\u0645\u064E\u0626\u0650\u0646\u0651\u064F \u0627\u0644\u0652\u0642\u064F\u0644\u0648\u0628\u064F",
		transliteration: "Ala bi-dhikril-lahi tatma'inn-ul-qulub",
		translation: "Verily, in the remembrance of Allah do hearts find rest.",
		surah: "Ar-Ra'd",
		ayah: 28,
	},
	{
		day: 25,
		arabic:
			"\u0648\u064E\u0644\u0627 \u062A\u064E\u0645\u0652\u0634\u0650 \u0641\u064A \u0627\u0644\u0623\u064E\u0631\u0652\u0636\u0650 \u0645\u064E\u0631\u064E\u062D\u0627\u064B",
		transliteration: "Wa la tamshi fil-ardi maraha",
		translation: "And do not walk upon the earth with arrogance.",
		surah: "Al-Isra",
		ayah: 37,
	},
	{
		day: 26,
		arabic:
			"\u0648\u064E\u0642\u0648\u0644\u0648\u0627 \u0644\u0650\u0644\u0646\u0651\u0627\u0633\u0650 \u062D\u064F\u0633\u0652\u0646\u0627\u064B",
		transliteration: "Wa qulu lin-nasi husna",
		translation: "And speak to people good words.",
		surah: "Al-Baqarah",
		ayah: 83,
	},
	{
		day: 27,
		arabic:
			"\u0633\u064E\u0644\u0627\u0645\u064C \u0647\u0650\u064A\u064E \u062D\u064E\u062A\u0651\u0649 \u0645\u064E\u0637\u0652\u0644\u064E\u0639\u0650 \u0627\u0644\u0652\u0641\u064E\u062C\u0652\u0631\u0650",
		transliteration: "Salamun hiya hatta matla'il-fajr",
		translation: "Peace it is until the emergence of dawn.",
		surah: "Al-Qadr",
		ayah: 5,
	},
	{
		day: 28,
		arabic:
			"\u0648\u064E\u0627\u0644\u0644\u0651\u064E\u0647\u064F \u063A\u064E\u0641\u0648\u0631\u064C \u0631\u064E\u062D\u064A\u0645\u064C",
		transliteration: "Wallahu ghafurun raheem",
		translation: "And Allah is Forgiving and Merciful.",
		surah: "Al-Baqarah",
		ayah: 173,
	},
	{
		day: 29,
		arabic:
			"\u0631\u064E\u0628\u0651\u064E\u0646\u0627 \u062A\u064E\u0642\u064E\u0628\u0651\u064E\u0644\u0652 \u0645\u0650\u0646\u0651\u0627 \u0625\u0650\u0646\u0651\u064E\u0643\u064E \u0623\u064E\u0646\u062A\u064E \u0627\u0644\u0633\u0651\u064E\u0645\u064A\u0639\u064F \u0627\u0644\u0652\u0639\u064E\u0644\u064A\u0645\u064F",
		transliteration: "Rabbana taqabbal minna innaka antas-sami'ul-'alim",
		translation: "Our Lord, accept from us. Indeed You are the Hearing, the Knowing.",
		surah: "Al-Baqarah",
		ayah: 127,
	},
	{
		day: 30,
		arabic:
			"\u0648\u064E\u0627\u0639\u0652\u0628\u064F\u062F\u0652 \u0631\u064E\u0628\u0651\u064E\u0643\u064E \u062D\u064E\u062A\u0651\u0649 \u064A\u064E\u0623\u0652\u062A\u0650\u064A\u064E\u0643\u064E \u0627\u0644\u0652\u064A\u064E\u0642\u064A\u0646\u064F",
		transliteration: "Wa'bud rabbaka hatta ya'tiyal-yaqin",
		translation: "And worship your Lord until there comes to you the certainty.",
		surah: "Al-Hijr",
		ayah: 99,
	},
];
