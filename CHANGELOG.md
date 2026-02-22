# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-02-22

### Added

- **Qibla Direction Command** — `ramadan qibla [city]` shows the direction to Makkah with an ASCII compass and bearing in degrees. Uses the Aladhan Qibla API with the existing `fetchQibla` method.
- **Dua of the Day Command** — `ramadan dua` displays one of 30 daily Ramadan duas with Arabic text, transliteration, and English translation. Supports `-d, --day <number>` for a specific day.
- **Prayer Tracking Command** — `ramadan track <prayer>` marks daily prayers (fajr, dhuhr, asr, maghrib, isha) as complete with persistent storage. Includes `--show` for status and `--date` for specific dates.
- **Location Profiles** — `ramadan profile add|use|list|delete <name>` for managing multiple named location configurations with quick switching.
- **Shell Completions** — `ramadan completion bash|zsh|fish` generates tab-completion scripts covering all subcommands, city aliases, flags, locales, and prayer names.
- **Config Export/Import** — `ramadan config --export` serializes config to JSON stdout; `ramadan config --import <file>` imports and validates a JSON config file with Zod schema validation.
- **38 New City Aliases** — Expanded from 15 to 53 aliases across 9 regions:
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

[1.2.0]: https://github.com/hammadxcm/ramadan-cli-pro/compare/v1.0.0...v1.2.0
[1.0.0]: https://github.com/hammadxcm/ramadan-cli-pro/releases/tag/v1.0.0
