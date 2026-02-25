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
	readonly category?: string;
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

export const GENERAL_DUAS: ReadonlyArray<Dua> = [
	// Travel
	{ day: 31, arabic: "سبحان الذي سخر لنا هذا وما كنا له مقرنين", transliteration: "Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin", translation: "Glory be to Him who has subjected this to us, and we could never have it by our efforts.", category: "travel" },
	{ day: 32, arabic: "اللهم إني أسألك في سفري هذا البر والتقوى", transliteration: "Allahumma inni as'aluka fi safari hadhal-birra wat-taqwa", translation: "O Allah, I ask You in this journey for righteousness and piety.", category: "travel" },
	// Eating
	{ day: 33, arabic: "بسم الله وعلى بركة الله", transliteration: "Bismillahi wa 'ala barakatillah", translation: "In the name of Allah and with the blessings of Allah.", category: "eating" },
	{ day: 34, arabic: "الحمد لله الذي أطعمنا وسقانا وجعلنا مسلمين", transliteration: "Alhamdulillahil-ladhi at'amana wa saqana wa ja'alana muslimin", translation: "Praise be to Allah who fed us, gave us drink, and made us Muslims.", category: "eating" },
	// Sleeping
	{ day: 35, arabic: "باسمك اللهم أموت وأحيا", transliteration: "Bismika Allahumma amutu wa ahya", translation: "In Your name, O Allah, I die and I live.", category: "sleeping" },
	{ day: 36, arabic: "اللهم قني عذابك يوم تبعث عبادك", transliteration: "Allahumma qini 'adhabaka yawma tab'athu 'ibadak", translation: "O Allah, protect me from Your punishment on the Day You resurrect Your servants.", category: "sleeping" },
	// Waking
	{ day: 37, arabic: "الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور", transliteration: "Alhamdulillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur", translation: "Praise be to Allah who gave us life after death, and to Him is the resurrection.", category: "waking" },
	{ day: 38, arabic: "اللهم بك أصبحنا وبك أمسينا وبك نحيا وبك نموت", transliteration: "Allahumma bika asbahna wa bika amsayna wa bika nahya wa bika namut", translation: "O Allah, by You we enter morning, by You we enter evening, by You we live and by You we die.", category: "waking" },
	// Distress
	{ day: 39, arabic: "لا إله إلا أنت سبحانك إني كنت من الظالمين", transliteration: "La ilaha illa anta subhanaka inni kuntu minaz-zalimin", translation: "There is no god but You, glory be to You, indeed I have been among the wrongdoers.", category: "distress" },
	{ day: 40, arabic: "حسبنا الله ونعم الوكيل", transliteration: "Hasbunallahu wa ni'mal-wakil", translation: "Allah is sufficient for us, and He is the best Disposer of affairs.", category: "distress" },
	{ day: 41, arabic: "اللهم إني أعوذ بك من الهم والحزن", transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazan", translation: "O Allah, I seek refuge in You from worry and grief.", category: "distress" },
	{ day: 42, arabic: "يا حي يا قيوم برحمتك أستغيث", transliteration: "Ya Hayyu ya Qayyumu bi-rahmatika astaghith", translation: "O Living, O Sustainer, in Your mercy I seek relief.", category: "distress" },
	// Forgiveness
	{ day: 43, arabic: "أستغفر الله الذي لا إله إلا هو الحي القيوم وأتوب إليه", transliteration: "Astaghfirullahul-ladhi la ilaha illa huwal-Hayyul-Qayyumu wa atubu ilayh", translation: "I seek forgiveness from Allah, there is no god but He, the Living, the Sustainer, and I turn to Him in repentance.", category: "forgiveness" },
	{ day: 44, arabic: "ربنا ظلمنا أنفسنا وإن لم تغفر لنا وترحمنا لنكونن من الخاسرين", transliteration: "Rabbana dhalamna anfusana wa in lam taghfir lana wa tarhamna lanakunnana minal-khasirin", translation: "Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy upon us, we will surely be among the losers.", category: "forgiveness" },
	{ day: 45, arabic: "اللهم إنك عفو كريم تحب العفو فاعف عني", transliteration: "Allahumma innaka 'afuwwun karimun tuhibbul-'afwa fa'fu 'anni", translation: "O Allah, You are Pardoning, Generous, You love to pardon, so pardon me.", category: "forgiveness" },
	{ day: 46, arabic: "رب اغفر لي وتب علي إنك أنت التواب الرحيم", transliteration: "Rabbigh-fir li wa tub 'alayya innaka antat-Tawwabur-Rahim", translation: "My Lord, forgive me and accept my repentance. Indeed, You are the Accepting of repentance, the Merciful.", category: "forgiveness" },
	// Parents
	{ day: 47, arabic: "رب ارحمهما كما ربياني صغيرا", transliteration: "Rabbir-hamhuma kama rabbayanee saghira", translation: "My Lord, have mercy upon them as they brought me up when I was small.", category: "parents" },
	{ day: 48, arabic: "ربنا اغفر لي ولوالدي وللمؤمنين يوم يقوم الحساب", transliteration: "Rabbanagh-fir li wa li-walidayya wa lil-mu'minina yawma yaqumul-hisab", translation: "Our Lord, forgive me and my parents and the believers the Day the account is established.", category: "parents" },
	// Entering mosque
	{ day: 49, arabic: "اللهم افتح لي أبواب رحمتك", transliteration: "Allahummaf-tah li abwaba rahmatik", translation: "O Allah, open for me the doors of Your mercy.", category: "entering-mosque" },
	{ day: 50, arabic: "أعوذ بالله العظيم وبوجهه الكريم وسلطانه القديم من الشيطان الرجيم", transliteration: "A'udhu billahil-'adhimi wa bi-wajhihil-karimi wa sultanihil-qadimi minash-shaytanir-rajim", translation: "I seek refuge in Allah the Magnificent, in His Noble Face, and in His eternal authority from the accursed Satan.", category: "entering-mosque" },
	// General/comprehensive
	{ day: 51, arabic: "ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار", transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar", translation: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.", category: "general" },
	{ day: 52, arabic: "اللهم إني أسألك الهدى والتقى والعفاف والغنى", transliteration: "Allahumma inni as'alukal-huda wat-tuqa wal-'afafa wal-ghina", translation: "O Allah, I ask You for guidance, piety, chastity, and self-sufficiency.", category: "general" },
	{ day: 53, arabic: "اللهم أصلح لي ديني الذي هو عصمة أمري", transliteration: "Allahumma aslih li diniyalladhi huwa 'ismatu amri", translation: "O Allah, set right for me my religion which is the safeguard of my affairs.", category: "general" },
	{ day: 54, arabic: "اللهم إني أعوذ بك من شر ما عملت ومن شر ما لم أعمل", transliteration: "Allahumma inni a'udhu bika min sharri ma 'amiltu wa min sharri ma lam a'mal", translation: "O Allah, I seek refuge in You from the evil of what I have done and the evil of what I have not done.", category: "general" },
	{ day: 55, arabic: "ربنا لا تؤاخذنا إن نسينا أو أخطأنا", transliteration: "Rabbana la tu'akhidhna in nasina aw akhta'na", translation: "Our Lord, do not impose blame upon us if we have forgotten or erred.", category: "general" },
	{ day: 56, arabic: "ربنا هب لنا من أزواجنا وذرياتنا قرة أعين", transliteration: "Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yun", translation: "Our Lord, grant us from our spouses and offspring comfort to our eyes.", category: "general" },
	{ day: 57, arabic: "ربنا أفرغ علينا صبرا وثبت أقدامنا", transliteration: "Rabbana afrigh 'alayna sabran wa thabbit aqdamana", translation: "Our Lord, pour upon us patience and plant firmly our feet.", category: "general" },
	{ day: 58, arabic: "ربنا لا تزغ قلوبنا بعد إذ هديتنا", transliteration: "Rabbana la tuzigh qulubana ba'da idh hadaytana", translation: "Our Lord, let not our hearts deviate after You have guided us.", category: "general" },
	{ day: 59, arabic: "اللهم اهدني وسددني", transliteration: "Allahummah-dini wa saddidni", translation: "O Allah, guide me and keep me on the right path.", category: "general" },
	{ day: 60, arabic: "اللهم إني أسألك العفو والعافية في الدنيا والآخرة", transliteration: "Allahumma inni as'alukal-'afwa wal-'afiyata fid-dunya wal-akhirah", translation: "O Allah, I ask You for pardon and well-being in this world and the Hereafter.", category: "general" },
];
