/**
 * @module data/adhkar
 * @description Collections of adhkar (remembrances of Allah) organized by
 * category: morning, evening, and post-prayer. Each entry includes Arabic
 * text, transliteration, English translation, and optional repetition count.
 */

export interface Dhikr {
	readonly arabic: string;
	readonly transliteration: string;
	readonly translation: string;
	readonly count?: number;
}

export interface AdhkarCollection {
	readonly id: string;
	readonly title: string;
	readonly items: readonly Dhikr[];
}

export const ADHKAR_COLLECTIONS: ReadonlyArray<AdhkarCollection> = [
	{
		id: "morning",
		title: "Morning Adhkar (Adhkar al-Sabah)",
		items: [
			{
				arabic:
					"أصبحنا وأصبح الملك لله والحمد لله لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير",
				transliteration:
					"Asbahna wa asbahal mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la sharika lah, lahul mulku wa lahul hamdu wa huwa 'ala kulli shay'in qadir",
				translation:
					"We have entered the morning and the dominion belongs to Allah. Praise is to Allah. None has the right to be worshipped except Allah alone, with no partner. To Him belongs the dominion and to Him is the praise, and He is over all things capable.",
			},
			{
				arabic: "سبحان الله وبحمده",
				transliteration: "SubhanAllahi wa bihamdihi",
				translation:
					"Glory be to Allah and praise Him. Whoever says this one hundred times in the morning and evening will have his sins forgiven even if they are like the foam of the sea.",
				count: 100,
			},
			{
				arabic:
					"اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
				transliteration:
					"Allahu la ilaha illa huwal Hayyul Qayyum, la ta'khudhuhu sinatun wa la nawm, lahu ma fis-samawati wa ma fil-ard, man dhal-ladhi yashfa'u 'indahu illa bi-idhnih, ya'lamu ma bayna aydihim wa ma khalfahum, wa la yuhituna bi shay'in min 'ilmihi illa bima sha', wasi'a kursiyyuhus-samawati wal-ard, wa la ya'uduhu hifdhuhuma, wa huwal 'Aliyyul 'Adhim",
				translation:
					"Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. (Ayat al-Kursi, Al-Baqarah 2:255)",
			},
			{
				arabic: "بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم",
				transliteration:
					"Bismillahilladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa huwas-Sami'ul 'Alim",
				translation:
					"In the name of Allah, with whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.",
				count: 3,
			},
			{
				arabic: "اللهم بك أصبحنا وبك أمسينا وبك نحيا وبك نموت وإليك النشور",
				transliteration:
					"Allahumma bika asbahna wa bika amsayna wa bika nahya wa bika namutu wa ilaykan-nushur",
				translation:
					"O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the resurrection.",
			},
			{
				arabic:
					"اللهم إني أصبحت أشهدك وأشهد حملة عرشك وملائكتك وجميع خلقك أنك أنت الله لا إله إلا أنت وحدك لا شريك لك وأن محمدا عبدك ورسولك",
				transliteration:
					"Allahumma inni asbahtu ushhiduka wa ushhidu hamalata 'arshika wa mala'ikataka wa jami'a khalqika annaka antallahu la ilaha illa anta wahdaka la sharika laka wa anna Muhammadan 'abduka wa rasuluk",
				translation:
					"O Allah, I have entered the morning calling You to witness, and calling the bearers of Your Throne, Your angels, and all of Your creation to witness that You are Allah, none has the right to be worshipped except You alone, without partner, and that Muhammad is Your servant and messenger.",
				count: 4,
			},
			{
				arabic: "اللهم عافني في بدني، اللهم عافني في سمعي، اللهم عافني في بصري، لا إله إلا أنت",
				transliteration:
					"Allahumma 'afini fi badani, Allahumma 'afini fi sam'i, Allahumma 'afini fi basari, la ilaha illa ant",
				translation:
					"O Allah, grant me well-being in my body. O Allah, grant me well-being in my hearing. O Allah, grant me well-being in my sight. There is no deity except You.",
				count: 3,
			},
			{
				arabic:
					"قل هو الله أحد، الله الصمد، لم يلد ولم يولد، ولم يكن له كفوا أحد",
				transliteration:
					"Qul huwal-lahu ahad, Allahus-samad, lam yalid wa lam yulad, wa lam yakun lahu kufuwan ahad",
				translation:
					"Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born, nor is there any equivalent to Him. (Surah Al-Ikhlas 3x)",
				count: 3,
			},
			{
				arabic: "قل أعوذ برب الفلق، من شر ما خلق",
				transliteration:
					"Qul a'udhu bi-rabbil-falaq, min sharri ma khalaq",
				translation:
					"Say: I seek refuge in the Lord of daybreak, from the evil of that which He created. (Surah Al-Falaq 3x)",
				count: 3,
			},
			{
				arabic:
					"حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم",
				transliteration:
					"HasbiyAllahu la ilaha illa huwa 'alayhi tawakkaltu wa huwa Rabbul-'arshil-'adhim",
				translation:
					"Allah is sufficient for me. There is no deity except Him. On Him I have relied, and He is the Lord of the Great Throne.",
				count: 7,
			},
		],
	},
	{
		id: "evening",
		title: "Evening Adhkar (Adhkar al-Masa')",
		items: [
			{
				arabic:
					"أمسينا وأمسى الملك لله والحمد لله لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير",
				transliteration:
					"Amsayna wa amsal mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la sharika lah, lahul mulku wa lahul hamdu wa huwa 'ala kulli shay'in qadir",
				translation:
					"We have entered the evening and the dominion belongs to Allah. Praise is to Allah. None has the right to be worshipped except Allah alone, with no partner. To Him belongs the dominion and to Him is the praise, and He is over all things capable.",
			},
			{
				arabic: "سبحان الله وبحمده",
				transliteration: "SubhanAllahi wa bihamdihi",
				translation:
					"Glory be to Allah and praise Him. Whoever says this one hundred times in the morning and evening will have his sins forgiven even if they are like the foam of the sea.",
				count: 100,
			},
			{
				arabic:
					"اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
				transliteration:
					"Allahu la ilaha illa huwal Hayyul Qayyum, la ta'khudhuhu sinatun wa la nawm, lahu ma fis-samawati wa ma fil-ard, man dhal-ladhi yashfa'u 'indahu illa bi-idhnih, ya'lamu ma bayna aydihim wa ma khalfahum, wa la yuhituna bi shay'in min 'ilmihi illa bima sha', wasi'a kursiyyuhus-samawati wal-ard, wa la ya'uduhu hifdhuhuma, wa huwal 'Aliyyul 'Adhim",
				translation:
					"Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. (Ayat al-Kursi, Al-Baqarah 2:255)",
			},
			{
				arabic: "أعوذ بكلمات الله التامات من شر ما خلق",
				transliteration: "A'udhu bikalimatillahit-tammati min sharri ma khalaq",
				translation:
					"I seek refuge in the perfect words of Allah from the evil of what He has created.",
				count: 3,
			},
			{
				arabic: "اللهم بك أمسينا وبك أصبحنا وبك نحيا وبك نموت وإليك المصير",
				transliteration:
					"Allahumma bika amsayna wa bika asbahna wa bika nahya wa bika namutu wa ilaykal-masir",
				translation:
					"O Allah, by You we enter the evening and by You we enter the morning, by You we live and by You we die, and to You is the final destination.",
			},
			{
				arabic:
					"اللهم إني أمسيت أشهدك وأشهد حملة عرشك وملائكتك وجميع خلقك أنك أنت الله لا إله إلا أنت وحدك لا شريك لك وأن محمدا عبدك ورسولك",
				transliteration:
					"Allahumma inni amsaytu ushhiduka wa ushhidu hamalata 'arshika wa mala'ikataka wa jami'a khalqika annaka antallahu la ilaha illa anta wahdaka la sharika laka wa anna Muhammadan 'abduka wa rasuluk",
				translation:
					"O Allah, I have entered the evening calling You to witness, and calling the bearers of Your Throne, Your angels, and all of Your creation to witness that You are Allah, none has the right to be worshipped except You alone, without partner, and that Muhammad is Your servant and messenger.",
				count: 4,
			},
			{
				arabic: "اللهم ما أمسى بي من نعمة أو بأحد من خلقك فمنك وحدك لا شريك لك فلك الحمد ولك الشكر",
				transliteration:
					"Allahumma ma amsa bi min ni'matin aw bi-ahadin min khalqika faminka wahdaka la sharika laka falakal-hamdu wa lakash-shukr",
				translation:
					"O Allah, whatever blessing I or any of Your creation have received this evening is from You alone, without partner. So all praise and thanks are to You.",
			},
			{
				arabic:
					"قل هو الله أحد، الله الصمد، لم يلد ولم يولد، ولم يكن له كفوا أحد",
				transliteration:
					"Qul huwal-lahu ahad, Allahus-samad, lam yalid wa lam yulad, wa lam yakun lahu kufuwan ahad",
				translation:
					"Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born, nor is there any equivalent to Him. (Surah Al-Ikhlas 3x)",
				count: 3,
			},
			{
				arabic: "قل أعوذ برب الفلق، من شر ما خلق",
				transliteration:
					"Qul a'udhu bi-rabbil-falaq, min sharri ma khalaq",
				translation:
					"Say: I seek refuge in the Lord of daybreak, from the evil of that which He created. (Surah Al-Falaq 3x)",
				count: 3,
			},
			{
				arabic:
					"حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم",
				transliteration:
					"HasbiyAllahu la ilaha illa huwa 'alayhi tawakkaltu wa huwa Rabbul-'arshil-'adhim",
				translation:
					"Allah is sufficient for me. There is no deity except Him. On Him I have relied, and He is the Lord of the Great Throne.",
				count: 7,
			},
		],
	},
	{
		id: "post-prayer",
		title: "Post-Prayer Adhkar (Adhkar Ba'd as-Salah)",
		items: [
			{
				arabic: "أستغفر الله",
				transliteration: "Astaghfirullah",
				translation: "I seek forgiveness from Allah.",
				count: 3,
			},
			{
				arabic: "سبحان الله",
				transliteration: "SubhanAllah",
				translation: "Glory be to Allah.",
				count: 33,
			},
			{
				arabic: "الحمد لله",
				transliteration: "Alhamdulillah",
				translation: "All praise is due to Allah.",
				count: 33,
			},
			{
				arabic: "الله أكبر",
				transliteration: "Allahu Akbar",
				translation: "Allah is the Greatest.",
				count: 33,
			},
			{
				arabic: "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير",
				transliteration:
					"La ilaha illallahu wahdahu la sharika lahu, lahul mulku wa lahul hamdu wa huwa 'ala kulli shay'in qadir",
				translation:
					"None has the right to be worshipped except Allah alone, with no partner. To Him belongs the dominion and to Him is the praise, and He is over all things capable.",
			},
			{
				arabic:
					"اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
				transliteration:
					"Allahu la ilaha illa huwal Hayyul Qayyum, la ta'khudhuhu sinatun wa la nawm, lahu ma fis-samawati wa ma fil-ard, man dhal-ladhi yashfa'u 'indahu illa bi-idhnih, ya'lamu ma bayna aydihim wa ma khalfahum, wa la yuhituna bi shay'in min 'ilmihi illa bima sha', wasi'a kursiyyuhus-samawati wal-ard, wa la ya'uduhu hifdhuhuma, wa huwal 'Aliyyul 'Adhim",
				translation:
					"Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. (Ayat al-Kursi, Al-Baqarah 2:255)",
			},
			{
				arabic: "اللهم أنت السلام ومنك السلام تباركت يا ذا الجلال والإكرام",
				transliteration:
					"Allahumma antas-Salamu wa minkas-salamu tabarakta ya dhal-jalali wal-ikram",
				translation:
					"O Allah, You are Peace and from You comes peace. Blessed are You, O Owner of majesty and honor.",
			},
			{
				arabic: "قل هو الله أحد",
				transliteration:
					"Qul huwal-lahu ahad (Surah Al-Ikhlas, Al-Falaq, An-Nas)",
				translation:
					"Recite Surah Al-Ikhlas, Al-Falaq, and An-Nas once after each prayer.",
			},
			{
				arabic:
					"اللهم إني أعوذ بك من عذاب القبر ومن عذاب النار ومن فتنة المحيا والممات ومن فتنة المسيح الدجال",
				transliteration:
					"Allahumma inni a'udhu bika min 'adhabil-qabri wa min 'adhabin-nar wa min fitnatil-mahya wal-mamati wa min fitnatil-masihid-dajjal",
				translation:
					"O Allah, I seek refuge in You from the punishment of the grave, from the punishment of the Fire, from the trials of life and death, and from the trial of the false messiah.",
			},
		],
	},
	{
		id: "before-sleep",
		title: "Before Sleep Adhkar (Adhkar Qablun-Nawm)",
		items: [
			{
				arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...",
				transliteration: "Ayat al-Kursi (Al-Baqarah 2:255)",
				translation:
					"Recite Ayat al-Kursi before sleeping. Whoever recites it will have a guardian from Allah.",
			},
			{
				arabic:
					"آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ",
				transliteration:
					"Last two verses of Surah Al-Baqarah (2:285-286)",
				translation:
					"Whoever recites the last two verses of Surah Al-Baqarah at night, they will suffice him.",
			},
			{
				arabic: "قل هو الله أحد",
				transliteration:
					"Surah Al-Ikhlas, Al-Falaq, An-Nas (3x each)",
				translation:
					"Recite the three Quls three times each, cup your hands, blow into them, and wipe over your body.",
				count: 3,
			},
			{
				arabic: "باسمك اللهم أموت وأحيا",
				transliteration: "Bismika Allahumma amutu wa ahya",
				translation: "In Your name, O Allah, I die and I live.",
			},
			{
				arabic:
					"اللهم باسمك أموت وأحيا، اللهم قني عذابك يوم تبعث عبادك",
				transliteration:
					"Allahumma bismika amutu wa ahya, Allahumma qini 'adhabaka yawma tab'athu 'ibadak",
				translation:
					"O Allah, in Your name I die and live. O Allah, protect me from Your punishment the Day You resurrect Your servants.",
			},
			{
				arabic: "سبحان الله، الحمد لله، الله أكبر",
				transliteration:
					"SubhanAllah 33x, Alhamdulillah 33x, Allahu Akbar 34x",
				translation:
					"Glorify Allah 33 times, praise Him 33 times, and declare His greatness 34 times before sleeping.",
			},
		],
	},
	{
		id: "waking-up",
		title: "Waking Up Adhkar (Adhkar al-Istiqadh)",
		items: [
			{
				arabic:
					"الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور",
				transliteration:
					"Alhamdulillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur",
				translation:
					"Praise be to Allah who gave us life after death, and to Him is the resurrection.",
			},
			{
				arabic:
					"لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير",
				transliteration:
					"La ilaha illallahu wahdahu la sharika lahu, lahul-mulku wa lahul-hamdu wa huwa 'ala kulli shay'in qadir",
				translation:
					"There is no deity except Allah alone, with no partner. To Him belongs dominion and praise, and He is over all things capable.",
			},
			{
				arabic:
					"سبحان الله والحمد لله ولا إله إلا الله والله أكبر",
				transliteration:
					"SubhanAllahi walhamdulillahi wa la ilaha illallahu wallahu akbar",
				translation:
					"Glory be to Allah, praise be to Allah, there is no god but Allah, and Allah is the Greatest.",
			},
			{
				arabic: "اللهم اغفر لي",
				transliteration: "Allahummagh-fir li",
				translation:
					"O Allah, forgive me. (The Prophet said: Whoever wakes up and says this, his supplication will be answered.)",
			},
		],
	},
];
