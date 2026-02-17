/**
 * @module tui/hooks/use-prayer-times
 * @description React hook that fetches prayer times on mount and tracks
 * loading/error state.
 */

import { useEffect, useState } from "react";
import type { PrayerData } from "../../types/prayer.js";

interface UsePrayerTimesState {
	data: PrayerData | null;
	loading: boolean;
	error: string | null;
}

/**
 * Fetches prayer data on mount using the provided async function.
 *
 * @param fetchFn - Async function that returns prayer data.
 * @returns An object with `data`, `loading`, and `error` state.
 */
export const usePrayerTimes = (fetchFn: () => Promise<PrayerData>): UsePrayerTimesState => {
	const [state, setState] = useState<UsePrayerTimesState>({
		data: null,
		loading: true,
		error: null,
	});

	useEffect(() => {
		let cancelled = false;

		fetchFn()
			.then((data) => {
				if (!cancelled) {
					setState({ data, loading: false, error: null });
				}
			})
			.catch((err: unknown) => {
				if (!cancelled) {
					setState({
						data: null,
						loading: false,
						error: err instanceof Error ? err.message : "Unknown error",
					});
				}
			});

		return () => {
			cancelled = true;
		};
	}, []);

	return state;
};
