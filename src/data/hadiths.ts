/**
 * @module data/hadiths
 * @description Collection of 60 curated hadiths for daily reflection
 * during Ramadan, with Arabic text, transliteration, translation, source, and narrator.
 * RAMADAN_HADITHS covers days 1-30, ADDITIONAL_HADITHS covers days 31-60.
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

export const ADDITIONAL_HADITHS: ReadonlyArray<Hadith> = [
	{
		day: 31,
		arabic: "إنما الأعمال بالنيات وإنما لكل امرئ ما نوى",
		transliteration: "Innamal-a'malu bin-niyyati wa innama li-kulli imri'in ma nawa",
		translation: "Actions are judged by intentions, and every person shall have what he intended.",
		source: "Sahih Bukhari",
		narrator: "Umar ibn al-Khattab",
	},
	{
		day: 32,
		arabic: "من قام ليلة القدر إيمانا واحتسابا غفر له ما تقدم من ذنبه",
		transliteration: "Man qama laylat-al-qadri imanan wahtisaban ghufira lahu ma taqaddama min dhanbih",
		translation: "Whoever stands in prayer on the Night of Decree out of faith and seeking reward, his past sins will be forgiven.",
		source: "Sahih Bukhari",
		narrator: "Abu Hurairah",
	},
	{
		day: 33,
		arabic: "أفضل الصدقة في رمضان",
		transliteration: "Afdalus-sadaqati fi Ramadan",
		translation: "The best charity is charity given in Ramadan.",
		source: "Sunan Tirmidhi",
		narrator: "Anas ibn Malik",
	},
	{
		day: 34,
		arabic: "من فطر صائما كان له مثل أجره",
		transliteration: "Man fattara sa'iman kana lahu mithlu ajrih",
		translation: "Whoever provides iftar for a fasting person earns the same reward.",
		source: "Sunan Tirmidhi",
		narrator: "Zayd ibn Khalid",
	},
	{
		day: 35,
		arabic: "أقرب ما يكون العبد من ربه وهو ساجد",
		transliteration: "Aqrabu ma yakunul-'abdu min Rabbihi wa huwa sajid",
		translation: "The closest a servant is to his Lord is when he is in prostration.",
		source: "Sahih Muslim",
		narrator: "Abu Hurairah",
	},
	{
		day: 36,
		arabic: "خيركم من تعلم القرآن وعلمه",
		transliteration: "Khayrukum man ta'allamal-Qur'ana wa 'allamah",
		translation: "The best of you are those who learn the Quran and teach it.",
		source: "Sahih Bukhari",
		narrator: "Uthman ibn Affan",
	},
	{
		day: 37,
		arabic: "إن الله لا ينظر إلى أجسادكم ولا إلى صوركم ولكن ينظر إلى قلوبكم",
		transliteration: "Innallaha la yandhuru ila ajsamikum wa la ila suwarikum wa lakin yandhuru ila qulubikum",
		translation: "Allah does not look at your bodies or forms, but He looks at your hearts.",
		source: "Sahih Muslim",
		narrator: "Abu Hurairah",
	},
	{
		day: 38,
		arabic: "الطهور شطر الإيمان",
		transliteration: "At-tuhuru shatrul-iman",
		translation: "Purification is half of faith.",
		source: "Sahih Muslim",
		narrator: "Abu Malik al-Ash'ari",
	},
	{
		day: 39,
		arabic: "من سلك طريقا يلتمس فيه علما سهل الله له طريقا إلى الجنة",
		transliteration: "Man salaka tariqan yaltamisu fihi 'ilman sahhalallahu lahu tariqan ilal-jannah",
		translation: "Whoever takes a path seeking knowledge, Allah will ease for him a path to Paradise.",
		source: "Sahih Muslim",
		narrator: "Abu Hurairah",
	},
	{
		day: 40,
		arabic: "لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه",
		transliteration: "La yu'minu ahadukum hatta yuhibba li-akhihi ma yuhibbu li-nafsih",
		translation: "None of you truly believes until he loves for his brother what he loves for himself.",
		source: "Sahih Bukhari",
		narrator: "Anas ibn Malik",
	},
	{
		day: 41,
		arabic: "الكلمة الطيبة صدقة",
		transliteration: "Al-kalimatu-t-tayyibatu sadaqah",
		translation: "A good word is charity.",
		source: "Sahih Bukhari",
		narrator: "Abu Hurairah",
	},
	{
		day: 42,
		arabic: "تبسمك في وجه أخيك صدقة",
		transliteration: "Tabassumuka fi wajhi akhika sadaqah",
		translation: "Your smile for your brother is charity.",
		source: "Sunan Tirmidhi",
		narrator: "Abu Dharr",
	},
	{
		day: 43,
		arabic: "الدعاء هو العبادة",
		transliteration: "Ad-du'a'u huwal-'ibadah",
		translation: "Supplication is the essence of worship.",
		source: "Sunan Tirmidhi",
		narrator: "Nu'man ibn Bashir",
	},
	{
		day: 44,
		arabic: "اتق الله حيثما كنت",
		transliteration: "Ittaqillaha haythuma kunt",
		translation: "Fear Allah wherever you are.",
		source: "Sunan Tirmidhi",
		narrator: "Abu Dharr",
	},
	{
		day: 45,
		arabic: "المسلم من سلم المسلمون من لسانه ويده",
		transliteration: "Al-muslimu man salimal-muslimuna min lisanihi wa yadih",
		translation: "A Muslim is one from whose tongue and hand the Muslims are safe.",
		source: "Sahih Bukhari",
		narrator: "Abdullah ibn Amr",
	},
	{
		day: 46,
		arabic: "ما ملأ آدمي وعاء شرا من بطنه",
		transliteration: "Ma mala'a adamiyyun wi'a'an sharran min batnih",
		translation: "No human being has ever filled a vessel worse than his stomach.",
		source: "Sunan Tirmidhi",
		narrator: "Miqdam ibn Ma'dikarib",
	},
	{
		day: 47,
		arabic: "من حسن إسلام المرء تركه ما لا يعنيه",
		transliteration: "Min husni islami-l-mar'i tarkuhu ma la ya'nih",
		translation: "Part of the perfection of one's Islam is leaving that which does not concern him.",
		source: "Sunan Tirmidhi",
		narrator: "Abu Hurairah",
	},
	{
		day: 48,
		arabic: "إن الله رفيق يحب الرفق في الأمر كله",
		transliteration: "Innallaha rafiqun yuhibbur-rifqa fil-amri kullih",
		translation: "Allah is gentle and loves gentleness in all matters.",
		source: "Sahih Bukhari",
		narrator: "Aisha",
	},
	{
		day: 49,
		arabic: "الصبر ضياء",
		transliteration: "As-sabru diya'",
		translation: "Patience is illumination.",
		source: "Sahih Muslim",
		narrator: "Abu Malik al-Ash'ari",
	},
	{
		day: 50,
		arabic: "ما نقصت صدقة من مال",
		transliteration: "Ma naqasat sadaqatun min mal",
		translation: "Charity does not decrease wealth.",
		source: "Sahih Muslim",
		narrator: "Abu Hurairah",
	},
	{
		day: 51,
		arabic: "من صام رمضان ثم أتبعه ستا من شوال",
		transliteration: "Man sama Ramadana thumma atba'ahu sittan min Shawwal",
		translation: "Whoever fasts Ramadan then follows it with six days of Shawwal.",
		source: "Sahih Muslim",
		narrator: "Abu Ayyub al-Ansari",
	},
	{
		day: 52,
		arabic: "أحب الأعمال إلى الله أدومها وإن قل",
		transliteration: "Ahabbul-a'mali ilal-lahi adwamuha wa in qall",
		translation: "The most beloved deeds to Allah are the most consistent, even if small.",
		source: "Sahih Bukhari",
		narrator: "Aisha",
	},
	{
		day: 53,
		arabic: "سبحان الله وبحمده سبحان الله العظيم",
		transliteration: "SubhanAllahi wa bihamdihi SubhanAllahil-'Adhim",
		translation: "Two phrases beloved to the Most Merciful: Glory be to Allah and His praise, Glory be to Allah the Magnificent.",
		source: "Sahih Bukhari",
		narrator: "Abu Hurairah",
	},
	{
		day: 54,
		arabic: "الدنيا سجن المؤمن وجنة الكافر",
		transliteration: "Ad-dunya sijnul-mu'mini wa jannatul-kafir",
		translation: "This world is a prison for the believer and paradise for the disbeliever.",
		source: "Sahih Muslim",
		narrator: "Abu Hurairah",
	},
	{
		day: 55,
		arabic: "إذا مات ابن آدم انقطع عمله إلا من ثلاث",
		transliteration: "Idha mata-bnu Adama inqata'a 'amaluhu illa min thalath",
		translation: "When the son of Adam dies, his deeds cease except for three.",
		source: "Sahih Muslim",
		narrator: "Abu Hurairah",
	},
	{
		day: 56,
		arabic: "من كان يؤمن بالله واليوم الآخر فليكرم ضيفه",
		transliteration: "Man kana yu'minu billahi wal-yawmil-akhiri falyukrim dayfah",
		translation: "Whoever believes in Allah and the Last Day, let him honor his guest.",
		source: "Sahih Bukhari",
		narrator: "Abu Hurairah",
	},
	{
		day: 57,
		arabic: "اللهم إنك عفو تحب العفو فاعف عني",
		transliteration: "Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni",
		translation: "O Allah, You are Pardoning and love to pardon, so pardon me.",
		source: "Sunan Tirmidhi",
		narrator: "Aisha",
	},
	{
		day: 58,
		arabic: "الصلاة نور",
		transliteration: "As-salatu nur",
		translation: "Prayer is light.",
		source: "Sahih Muslim",
		narrator: "Abu Malik al-Ash'ari",
	},
	{
		day: 59,
		arabic: "أفضل الذكر لا إله إلا الله",
		transliteration: "Afdaludh-dhikri la ilaha illal-lah",
		translation: "The best remembrance is: there is no god but Allah.",
		source: "Sunan Tirmidhi",
		narrator: "Jabir ibn Abdullah",
	},
	{
		day: 60,
		arabic: "اللهم أعني على ذكرك وشكرك وحسن عبادتك",
		transliteration: "Allahumma a'inni 'ala dhikrika wa shukrika wa husni 'ibadatik",
		translation: "O Allah, help me to remember You, thank You, and worship You well.",
		source: "Sunan Abu Dawud",
		narrator: "Mu'adh ibn Jabal",
	},
];
