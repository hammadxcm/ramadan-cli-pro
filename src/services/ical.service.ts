/**
 * @module services/ical
 * @description Generates iCalendar (.ics), CSV, and JSON exports from prayer time events.
 */

export interface IcalEvent {
	readonly title: string;
	readonly date: string;
	readonly time: string;
	readonly duration: number;
}

export class IcalService {
	generateIcal(events: ReadonlyArray<IcalEvent>): string {
		const lines: Array<string> = [
			"BEGIN:VCALENDAR",
			"VERSION:2.0",
			"PRODID:-//Ramadan CLI Pro//EN",
			"CALSCALE:GREGORIAN",
		];

		for (const event of events) {
			const dtstart = this.formatDateTime(event.date, event.time);
			lines.push("BEGIN:VEVENT");
			lines.push(`SUMMARY:${event.title}`);
			lines.push(`DTSTART:${dtstart}`);
			lines.push(`DURATION:PT${event.duration}M`);
			lines.push(`DESCRIPTION:${event.title} - Ramadan CLI Pro`);
			lines.push(`UID:${Date.now()}-${Math.random().toString(36).slice(2)}@ramadan-cli-pro`);
			lines.push("END:VEVENT");
		}

		lines.push("END:VCALENDAR");
		return lines.join("\r\n");
	}

	/**
	 * Generates a CSV string from an array of events.
	 *
	 * @param events - Events to export.
	 * @returns A CSV string with a header row and one data row per event.
	 */
	generateCsv(events: ReadonlyArray<IcalEvent>): string {
		const header = "Title,Date,Time,Duration";
		const rows = events.map((e) => `"${e.title}","${e.date}","${e.time}",${e.duration}`);
		return [header, ...rows].join("\n");
	}

	/**
	 * Generates a pretty-printed JSON string from an array of events.
	 *
	 * @param events - Events to export.
	 * @returns A JSON string with 2-space indentation.
	 */
	generateJson(events: ReadonlyArray<IcalEvent>): string {
		return JSON.stringify(events, null, 2);
	}

	private formatDateTime(date: string, time: string): string {
		// date is DD-MM-YYYY, time is HH:MM
		const [day, month, year] = date.split("-");
		const [hour, minute] = time.split(":");
		return `${year}${month?.padStart(2, "0")}${day?.padStart(2, "0")}T${hour?.padStart(2, "0")}${minute?.padStart(2, "0")}00`;
	}
}
