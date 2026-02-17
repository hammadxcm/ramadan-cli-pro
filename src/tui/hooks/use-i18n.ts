/**
 * @module tui/hooks/use-i18n
 * @description React hook that initializes the i18n service and provides
 * the translation function and current locale to TUI components.
 */

import { useEffect, useState } from "react";
import { ConfigRepository } from "../../repositories/config.repository.js";
import { I18nService } from "../../services/i18n.service.js";

/**
 * Initializes i18n on mount and returns the translation function, readiness state,
 * and current locale.
 *
 * @returns An object with `t`, `ready`, and `locale`.
 */
export const useI18n = () => {
	const [ready, setReady] = useState(false);
	const [i18nService] = useState(() => {
		const config = new ConfigRepository();
		return new I18nService(config);
	});

	useEffect(() => {
		i18nService.init().then(() => setReady(true));
	}, []);

	return {
		t: i18nService.t.bind(i18nService),
		ready,
		locale: i18nService.getLocale(),
	};
};
