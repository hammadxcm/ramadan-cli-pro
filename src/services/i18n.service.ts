/**
 * @module services/i18n
 * @description Internationalization service backed by i18next.
 * Manages locale initialization, translation lookups, and locale persistence.
 */

import i18next from "i18next";
import en from "../i18n/locales/en.json" with { type: "json" };
import type { ConfigRepository } from "../repositories/config.repository.js";

const SUPPORTED_LOCALES = ["en", "ar", "ur", "tr", "ms"] as const;

/**
 * Union of locale codes supported by the application.
 */
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Wraps i18next to provide translation lookups and locale management.
 *
 * @example
 * ```ts
 * const i18n = new I18nService(configRepo);
 * await i18n.init("ur");
 * console.log(i18n.t("notification.seharReminder"));
 * ```
 */
export class I18nService {
	private initialized = false;

	/**
	 * @param configRepository - For reading/writing the stored locale preference.
	 */
	constructor(private readonly configRepository: ConfigRepository) {}

	/**
	 * Initializes i18next with the given or stored locale.
	 * No-op if already initialized.
	 *
	 * @param locale - Override locale. Falls back to stored locale, then `"en"`.
	 */
	async init(locale?: string): Promise<void> {
		if (this.initialized) return;

		const resolvedLocale = locale ?? this.configRepository.getStoredLocale() ?? "en";

		await i18next.init({
			lng: resolvedLocale,
			fallbackLng: "en",
			resources: {
				en: { translation: en },
			},
			interpolation: {
				escapeValue: false,
			},
		});

		this.initialized = true;
	}

	/**
	 * Translates a key using the current locale.
	 *
	 * @param key - The i18n key (e.g. `"notification.seharReminder"`).
	 * @param options - Optional interpolation values.
	 * @returns The translated string.
	 */
	t(key: string, options?: Record<string, unknown>): string {
		if (options) {
			return i18next.t(key, options);
		}
		return i18next.t(key);
	}

	/**
	 * Returns the currently active locale code.
	 *
	 * @returns The locale code (e.g. `"en"`).
	 */
	getLocale(): string {
		return i18next.language ?? "en";
	}

	/**
	 * Switches to a new locale and persists the choice.
	 *
	 * @param locale - The new locale code.
	 */
	async changeLocale(locale: string): Promise<void> {
		await i18next.changeLanguage(locale);
		this.configRepository.setStoredLocale(locale);
	}

	/**
	 * Checks whether a locale code is supported.
	 *
	 * @param locale - Locale code to check.
	 * @returns `true` if the locale is in the supported set.
	 */
	isSupportedLocale(locale: string): locale is SupportedLocale {
		return (SUPPORTED_LOCALES as ReadonlyArray<string>).includes(locale);
	}
}
