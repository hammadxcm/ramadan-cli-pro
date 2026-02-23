# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2026-02-23

### Added

- **Theme System** — 6 color themes: `ramadan-green` (default), `classic-gold`, `ocean-blue`, `royal-purple`, `minimal-mono`, `high-contrast`. Switch via `--theme <name>` flag or persist with `ramadan config --theme`.
- **Quran Verse of the Day** — `ramadan quran` displays one of 30 curated Quran verses with Arabic text, transliteration, English translation, and surah/ayah reference. Supports `-d, --day <number>`.
- **Hadith of the Day** — `ramadan hadith` displays one of 30 curated hadiths with Arabic text, transliteration, English translation, source, and narrator. Supports `-d, --day <number>`.
- **Adhkar/Dhikr Collections** — `ramadan adhkar <collection>` displays morning, evening, or post-prayer adhkar with Arabic text, transliteration, and translation.
- **Taraweeh Tracking** — `ramadan track taraweeh` now supports tracking Taraweeh prayer alongside the 5 daily prayers.
- **Fasting Streak Tracker** — `ramadan track --fasted` marks the day as fasted with persistent streak tracking showing current and longest streaks.
- **Streak Vacation Mode** — `ramadan track --vacation` marks a day as vacation (travel/illness). Vacation days don't break streaks but don't count toward them.
- **Badge/Achievement System** — 12 badges earned automatically based on prayer streaks, fasting consistency, charity, and goal progress. Displayed in `ramadan stats`.
- **Ramadan Goals** — `ramadan goal add|update|list|delete` for setting and tracking personal Ramadan goals with progress bars.
- **Statistics Summary** — `ramadan stats` shows prayer completion rate, fasting streak, goal progress, and earned badges in a consolidated view.
- **Zakat Calculator** — `ramadan zakat` calculates Zakat based on wealth inputs (cash, gold, silver, investments, property, debts) with nisab thresholds.
- **Charity/Sadaqah Tracker** — `ramadan charity add|list|summary` for logging donations with amounts, descriptions, and categories.
- **Multi-format Export** — `ramadan export --format <ical|csv|json>` exports prayer times to iCalendar (.ics), CSV, or JSON format. Supports `--output <file>` for custom paths.
- **City Comparison** — `ramadan compare <city1> <city2> [city3] [city4]` shows prayer times for 2-4 cities side by side.
- **Terminal Widget** — `ramadan widget [city]` launches a compact 3-line auto-refreshing display for status bars.
- **Offline Cache Build** — `ramadan cache --build [--city <city>] [--days <n>]` prefetches prayer times for offline use. `ramadan cache --clear` purges the cache.
- **Hijri Event Calendar** — Special Ramadan nights (Laylat al-Qadr, last 10 nights, odd nights) are annotated. `HijriEventService` provides upcoming event lookups.
- **23 New City Aliases** — 82 total aliases: Americas (phi, bos, mia, atl, van, mtl), South Asia (pew, fsd, rwp, ktm), Europe (mdr, rom, mun, vie, cop), East Asia (bkk, hcm, tok, pek, seo), Africa (acc, kmp, dkr).
- **4 New Languages** — Spanish (`es`), German (`de`), Hindi (`hi`), and Persian/Farsi (`fa`), bringing total to 12 languages.
- **NO_COLOR Support** — Respects the `NO_COLOR` environment variable for accessible plain-text output.
- **TUI Theme Integration** — Dashboard components now use dynamic theme colors via React context instead of hardcoded values.
- **TUI Content Cards** — Dashboard shows Dua of the Day and Quran Verse of the Day cards during Ramadan.
- **1207 Tests** — Up from 849, covering all new commands, services, data files, and utilities at 99.48% statement coverage.

### Fixed

- **typedFetch timeout leak** — `clearTimeout` is now in a `finally` block so the timeout timer is always cleaned up, even if `fetch()` throws.
- **fetchAndParse missing HTTP status check** — `PrayerApiRepository.fetchAndParse` now checks `response.ok` and throws `ApiError` with HTTP status instead of producing cryptic JSON parse errors on 404/500.
- **Widget SIGINT handler leak** — Changed `process.on("SIGINT", ...)` to `process.once("SIGINT", ...)` to prevent handler accumulation on repeated `execute()` calls.
- **Notification setTimeout cleanup** — Scheduled reminder timeouts are now tracked in an array with a `cancelAll()` method for proper cleanup.
- **Notification silent catch** — `catch {}` blocks now log a `console.debug` warning on first failure instead of silently swallowing notification errors.

### Changed

- **Centralized Error Handling** — Replaced 32 instances of `process.exit(1)` across 15 command files with `throw new CommandError(...)`. A single top-level handler in `cli.ts` catches errors and exits.
- **CommandFactory Pure Registry** — Removed all constructor parameters. All 19 commands are registered via `register()` and accessed via `get()`. New commands no longer require modifying the factory class.
- **Dynamic Shell Completions** — `CompletionCommand` now generates command lists dynamically from `CommandFactory.list()` instead of a hardcoded array. Includes all v1.3.0 commands and locales.
- **TrackCommand DI Cleanup** — Replaced `setStreakService()` setter with proper constructor injection.
- **i18n All Hardcoded Strings** — 80+ new i18n keys across 12 namespaces (track, goal, stats, charity, zakat, compare, widget, export, config, notify, reset, profile). All 12 command files now accept `I18nService` for full localization.
- **Service-level Input Validation** — `GoalService`, `CharityService`, `ZakatService`, and `StreakService` now validate inputs (non-empty strings, positive numbers, date formats) and throw descriptive errors.
- **DRY Cleanup** — Extracted shared utilities:
  - `src/utils/error.ts` — shared `getErrorMessage()` (was duplicated in 2 files)
  - `src/utils/store.ts` — shared `createConfStore()` factory (was duplicated in 3 files)
  - `src/formatters/formatter.utils.ts` — shared formatter helpers (title generation, column padding, status labels)
- **Config Schema** — Added `theme` field to the Zod config schema and `RamadanConfigStore` type.
- **Container** — Wired 19 commands, `BadgeService`, `HijriEventService`, and all new services into the DI container.

## [1.2.0] - 2026-02-22

### Added

- **Qibla Direction Command** — `ramadan qibla [city]` shows the direction to Makkah with an ASCII compass and bearing in degrees. Uses the Aladhan Qibla API with the existing `fetchQibla` method.
- **Dua of the Day Command** — `ramadan dua` displays one of 30 daily Ramadan duas with Arabic text, transliteration, and English translation. Supports `-d, --day <number>` for a specific day.
- **Prayer Tracking Command** — `ramadan track <prayer>` marks daily prayers (fajr, dhuhr, asr, maghrib, isha) as complete with persistent storage. Includes `--show` for status and `--date` for specific dates.
- **Location Profiles** — `ramadan profile add|use|list|delete <name>` for managing multiple named location configurations with quick switching.
- **Shell Completions** — `ramadan completion bash|zsh|fish` generates tab-completion scripts covering all subcommands, city aliases, flags, locales, and prayer names.
- **Config Export/Import** — `ramadan config --export` serializes config to JSON stdout; `ramadan config --import <file>` imports and validates a JSON config file with Zod schema validation.
- **44 New City Aliases** — Expanded from 15 to 59 aliases across 9 regions:
  - South Asia: `mum` (Mumbai), `del` (Delhi), `dhk` (Dhaka), `cmb` (Colombo), `hyd` (Hyderabad)
  - Middle East: `ruh` (Riyadh), `mak`/`makkah`/`mecca` (Makkah), `mad`/`madinah`/`medina` (Madinah), `doh` (Doha), `kwt` (Kuwait City), `mus` (Muscat), `amm` (Amman), `bgd` (Baghdad), `bei` (Beirut), `dam` (Damascus)
  - North Africa: `tun` (Tunis), `alg` (Algiers), `cas` (Casablanca), `rab` (Rabat), `tri` (Tripoli)
  - Sub-Saharan Africa: `lag` (Lagos), `abj` (Abuja), `nbo` (Nairobi), `dar` (Dar es Salaam), `mgq` (Mogadishu)
  - Europe: `par` (Paris), `ber` (Berlin), `ams` (Amsterdam), `bru` (Brussels), `osl` (Oslo), `sto` (Stockholm)
  - Central Asia: `tsh` (Tashkent), `ala` (Almaty), `bak` (Baku)
  - Americas: `tor` (Toronto), `hou` (Houston), `det` (Detroit)
  - Oceania: `syd` (Sydney), `mel` (Melbourne)
  - SE Asia: `sg` (Singapore)
- **3 New Languages** — Bengali (`bn`), French (`fr`), and Indonesian (`id`) locale support, bringing total to 8 languages.
- **Complete Translations** — Added missing translation keys (`highlight`, `footer`, `setup`, `error`, `mode`) to Arabic, Urdu, Turkish, and Malay locales.
- **Update Notifier** — Automatic notification when a new CLI version is available on npm via `update-notifier`.
- **3 New CLI Aliases** — Run the CLI as `ramadan`, `ramzan`, or `roza` in addition to `ramadan-cli-pro` and `ramadan-pro`.
- **Ramadan Progress Bar** — TUI dashboard now shows day X of 30 Ramadan progress.
- **Qibla Formatter** — ASCII compass visualization with highlighted Qibla direction and bearing degrees.
- **Comprehensive Test Suite** — 849 tests covering commands, services, repositories, providers, formatters, schemas, utilities, and integration. Coverage at ~98%.

### Fixed

- **i18n Locale Registration** — All 8 locale resource bundles are now properly registered with i18next. Previously, only English was loaded; non-English locales (`--locale ar`, `--locale ur`, etc.) silently fell back to English.
- **Dua Flag Collision** — Changed dua command flag from `-n, --number` to `-d, --day` to avoid collision with the root command's `-n, --number` flag.
- **Makkah/Madinah Geocoding** — City aliases for Makkah and Madinah now resolve correctly. Previously, `mak` mapped to "Mecca" which the geocoding API couldn't find. Now maps to "Makkah, Saudi Arabia" / "Madinah, Saudi Arabia".
- **Double Country Display** — Fixed "Makkah, Saudi Arabia, Saudi Arabia" appearing in output. The `parseCityCountry` method no longer applies redundant alias normalization on already-expanded city names.
- **Qibla Coordinates for City+Country** — The Qibla command now correctly geocodes city+country inputs to obtain coordinates before fetching direction data.
- **Completion Command Bundling** — Changed from dynamic `require()` to static ESM import so the completion command works correctly in the bundled output.
- **TUI useHighlight Hook** — Memoized highlight service instantiation with `useMemo` to prevent unnecessary re-creation on every render.
- **TUI usePrayerTimes Hook** — Wrapped `fetchFn` with `useCallback` to prevent infinite re-render loops.
- **Non-null Assertions** — Replaced all `!` non-null assertions with optional chaining (`?.`) and nullish coalescing (`??`) across test files for safer code.

### Changed

- **Prayer API Repository** — Extracted option interfaces (`FetchByCityOptions`, `FetchByAddressOptions`, etc.) to `src/types/prayer-api-options.ts` for cleaner separation of types and implementation.
- **Command Factory** — Updated to register all new commands (qibla, dua, track, profile, completion).
- **DI Container** — Wired new commands and their dependencies into the container.
- **Vitest Config** — Updated coverage configuration with type-only file exclusions.
- **Biome Config** — Added `coverage` directory to ignore list.

## [1.0.0] - 2026-02-01

### Added

- Initial release with Sehar & Iftar prayer times via Aladhan API
- TUI dashboard with React/Ink (header, prayer table, countdown, progress bar, status badge)
- 15 city aliases (sf, nyc, la, dc, chi, lhr, isb, khi, dxb, jed, ist, cai, kul, jkt, lon)
- 24 calculation methods and 2 juristic schools
- 5 languages (English, Arabic, Urdu, Turkish, Malay)
- 4 output formats (table, JSON, plain, status-line)
- Desktop notifications via node-notifier
- Smart geolocation with 3 fallback geo-IP providers
- Persistent configuration via conf
- File-based caching with TTL
- Hijri calendar dates
- Custom first roza date override
- Interactive first-run setup wizard
- Zod runtime validation with branded types
- CI/CD pipeline with GitHub Actions

[1.3.0]: https://github.com/hammadxcm/ramadan-cli-pro/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/hammadxcm/ramadan-cli-pro/compare/v1.0.0...v1.2.0
[1.0.0]: https://github.com/hammadxcm/ramadan-cli-pro/releases/tag/v1.0.0
