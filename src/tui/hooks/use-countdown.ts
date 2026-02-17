/**
 * @module tui/hooks/use-countdown
 * @description React hook that computes a live countdown string to a target
 * time-of-day (in minutes since midnight) for a given timezone.
 */

import { useEffect, useState } from "react";

/**
 * Computes a live countdown to a target time, refreshing every 60 seconds.
 *
 * @param targetMinutes - Minutes since midnight of the target event, or `null`.
 * @param timezone - IANA timezone identifier, or `null`.
 * @returns A formatted countdown string (e.g. `"2h 15m"`), or `null`.
 */
export const useCountdown = (targetMinutes: number | null, timezone: string | null) => {
	const [countdown, setCountdown] = useState<string | null>(null);

	useEffect(() => {
		if (targetMinutes === null || timezone === null) return;

		const update = () => {
			try {
				const formatter = new Intl.DateTimeFormat("en-GB", {
					timeZone: timezone,
					hour: "2-digit",
					minute: "2-digit",
					hour12: false,
				});
				const parts = formatter.formatToParts(new Date());
				const hour = Number.parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10);
				const minute = Number.parseInt(parts.find((p) => p.type === "minute")?.value ?? "0", 10);
				const nowMinutes = hour * 60 + minute;
				let diff = targetMinutes - nowMinutes;
				if (diff < 0) diff += 24 * 60;

				const h = Math.floor(diff / 60);
				const m = diff % 60;
				setCountdown(h > 0 ? `${h}h ${m}m` : `${m}m`);
			} catch {
				setCountdown(null);
			}
		};

		update();
		const interval = setInterval(update, 60_000);
		return () => clearInterval(interval);
	}, [targetMinutes, timezone]);

	return countdown;
};
