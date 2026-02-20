import type { CityCountryGuess, GeoLocation } from "../../types/geo.js";
import type { PrayerData } from "../../types/prayer.js";

export const samplePrayerData: PrayerData = {
	timings: {
		Fajr: "05:15 (PKT)",
		Sunrise: "06:35",
		Dhuhr: "12:15",
		Asr: "15:45",
		Sunset: "17:55",
		Maghrib: "17:55 (PKT)",
		Isha: "19:15",
		Imsak: "05:05",
		Midnight: "23:55",
		Firstthird: "21:55",
		Lastthird: "01:55",
	},
	date: {
		readable: "01 Mar 2026",
		timestamp: "1740787200",
		hijri: {
			date: "01-09-1447",
			day: "1",
			month: {
				number: 9,
				en: "Ramadan",
				ar: "\u0631\u0645\u0636\u0627\u0646",
			},
			year: "1447",
			weekday: {
				en: "Sunday",
				ar: "\u0627\u0644\u0623\u062D\u062F",
			},
		},
		gregorian: {
			date: "01-03-2026",
			day: "01",
			month: {
				number: 3,
				en: "March",
			},
			year: "2026",
			weekday: {
				en: "Sunday",
			},
		},
	},
	meta: {
		latitude: 31.5204,
		longitude: 74.3587,
		timezone: "Asia/Karachi",
		method: {
			id: 1,
			name: "University of Islamic Sciences, Karachi",
		},
		school: {
			id: 1,
			name: "Hanafi",
		},
	},
};

export const sampleGeoLocation: GeoLocation = {
	city: "Lahore",
	country: "Pakistan",
	latitude: 31.5204,
	longitude: 74.3587,
	timezone: "Asia/Karachi",
};

export const sampleCityGuess: CityCountryGuess = {
	city: "Lahore",
	country: "Pakistan",
	latitude: 31.5204,
	longitude: 74.3587,
	timezone: "Asia/Karachi",
};

export const createPrayerDataForDay = (
	dayNumber: number,
	hijriDay: string = String(dayNumber),
): PrayerData => ({
	...samplePrayerData,
	date: {
		...samplePrayerData.date,
		hijri: {
			...samplePrayerData.date.hijri,
			day: hijriDay,
		},
		gregorian: {
			...samplePrayerData.date.gregorian,
			date: `${String(dayNumber).padStart(2, "0")}-03-2026`,
		},
	},
});
