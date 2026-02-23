/**
 * @module data/hadiths
 * @description Collection of 30 curated hadiths for daily reflection
 * during Ramadan, with Arabic text, transliteration, translation, source, and narrator.
 */

export interface Hadith {
	readonly day: number;
	readonly arabic: string;
	readonly transliteration: string;
	readonly translation: string;
	readonly source: string;
	readonly narrator: string;
}

export const RAMADAN_HADITHS: ReadonlyArray<Hadith> = [
	{
		day: 1,
		arabic:
			"\u0645\u064E\u0646\u0652 \u0635\u0627\u0645\u064E \u0631\u064E\u0645\u064E\u0636\u0627\u0646\u064E \u0625\u064A\u0645\u0627\u0646\u0627\u064B \u0648\u064E\u0627\u062D\u0652\u062A\u0650\u0633\u0627\u0628\u0627\u064B \u063A\u064F\u0641\u0650\u0631\u064E \u0644\u064E\u0647\u064F \u0645\u0627 \u062A\u064E\u0642\u064E\u062F\u0651\u064E\u0645\u064E \u0645\u0650\u0646\u0652 \u0630\u064E\u0646\u0652\u0628\u0650\u0647\u0650",
		transliteration: "Man sama Ramadana imanan wahtisaban ghufira lahu ma taqaddama min dhanbih",
		translation:
			"Whoever fasts Ramadan out of faith and seeking reward, his past sins will be forgiven.",
		source: "Sahih Bukhari",
		narrator: "Abu Hurairah",
	},
	{
		day: 2,
		arabic:
			"\u0625\u0650\u0630\u0627 \u062C\u0627\u0621\u064E \u0631\u064E\u0645\u064E\u0636\u0627\u0646\u064F \u0641\u064F\u062A\u0650\u062D\u064E\u062A\u0652 \u0623\u064E\u0628\u0652\u0648\u0627\u0628\u064F \u0627\u0644\u0652\u062C\u064E\u0646\u0651\u064E\u0629\u0650",
		transliteration: "Idha ja'a Ramadanu futihat abwab-ul-jannah",
		translation: "When Ramadan comes, the gates of Paradise are opened.",
		source: "Sahih Bukhari",
		narrator: "Abu Hurairah",
	},
	{
		day: 3,
		arabic:
			"\u0627\u0644\u0635\u0651\u064E\u0648\u0652\u0645\u064F \u062C\u064F\u0646\u0651\u064E\u0629\u064C",
		transliteration: "As-sawmu junnah",
		translation: "Fasting is a shield.",
		source: "Sahih Bukhari",
		narrator: "Abu Hurairah",
	},
	{
		day: 4,
		arabic:
			"\u0645\u064E\u0646\u0652 \u0642\u0627\u0645\u064E \u0631\u064E\u0645\u064E\u0636\u0627\u0646\u064E \u0625\u064A\u0645\u0627\u0646\u0627\u064B \u0648\u064E\u0627\u062D\u0652\u062A\u0650\u0633\u0627\u0628\u0627\u064B \u063A\u064F\u0641\u0650\u0631\u064E \u0644\u064E\u0647\u064F \u0645\u0627 \u062A\u064E\u0642\u064E\u062F\u0651\u064E\u0645\u064E \u0645\u0650\u0646\u0652 \u0630\u064E\u0646\u0652\u0628\u0650\u0647\u0650",
		transliteration: "Man qama Ramadana imanan wahtisaban ghufira lahu ma taqaddama min dhanbih",
		translation:
			"Whoever prays at night in Ramadan out of faith and hope of reward, his past sins will be forgiven.",
		source: "Sahih Bukhari",
		narrator: "Abu Hurairah",
	},
	{
		day: 5,
		arabic:
			"\u062A\u064E\u0633\u064E\u062D\u0651\u064E\u0631\u0648\u0627 \u0641\u064E\u0625\u0650\u0646\u0651\u064E \u0641\u064A \u0627\u0644\u0633\u0651\u064E\u062D\u0648\u0631\u0650 \u0628\u064E\u0631\u064E\u0643\u064E\u0629\u064B",
		transliteration: "Tasahharu fa inna fis-sahuri barakah",
		translation: "Take suhoor, for in suhoor there is blessing.",
		source: "Sahih Bukhari",
		narrator: "Anas ibn Malik",
	},
	{
		day: 6,
		arabic:
			"\u0645\u064E\u0646\u0652 \u0641\u064E\u0637\u0651\u064E\u0631\u064E \u0635\u0627\u0626\u0650\u0645\u0627\u064B \u0643\u0627\u0646\u064E \u0644\u064E\u0647\u064F \u0645\u0650\u062B\u0652\u0644\u064F \u0623\u064E\u062C\u0652\u0631\u0650\u0647\u0650",
		transliteration: "Man fattara sa'iman kana lahu mithlu ajrih",
		translation: "Whoever feeds a fasting person will have a reward like his.",
		source: "Sunan Tirmidhi",
		narrator: "Zayd ibn Khalid",
	},
	{
		day: 7,
		arabic:
			"\u0625\u0650\u0630\u0627 \u0623\u064E\u0641\u0652\u0637\u064E\u0631\u064E \u0623\u064E\u062D\u064E\u062F\u064F\u0643\u064F\u0645\u0652 \u0641\u064E\u0644\u0652\u064A\u064F\u0641\u0652\u0637\u0650\u0631\u0652 \u0639\u064E\u0644\u0649 \u062A\u064E\u0645\u0652\u0631\u064D",
		transliteration: "Idha aftara ahadukum falyuftir 'ala tamr",
		translation: "When one of you breaks his fast, let him break it with dates.",
		source: "Sunan Abu Dawud",
		narrator: "Salman ibn Amir",
	},
	{
		day: 8,
		arabic:
			"\u0643\u064F\u0644\u0651\u064F \u0639\u064E\u0645\u064E\u0644\u0650 \u0627\u0628\u0652\u0646\u0650 \u0622\u062F\u064E\u0645\u064E \u0644\u064E\u0647\u064F \u0625\u0650\u0644\u0651\u0627 \u0627\u0644\u0635\u0651\u064E\u0648\u0652\u0645\u064E \u0641\u064E\u0625\u0650\u0646\u0651\u064E\u0647\u064F \u0644\u064A \u0648\u064E\u0623\u064E\u0646\u0627 \u0623\u064E\u062C\u0652\u0632\u064A \u0628\u0650\u0647\u0650",
		transliteration: "Kullu 'amali ibni Adama lahu illas-sawma fa-innahu li wa ana ajzi bih",
		translation:
			"Every deed of the son of Adam is for him except fasting — it is for Me and I will reward it.",
		source: "Sahih Bukhari",
		narrator: "Abu Hurairah",
	},
	{
		day: 9,
		arabic:
			"\u0644\u0650\u0644\u0635\u0651\u0627\u0626\u0650\u0645\u0650 \u0641\u064E\u0631\u0652\u062D\u064E\u062A\u0627\u0646\u0650",
		transliteration: "Lis-sa'imi farhatan",
		translation: "The fasting person has two moments of joy.",
		source: "Sahih Bukhari",
		narrator: "Abu Hurairah",
	},
	{
		day: 10,
		arabic:
			"\u0645\u064E\u0646\u0652 \u0644\u064E\u0645\u0652 \u064A\u064E\u062F\u064E\u0639\u0652 \u0642\u064E\u0648\u0652\u0644\u064E \u0627\u0644\u0632\u0651\u064F\u0648\u0631\u0650 \u0648\u064E\u0627\u0644\u0652\u0639\u064E\u0645\u064E\u0644\u064E \u0628\u0650\u0647\u0650",
		transliteration: "Man lam yada' qawlaz-zuri wal-'amala bih",
		translation:
			"Whoever does not give up false speech and evil actions, Allah has no need of his fasting.",
		source: "Sahih Bukhari",
		narrator: "Abu Hurairah",
	},
	{
		day: 11,
		arabic:
			"\u0627\u0644\u0635\u0651\u064E\u0644\u064E\u0648\u0627\u062A\u064F \u0627\u0644\u0652\u062E\u064E\u0645\u0652\u0633\u064F \u0648\u064E\u0631\u064E\u0645\u064E\u0636\u0627\u0646\u064F \u0625\u0650\u0644\u0649 \u0631\u064E\u0645\u064E\u0636\u0627\u0646\u064E \u0645\u064F\u0643\u064E\u0641\u0651\u0650\u0631\u0627\u062A\u064C \u0644\u0650\u0645\u0627 \u0628\u064E\u064A\u0652\u0646\u064E\u0647\u064F\u0646\u0651\u064E",
		transliteration: "As-salawatul-khamsu wa Ramadanu ila Ramadana mukaffiratun lima baynahunna",
		translation: "The five prayers and Ramadan to Ramadan are expiation for what is between them.",
		source: "Sahih Muslim",
		narrator: "Abu Hurairah",
	},
	{
		day: 12,
		arabic:
			"\u0623\u064E\u0641\u0652\u0636\u064E\u0644\u064F \u0627\u0644\u0635\u0651\u064E\u062F\u064E\u0642\u064E\u0629\u0650 \u0635\u064E\u062F\u064E\u0642\u064E\u0629\u064C \u0641\u064A \u0631\u064E\u0645\u064E\u0636\u0627\u0646\u064E",
		transliteration: "Afdalus-sadaqati sadaqatun fi Ramadan",
		translation: "The best charity is charity given in Ramadan.",
		source: "Sunan Tirmidhi",
		narrator: "Anas ibn Malik",
	},
	{
		day: 13,
		arabic:
			"\u0643\u0627\u0646\u064E \u0631\u064E\u0633\u0648\u0644\u064F \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0623\u064E\u062C\u0652\u0648\u064E\u062F\u064E \u0627\u0644\u0646\u0651\u0627\u0633\u0650",
		transliteration: "Kana Rasulullahi ajwadan-nas",
		translation: "The Messenger of Allah was the most generous of people.",
		source: "Sahih Bukhari",
		narrator: "Ibn Abbas",
	},
	{
		day: 14,
		arabic:
			"\u0639\u064F\u0645\u0652\u0631\u064E\u0629\u064C \u0641\u064A \u0631\u064E\u0645\u064E\u0636\u0627\u0646\u064E \u062A\u064E\u0639\u0652\u062F\u0650\u0644\u064F \u062D\u064E\u062C\u0651\u064E\u0629\u064B",
		transliteration: "'Umratun fi Ramadana ta'dilu hajjah",
		translation: "An Umrah in Ramadan is equal to Hajj.",
		source: "Sahih Bukhari",
		narrator: "Ibn Abbas",
	},
	{
		day: 15,
		arabic:
			"\u0625\u0650\u0630\u0627 \u0643\u0627\u0646\u064E \u064A\u064E\u0648\u0652\u0645\u064F \u0635\u064E\u0648\u0652\u0645\u0650 \u0623\u064E\u062D\u064E\u062F\u0650\u0643\u064F\u0645\u0652 \u0641\u064E\u0644\u0627 \u064A\u064E\u0631\u0652\u0641\u064F\u062B\u0652 \u0648\u064E\u0644\u0627 \u064A\u064E\u0635\u0652\u062E\u064E\u0628\u0652",
		transliteration: "Idha kana yawmu sawmi ahadikum fala yarfuth wa la yaskhab",
		translation: "When one of you is fasting, he should not behave indecently or noisily.",
		source: "Sahih Bukhari",
		narrator: "Abu Hurairah",
	},
	{
		day: 16,
		arabic:
			"\u0645\u064E\u0646\u0652 \u0642\u0627\u0645\u064E \u0644\u064E\u064A\u0652\u0644\u064E\u0629\u064E \u0627\u0644\u0652\u0642\u064E\u062F\u0652\u0631\u0650 \u0625\u064A\u0645\u0627\u0646\u0627\u064B \u0648\u064E\u0627\u062D\u0652\u062A\u0650\u0633\u0627\u0628\u0627\u064B",
		transliteration: "Man qama laylat-al-qadri imanan wahtisaban",
		translation: "Whoever stands in prayer on the Night of Decree out of faith and hope of reward.",
		source: "Sahih Bukhari",
		narrator: "Abu Hurairah",
	},
	{
		day: 17,
		arabic:
			"\u062A\u064E\u062D\u064E\u0631\u0651\u064E\u0648\u0652\u0627 \u0644\u064E\u064A\u0652\u0644\u064E\u0629\u064E \u0627\u0644\u0652\u0642\u064E\u062F\u0652\u0631\u0650 \u0641\u064A \u0627\u0644\u0652\u0639\u064E\u0634\u0652\u0631\u0650 \u0627\u0644\u0623\u064E\u0648\u0627\u062E\u0650\u0631\u0650",
		transliteration: "Taharraw laylat-al-qadri fil-'ashril-awakhir",
		translation: "Seek the Night of Decree in the last ten nights.",
		source: "Sahih Bukhari",
		narrator: "Aisha",
	},
	{
		day: 18,
		arabic:
			"\u0645\u064E\u0646\u0652 \u0635\u0627\u0645\u064E \u064A\u064E\u0648\u0652\u0645\u0627\u064B \u0641\u064A \u0633\u064E\u0628\u064A\u0644\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0628\u0627\u0639\u064E\u062F\u064E \u0627\u0644\u0644\u0651\u064E\u0647\u064F \u0648\u064E\u062C\u0652\u0647\u064E\u0647\u064F \u0639\u064E\u0646\u0650 \u0627\u0644\u0646\u0651\u0627\u0631\u0650",
		transliteration: "Man sama yawman fi sabilillahi ba'adal-lahu wajhahu 'anin-nar",
		translation:
			"Whoever fasts a day for the sake of Allah, Allah will distance his face from the Fire.",
		source: "Sahih Bukhari",
		narrator: "Abu Sa'id al-Khudri",
	},
	{
		day: 19,
		arabic:
			"\u0625\u0650\u0646\u0651\u064E \u0641\u064A \u0627\u0644\u0652\u062C\u064E\u0646\u0651\u064E\u0629\u0650 \u0628\u0627\u0628\u0627\u064B \u064A\u064F\u0642\u0627\u0644\u064F \u0644\u064E\u0647\u064F \u0627\u0644\u0631\u0651\u064E\u064A\u0651\u0627\u0646\u064F",
		transliteration: "Inna fil-jannati baban yuqalu lahur-Rayyan",
		translation: "Indeed in Paradise there is a gate called Ar-Rayyan, for those who fast.",
		source: "Sahih Bukhari",
		narrator: "Sahl ibn Sa'd",
	},
	{
		day: 20,
		arabic:
			"\u0644\u064E\u062E\u064F\u0644\u0648\u0641\u064F \u0641\u064E\u0645\u0650 \u0627\u0644\u0635\u0651\u0627\u0626\u0650\u0645\u0650 \u0623\u064E\u0637\u0652\u064A\u064E\u0628\u064F \u0639\u0650\u0646\u062F\u064E \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0645\u0650\u0646\u0652 \u0631\u064A\u062D\u0650 \u0627\u0644\u0652\u0645\u0650\u0633\u0652\u0643\u0650",
		transliteration: "Lakhulufu fam-is-sa'imi atyabu 'indal-lahi min rih-il-misk",
		translation: "The breath of the fasting person is sweeter to Allah than the scent of musk.",
		source: "Sahih Bukhari",
		narrator: "Abu Hurairah",
	},
	{
		day: 21,
		arabic:
			"\u0627\u0644\u0635\u0651\u064E\u0648\u0652\u0645\u064F \u0648\u064E\u0627\u0644\u0652\u0642\u064F\u0631\u0652\u0622\u0646\u064F \u064A\u064E\u0634\u0652\u0641\u064E\u0639\u0627\u0646\u0650 \u0644\u0650\u0644\u0652\u0639\u064E\u0628\u0652\u062F\u0650 \u064A\u064E\u0648\u0652\u0645\u064E \u0627\u0644\u0652\u0642\u0650\u064A\u0627\u0645\u064E\u0629\u0650",
		transliteration: "As-sawmu wal-Qur'anu yashfa'ani lil-'abdi yawmal-qiyamah",
		translation: "Fasting and the Quran will intercede for the servant on the Day of Judgment.",
		source: "Musnad Ahmad",
		narrator: "Abdullah ibn Amr",
	},
	{
		day: 22,
		arabic:
			"\u0645\u064E\u0646\u0652 \u0623\u064E\u0646\u0652\u0641\u064E\u0642\u064E \u0632\u064E\u0648\u0652\u062C\u064E\u064A\u0652\u0646\u0650 \u0641\u064A \u0633\u064E\u0628\u064A\u0644\u0650 \u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u062F\u064F\u0639\u0650\u064A\u064E \u0645\u0650\u0646\u0652 \u0623\u064E\u0628\u0652\u0648\u0627\u0628\u0650 \u0627\u0644\u0652\u062C\u064E\u0646\u0651\u064E\u0629\u0650",
		transliteration: "Man anfaqa zawjayni fi sabilillahi du'iya min abwab-il-jannah",
		translation:
			"Whoever spends a pair in the way of Allah will be called from the gates of Paradise.",
		source: "Sahih Bukhari",
		narrator: "Abu Hurairah",
	},
	{
		day: 23,
		arabic:
			"\u0643\u0627\u0646\u064E \u0625\u0650\u0630\u0627 \u062F\u064E\u062E\u064E\u0644\u064E \u0627\u0644\u0652\u0639\u064E\u0634\u0652\u0631\u064F \u0634\u064E\u062F\u0651\u064E \u0645\u0650\u0626\u0652\u0632\u064E\u0631\u064E\u0647\u064F \u0648\u064E\u0623\u064E\u062D\u0652\u064A\u0627 \u0644\u064E\u064A\u0652\u0644\u064E\u0647\u064F",
		transliteration: "Kana idha dakhalal-'ashru shadda mi'zarahu wa ahya laylah",
		translation: "When the last ten days came, he would tighten his belt and stay up the night.",
		source: "Sahih Bukhari",
		narrator: "Aisha",
	},
	{
		day: 24,
		arabic:
			"\u0627\u0644\u062F\u0651\u064F\u0639\u0627\u0621\u064F \u0647\u064F\u0648\u064E \u0627\u0644\u0652\u0639\u0650\u0628\u0627\u062F\u064E\u0629\u064F",
		transliteration: "Ad-du'a'u huwal-'ibadah",
		translation: "Supplication is the essence of worship.",
		source: "Sunan Tirmidhi",
		narrator: "Nu'man ibn Bashir",
	},
	{
		day: 25,
		arabic:
			"\u0625\u0650\u0646\u0651\u064E\u0645\u0627 \u0627\u0644\u0623\u064E\u0639\u0652\u0645\u0627\u0644\u064F \u0628\u0650\u0627\u0644\u0646\u0651\u0650\u064A\u0651\u0627\u062A\u0650",
		transliteration: "Innamal-a'malu bin-niyyat",
		translation: "Actions are judged by intentions.",
		source: "Sahih Bukhari",
		narrator: "Umar ibn al-Khattab",
	},
	{
		day: 26,
		arabic:
			"\u062E\u064E\u064A\u0652\u0631\u064F\u0643\u064F\u0645\u0652 \u0645\u064E\u0646\u0652 \u062A\u064E\u0639\u064E\u0644\u0651\u064E\u0645\u064E \u0627\u0644\u0652\u0642\u064F\u0631\u0652\u0622\u0646\u064E \u0648\u064E\u0639\u064E\u0644\u0651\u064E\u0645\u064E\u0647\u064F",
		transliteration: "Khayrukum man ta'allamal-Qur'ana wa 'allamah",
		translation: "The best of you are those who learn the Quran and teach it.",
		source: "Sahih Bukhari",
		narrator: "Uthman ibn Affan",
	},
	{
		day: 27,
		arabic:
			"\u0627\u0644\u0644\u0651\u064E\u0647\u064F\u0645\u0651\u064E \u0625\u0650\u0646\u0651\u064E\u0643\u064E \u0639\u064E\u0641\u064F\u0648\u0651\u064C \u062A\u064F\u062D\u0650\u0628\u0651\u064F \u0627\u0644\u0652\u0639\u064E\u0641\u0652\u0648\u064E \u0641\u064E\u0627\u0639\u0652\u0641\u064F \u0639\u064E\u0646\u0651\u064A",
		transliteration: "Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni",
		translation: "O Allah, You are Forgiving and love forgiveness, so forgive me.",
		source: "Sunan Tirmidhi",
		narrator: "Aisha",
	},
	{
		day: 28,
		arabic:
			"\u0644\u0627 \u064A\u064F\u0624\u0652\u0645\u0650\u0646\u064F \u0623\u064E\u062D\u064E\u062F\u064F\u0643\u064F\u0645\u0652 \u062D\u064E\u062A\u0651\u0649 \u064A\u064F\u062D\u0650\u0628\u0651\u064E \u0644\u0650\u0623\u064E\u062E\u064A\u0647\u0650 \u0645\u0627 \u064A\u064F\u062D\u0650\u0628\u0651\u064F \u0644\u0650\u0646\u064E\u0641\u0652\u0633\u0650\u0647\u0650",
		transliteration: "La yu'minu ahadukum hatta yuhibba li-akhihi ma yuhibbu li-nafsih",
		translation:
			"None of you truly believes until he loves for his brother what he loves for himself.",
		source: "Sahih Bukhari",
		narrator: "Anas ibn Malik",
	},
	{
		day: 29,
		arabic:
			"\u0645\u064E\u0646\u0652 \u0643\u0627\u0646\u064E \u064A\u064F\u0624\u0652\u0645\u0650\u0646\u064F \u0628\u0650\u0627\u0644\u0644\u0651\u064E\u0647\u0650 \u0648\u064E\u0627\u0644\u0652\u064A\u064E\u0648\u0652\u0645\u0650 \u0627\u0644\u0622\u062E\u0650\u0631\u0650 \u0641\u064E\u0644\u0652\u064A\u064E\u0642\u064F\u0644\u0652 \u062E\u064E\u064A\u0652\u0631\u0627\u064B \u0623\u064E\u0648\u0652 \u0644\u0650\u064A\u064E\u0635\u0652\u0645\u064F\u062A\u0652",
		transliteration: "Man kana yu'minu billahi wal-yawmil-akhiri falyaqul khayran aw liyasmut",
		translation: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.",
		source: "Sahih Bukhari",
		narrator: "Abu Hurairah",
	},
	{
		day: 30,
		arabic:
			"\u0639\u064E\u062C\u0651\u0650\u0644\u0648\u0627 \u0627\u0644\u0652\u0641\u0650\u0637\u0652\u0631\u064E \u0648\u064E\u0623\u064E\u062E\u0651\u0650\u0631\u0648\u0627 \u0627\u0644\u0633\u0651\u064E\u062D\u0648\u0631\u064E",
		transliteration: "'Ajjilul-fitra wa akhkhirus-sahur",
		translation: "Hasten the breaking of the fast and delay the suhoor.",
		source: "Musnad Ahmad",
		narrator: "Abu Dharr",
	},
];
