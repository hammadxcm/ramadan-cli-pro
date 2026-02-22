<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=2&height=200&section=header&text=ramadan-cli-pro&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=%F0%9F%8C%99%20Professional-grade%20Ramadan%20prayer%20times%20CLI&descSize=16&descAlignY=55" width="100%" alt="ramadan-cli-pro" />
</p>

<p align="center">
  <a href="https://git.io/typing-svg">
    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&pause=1000&color=2E7D32&center=true&vCenter=true&multiline=true&repeat=true&width=620&height=120&lines=Sehar+%E2%80%A2+Iftar+%E2%80%A2+Ramadan+Timings;TUI+Dashboard+%7C+i18n+%7C+Notifications;15+City+Aliases+%7C+24+Calc+Methods;TypeScript+%7C+React%2FInk+%7C+Zod+Validated" alt="Typing SVG" />
  </a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/ramadan-cli-pro"><img src="https://img.shields.io/npm/v/ramadan-cli-pro?style=for-the-badge&logo=npm&logoColor=white&color=CB3837" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/ramadan-cli-pro"><img src="https://img.shields.io/npm/dm/ramadan-cli-pro?style=for-the-badge&logo=npm&logoColor=white&color=CB3837" alt="npm downloads" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-2E7D32?style=for-the-badge" alt="MIT License" /></a>
  <img src="https://img.shields.io/badge/Node-%3E%3D20-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node >= 20" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <a href="#contributing"><img src="https://img.shields.io/badge/PRs-Welcome-2E7D32?style=for-the-badge" alt="PRs Welcome" /></a>
  <a href="https://github.com/hammadxcm/ramadan-cli-pro/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/hammadxcm/ramadan-cli-pro/ci.yml?style=for-the-badge&logo=github&label=CI" alt="CI" /></a>
</p>

---

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Usage](#usage)
  - [Root Command](#root-command)
  - [Config](#config)
  - [Notify](#notify)
  - [Reset](#reset)
  - [Dashboard](#dashboard)
- [Output Formats](#output-formats)
- [City Aliases](#city-aliases)
- [Configuration](#configuration)
- [Notifications](#notifications)
- [TUI Dashboard](#tui-dashboard)
- [Internationalization](#internationalization)
- [Calculation Methods](#calculation-methods)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

---

## Features

- **Prayer Times** — Sehar & Iftar times for any city worldwide via the Aladhan API
- **TUI Dashboard** — Interactive React/Ink terminal dashboard with live countdown
- **15 City Aliases** — Short codes like `sf`, `nyc`, `lhr`, `dxb` for quick lookups
- **24 Calculation Methods** — Region-specific methods including ISNA, MWL, Umm al-Qura, and more
- **2 Juristic Schools** — Shafi (standard) and Hanafi Asr calculation
- **5 Languages** — English, Arabic, Urdu, Turkish, and Malay via i18next
- **4 Output Formats** — Table, JSON, plain text, and status-line for tmux/polybar
- **Desktop Notifications** — Native OS alerts for Sehar & Iftar via node-notifier
- **Smart Geolocation** — Auto-detect location with 3 fallback geo-IP providers
- **Persistent Config** — Save city, method, school, and timezone preferences
- **File-based Caching** — Minimize API calls with intelligent TTL caching
- **Hijri Dates** — Full Hijri calendar alongside Gregorian dates
- **Custom Roza Date** — Override the first day of Ramadan manually
- **First-Run Setup** — Interactive wizard for initial configuration
- **Zod Validated** — Runtime type safety with branded types throughout

<details>
<summary><strong>TUI Dashboard Components</strong></summary>

- **Header** — Location and Hijri date display
- **PrayerTimesTable** — All 5 prayer times with Sehar/Iftar highlights
- **CountdownTimer** — Live countdown to the next prayer event
- **ProgressBar** — Visual progress through the fasting day
- **StatusBadge** — Current fasting status indicator
- **Footer** — Methodology and attribution info

</details>

---

## Quick Start

```bash
# Install globally
npm i -g ramadan-cli-pro

# Or with pnpm
pnpm add -g ramadan-cli-pro

# Or run without installing
npx ramadan-cli-pro
```

```bash
# Show today's times (auto-detects your city)
ramadan-pro

# Show times for a specific city
ramadan-pro sf
```

> **Tip:** `ramadan-pro` is a shorthand alias for `ramadan-cli-pro`.

---

## Usage

### Root Command

```
ramadan-cli-pro [city] [options]
```

| Flag | Description |
|------|-------------|
| `-c, --city <city>` | City name or alias |
| `-a, --all` | Show complete Ramadan month |
| `-n, --number <n>` | Show a specific roza day (1-30) |
| `-p, --plain` | Plain text output |
| `-j, --json` | JSON output |
| `-s, --status` | Status-line output (for status bars) |
| `-t, --tui` | Launch TUI dashboard |
| `-l, --locale <locale>` | Language: `en`, `ar`, `ur`, `tr`, `ms` |
| `--first-roza-date <YYYY-MM-DD>` | Set custom first roza date |
| `--clear-first-roza-date` | Clear custom first roza date |
| `-v, --version` | Show version |

**Examples:**

```bash
# Today's Sehar & Iftar
ramadan-pro

# Full Ramadan schedule
ramadan-pro --all

# Specific roza day
ramadan-pro --number 15

# JSON output
ramadan-pro --json

# Status-line for tmux/polybar
ramadan-pro --status

# Launch TUI dashboard
ramadan-pro --tui

# Arabic locale
ramadan-pro --locale ar
```

---

### Config

```
ramadan-cli-pro config [options]
```

| Flag | Description |
|------|-------------|
| `--city <city>` | Save default city |
| `--country <country>` | Save default country |
| `--method <id>` | Calculation method (0-23) |
| `--school <id>` | Juristic school (0=Shafi, 1=Hanafi) |
| `--latitude <lat>` | Save latitude (-90 to 90) |
| `--longitude <lon>` | Save longitude (-180 to 180) |
| `--timezone <tz>` | Save timezone (e.g., `America/Los_Angeles`) |
| `--show` | Show current configuration |
| `--clear` | Clear all saved configuration |

**Examples:**

```bash
# Save city and country
ramadan-pro config --city "San Francisco" --country US

# Save calculation method and school
ramadan-pro config --method 2 --school 1

# Save exact coordinates and timezone
ramadan-pro config --latitude 37.7749 --longitude -122.4194 --timezone America/Los_Angeles

# Show current config
ramadan-pro config --show

# Clear all config
ramadan-pro config --clear
```

---

### Notify

```
ramadan-cli-pro notify [options]
```

| Flag | Description |
|------|-------------|
| `--enable` | Enable notifications |
| `--disable` | Disable notifications |
| `--sehar` | Toggle Sehar reminder |
| `--iftar` | Toggle Iftar reminder |
| `--minutes <n>` | Minutes before event (1-120) |

**Examples:**

```bash
# Enable notifications
ramadan-pro notify --enable

# Disable notifications
ramadan-pro notify --disable

# Toggle Sehar reminder
ramadan-pro notify --sehar

# Toggle Iftar reminder
ramadan-pro notify --iftar

# Set reminder to 10 minutes before
ramadan-pro notify --minutes 10

# Enable with custom timing
ramadan-pro notify --enable --minutes 30
```

---

### Reset

```bash
# Clear all saved configuration
ramadan-cli-pro reset
```

---

### Dashboard

```bash
# Launch interactive TUI dashboard
ramadan-cli-pro dashboard

# Or use the flag
ramadan-pro --tui
```

---

## Output Formats

### Table (default)

```bash
ramadan-pro
```

Displays a colored table with ASCII banner, prayer times (Roza, Sehar, Iftar, Date, Hijri), current status, and next event countdown.

### JSON

```bash
ramadan-pro --json
```

```json
{
  "output": {
    "mode": "today",
    "location": "San Francisco, US",
    "hijriYear": "1446",
    "rows": [
      {
        "roza": 1,
        "sehar": "05:42 AM",
        "iftar": "06:15 PM",
        "date": "2025-03-01",
        "hijri": "1 Ramadan 1446"
      }
    ]
  }
}
```

### Plain

```bash
ramadan-pro --plain
```

Text-only output with no colors or ASCII art — suitable for piping and scripting.

### Status-line

```bash
ramadan-pro --status
```

```
Iftar in 2h 30m
```

Single-line output designed for embedding in **tmux**, **polybar**, **i3status**, or any status bar.

---

## City Aliases

Use short codes instead of full city names:

| Alias | City |
|-------|------|
| `sf` | San Francisco |
| `nyc` | New York |
| `la` | Los Angeles |
| `dc` | Washington |
| `chi` | Chicago |
| `lhr` | Lahore |
| `isb` | Islamabad |
| `khi` | Karachi |
| `dxb` | Dubai |
| `jed` | Jeddah |
| `ist` | Istanbul |
| `cai` | Cairo |
| `kul` | Kuala Lumpur |
| `jkt` | Jakarta |
| `lon` | London |

```bash
ramadan-pro sf     # San Francisco
ramadan-pro lhr    # Lahore
ramadan-pro dxb    # Dubai
```

---

## Configuration

All settings are persisted to your OS config directory via [`conf`](https://github.com/sindresorhus/conf).

| Setting | Flag | Example |
|---------|------|---------|
| City | `--city` | `--city "San Francisco"` |
| Country | `--country` | `--country US` |
| Latitude | `--latitude` | `--latitude 37.7749` |
| Longitude | `--longitude` | `--longitude -122.4194` |
| Timezone | `--timezone` | `--timezone America/Los_Angeles` |
| Method | `--method` | `--method 2` |
| School | `--school` | `--school 1` |

**Defaults:** Method `2` (ISNA), School `0` (Shafi).

---

## Notifications

Native OS notifications powered by [`node-notifier`](https://github.com/mikaelbr/node-notifier).

| Setting | Default |
|---------|---------|
| Enabled | `false` |
| Sehar Reminder | `true` |
| Iftar Reminder | `true` |
| Minutes Before | `15` |

Notifications display system alerts like **"Sehar in 15 minutes"** or **"Iftar in 15 minutes"** before each event.

---

## TUI Dashboard

An interactive terminal dashboard built with [React](https://react.dev) and [Ink](https://github.com/vadimdemedes/ink).

- **Header** with location and Hijri date
- **Prayer Times Table** with all 5 daily prayers
- **Live Countdown** to the next Sehar or Iftar
- **Progress Bar** showing fasting day progression
- **Status Badges** for current fasting state

```bash
ramadan-pro dashboard
ramadan-pro --tui
```

---

## Internationalization

5 languages supported via [i18next](https://www.i18next.com):

| Code | Language |
|------|----------|
| `en` | English |
| `ar` | Arabic (العربية) |
| `ur` | Urdu (اردو) |
| `tr` | Turkish (Turkce) |
| `ms` | Malay (Bahasa Melayu) |

```bash
ramadan-pro --locale ur
ramadan-pro --locale ar
```

---

## Calculation Methods

<details>
<summary><strong>All 22 Calculation Methods (click to expand)</strong></summary>

| ID | Method |
|----|--------|
| 0 | Jafari (Shia Ithna-Ashari) |
| 1 | Karachi (Pakistan) |
| 2 | ISNA (North America) |
| 3 | MWL (Muslim World League) |
| 4 | Makkah (Umm al-Qura) |
| 5 | Egypt |
| 7 | Tehran (Shia) |
| 8 | Gulf Region |
| 9 | Kuwait |
| 10 | Qatar |
| 11 | Singapore |
| 12 | France |
| 13 | Turkey |
| 14 | Russia |
| 15 | Moonsighting Committee |
| 16 | Dubai |
| 17 | Malaysia (JAKIM) |
| 18 | Tunisia |
| 19 | Algeria |
| 20 | Indonesia |
| 21 | Morocco |
| 22 | Portugal |
| 23 | Jordan |

</details>

**Juristic Schools:**

| ID | School |
|----|--------|
| 0 | Shafi (standard) |
| 1 | Hanafi |

```bash
ramadan-pro config --method 4 --school 1
```

---

## Architecture

- **DI Container** — Centralized dependency injection wiring all services
- **Command Pattern** — Each CLI command implements `validate()` + `execute()`
- **Formatter Strategy** — Pluggable output formatters (Table, JSON, Plain, Status-line)
- **3 Geo-IP Providers** — Fallback chain for automatic location detection
- **File-based Caching** — TTL-based cache to minimize API calls
- **Zod Validation** — Runtime schema validation with branded types (`Latitude`, `Longitude`, `MethodId`, `SchoolId`, `RozaNumber`)
- **React/Ink TUI** — Terminal UI components with hooks (`use-prayer-times`, `use-countdown`, `use-highlight`, `use-i18n`)
- **i18next Integration** — Dynamic language switching with interpolation
- **Custom Error Hierarchy** — Typed errors with error codes for programmatic handling

---

## Tech Stack

<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=ts,nodejs,react&theme=dark" alt="Tech Stack" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logo=zod&logoColor=white" alt="Zod" />
  <img src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />
  <img src="https://img.shields.io/badge/Ink-000000?style=for-the-badge&logo=react&logoColor=white" alt="Ink" />
  <img src="https://img.shields.io/badge/i18next-26A69A?style=for-the-badge&logo=i18next&logoColor=white" alt="i18next" />
  <img src="https://img.shields.io/badge/Biome-60A5FA?style=for-the-badge&logo=biome&logoColor=white" alt="Biome" />
  <img src="https://img.shields.io/badge/Commander-FF4154?style=for-the-badge" alt="Commander" />
</p>

---

## Contributing

```bash
# Clone the repo
git clone https://github.com/HammadXCM/ramadan-cli-pro.git
cd ramadan-cli-pro

# Install dependencies
pnpm install

# Development mode (watch)
pnpm dev

# Run tests
pnpm test

# Lint & format
pnpm lint
pnpm format

# Type check
pnpm typecheck

# Full check (lint + typecheck + test + build)
pnpm check
```

PRs are welcome! Please open an issue first to discuss what you'd like to change.

---

## License

[MIT](./LICENSE) &copy; [Hammad Khan](https://x.com/hammadkhanxcm)

<p align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-2E7D32?style=for-the-badge" alt="MIT License" /></a>
</p>

---

## Author

<p align="center">
  <a href="https://x.com/hammadkhanxcm">
    <img src="https://img.shields.io/badge/Follow%20%40hammadkhanxcm-000000?style=for-the-badge&logo=x&logoColor=white" alt="Follow @hammadxcm on X" />
  </a>
</p>

---

## Credits

This project is inspired by [ramadan-cli](https://github.com/ahmadawais/ramadan-cli) by [@ahmadawais](https://github.com/ahmadawais).

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=2&height=120&section=footer" width="100%" alt="Footer" />
</p>
