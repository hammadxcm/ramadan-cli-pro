/**
 * @module tui/hooks/use-highlight
 * @description React hook that computes and auto-refreshes the highlight state
 * (current phase and countdown) every 60 seconds.
 */

import { useEffect, useState } from "react";
import { DateService } from "../../services/date.service.js";
import { HighlightService } from "../../services/highlight.service.js";
import { TimeFormatService } from "../../services/time-format.service.js";
import type { PrayerData } from "../../types/prayer.js";
import type { HighlightState } from "../../types/ramadan.js";

/**
 * Computes the highlight state for a prayer day and refreshes it every minute.
 *
 * @param day - Prayer data for the current day, or `null`.
 * @returns The current highlight state, or `null`.
 */
export const useHighlight = (day: PrayerData | null): HighlightState | null => {
	const [highlight, setHighlight] = useState<HighlightState | null>(null);

	useEffect(() => {
		if (!day) return;

		const dateService = new DateService();
		const timeFormatService = new TimeFormatService();
		const highlightService = new HighlightService(dateService, timeFormatService);

		const update = () => {
			setHighlight(highlightService.getHighlightState(day));
		};

		update();
		const interval = setInterval(update, 60_000);
		return () => clearInterval(interval);
	}, [day]);

	return highlight;
};
