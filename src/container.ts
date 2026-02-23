/**
 * @module container
 * @description Dependency injection container that wires together all
 * repositories, providers, services, formatters, and commands.
 */

import { AdhkarCommand } from "./commands/adhkar.command.js";
import { CacheCommand } from "./commands/cache.command.js";
import { CharityCommand } from "./commands/charity.command.js";
import { CommandFactory } from "./commands/command.factory.js";
import { CompareCommand } from "./commands/compare.command.js";
import { ConfigCommand } from "./commands/config.command.js";
import { DashboardCommand } from "./commands/dashboard.command.js";
import { DuaCommand } from "./commands/dua.command.js";
import { ExportCommand } from "./commands/export.command.js";
import { GoalCommand } from "./commands/goal.command.js";
import { HadithCommand } from "./commands/hadith.command.js";
import { NotifyCommand } from "./commands/notify.command.js";
import { QiblaCommand } from "./commands/qibla.command.js";
import { QuranCommand } from "./commands/quran.command.js";
import { RamadanCommand } from "./commands/ramadan.command.js";
import { ResetCommand } from "./commands/reset.command.js";
import { StatsCommand } from "./commands/stats.command.js";
import { TrackCommand } from "./commands/track.command.js";
import { WidgetCommand } from "./commands/widget.command.js";
import { ZakatCommand } from "./commands/zakat.command.js";
import { FormatterFactory } from "./formatters/formatter.factory.js";
import { GeoProviderFactory } from "./providers/geo/geo-provider.factory.js";
import { IpApiProvider } from "./providers/geo/ip-api.provider.js";
import { IpWhoisProvider } from "./providers/geo/ip-whois.provider.js";
import { IpapiCoProvider } from "./providers/geo/ipapi-co.provider.js";
import { OpenMeteoProvider } from "./providers/geocoding/open-meteo.provider.js";
import { CacheRepository } from "./repositories/cache.repository.js";
import { ConfigRepository } from "./repositories/config.repository.js";
import { PrayerApiRepository } from "./repositories/prayer-api.repository.js";
import { BadgeService } from "./services/badge.service.js";
import { CacheService } from "./services/cache.service.js";
import { CharityService } from "./services/charity.service.js";
import { DateService } from "./services/date.service.js";
import { GoalService } from "./services/goal.service.js";
import { HighlightService } from "./services/highlight.service.js";
import { HijriEventService } from "./services/hijri-event.service.js";
import { I18nService } from "./services/i18n.service.js";
import { IcalService } from "./services/ical.service.js";
import { LocationService } from "./services/location.service.js";
import { NotificationService } from "./services/notification.service.js";
import { PrayerTimeService } from "./services/prayer-time.service.js";
import { RamadanService } from "./services/ramadan.service.js";
import { StatsService } from "./services/stats.service.js";
import { StreakService } from "./services/streak.service.js";
import { ThemeService } from "./services/theme.service.js";
import { TimeFormatService } from "./services/time-format.service.js";
import { ZakatService } from "./services/zakat.service.js";
import { FirstRunSetup } from "./setup/first-run.setup.js";
import { ThemeRegistry } from "./themes/theme.registry.js";

/**
 * Shape of the fully-wired application container.
 */
export interface AppContainer {
	/** Persisted configuration repository. */
	configRepository: ConfigRepository;
	/** Aladhan API client. */
	prayerApiRepository: PrayerApiRepository;
	/** File-based cache repository. */
	cacheRepository: CacheRepository;
	/** IP geolocation provider chain. */
	geoProviderFactory: GeoProviderFactory;
	/** Geocoding provider (Open-Meteo). */
	geocodingProvider: OpenMeteoProvider;
	/** Cache service. */
	cacheService: CacheService;
	/** Date utility service. */
	dateService: DateService;
	/** Time formatting service. */
	timeFormatService: TimeFormatService;
	/** Internationalization service. */
	i18nService: I18nService;
	/** Location resolution service. */
	locationService: LocationService;
	/** Prayer-time fetch service. */
	prayerTimeService: PrayerTimeService;
	/** Highlight/countdown service. */
	highlightService: HighlightService;
	/** Main Ramadan orchestrator service. */
	ramadanService: RamadanService;
	/** Desktop notification service. */
	notificationService: NotificationService;
	/** Theme registry. */
	themeRegistry: ThemeRegistry;
	/** Theme management service. */
	themeService: ThemeService;
	/** Fasting streak service. */
	streakService: StreakService;
	/** Goal tracking service. */
	goalService: GoalService;
	/** Statistics aggregation service. */
	statsService: StatsService;
	/** Zakat calculation service. */
	zakatService: ZakatService;
	/** Charity tracking service. */
	charityService: CharityService;
	/** Badge/achievement evaluation service. */
	badgeService: BadgeService;
	/** Hijri event calendar service. */
	hijriEventService: HijriEventService;
	/** iCal export service. */
	icalService: IcalService;
	/** Output formatter factory. */
	formatterFactory: FormatterFactory;
	/** First-run interactive setup. */
	firstRunSetup: FirstRunSetup;
	/** CLI command factory. */
	commandFactory: CommandFactory;
}

/**
 * Creates and wires the full application dependency graph.
 *
 * @param options - Optional overrides.
 * @param options.configDir - Override the configuration directory path.
 * @returns A fully-wired {@link AppContainer}.
 *
 * @example
 * ```ts
 * const container = createContainer();
 * await container.commandFactory.ramadan.execute(context);
 * ```
 */
export function createContainer(options?: {
	configDir?: string;
}): AppContainer {
	// Repositories
	const configRepository = new ConfigRepository({
		projectName: "ramadan-cli-pro",
		cwd: options?.configDir,
	});
	const prayerApiRepository = new PrayerApiRepository();
	const cacheRepository = new CacheRepository();

	// Providers
	const geoProviderFactory = new GeoProviderFactory([
		new IpApiProvider(),
		new IpapiCoProvider(),
		new IpWhoisProvider(),
	]);
	const geocodingProvider = new OpenMeteoProvider();

	// Services (wired via constructor params)
	const cacheService = new CacheService(cacheRepository);
	const dateService = new DateService();
	const timeFormatService = new TimeFormatService();
	const i18nService = new I18nService(configRepository);
	const locationService = new LocationService(
		configRepository,
		geoProviderFactory,
		geocodingProvider,
	);
	const prayerTimeService = new PrayerTimeService(prayerApiRepository, cacheService);
	const highlightService = new HighlightService(dateService, timeFormatService);
	const ramadanService = new RamadanService(
		prayerTimeService,
		locationService,
		highlightService,
		dateService,
		timeFormatService,
	);
	const notificationService = new NotificationService(configRepository, i18nService);

	// Themes
	const themeRegistry = new ThemeRegistry();
	const themeService = new ThemeService(themeRegistry, configRepository);

	// Gamification services
	const streakService = new StreakService();
	const goalService = new GoalService();
	const statsService = new StatsService(streakService, goalService);
	const zakatService = new ZakatService();
	const charityService = new CharityService();
	const badgeService = new BadgeService(streakService, goalService, charityService);
	const hijriEventService = new HijriEventService();
	const icalService = new IcalService();

	// Formatters
	const formatterFactory = new FormatterFactory();

	// Setup
	const firstRunSetup = new FirstRunSetup(configRepository, geoProviderFactory, geocodingProvider);

	// Commands — all registered via the pure registry pattern
	const commandFactory = new CommandFactory();

	commandFactory.register(
		"ramadan",
		new RamadanCommand(
			configRepository,
			locationService,
			prayerTimeService,
			ramadanService,
			dateService,
			formatterFactory,
			firstRunSetup,
		),
	);
	commandFactory.register("config", new ConfigCommand(configRepository, i18nService));
	commandFactory.register("reset", new ResetCommand(configRepository, i18nService));
	commandFactory.register("dashboard", new DashboardCommand());
	commandFactory.register("notify", new NotifyCommand(notificationService, i18nService));
	commandFactory.register("qibla", new QiblaCommand(locationService, prayerApiRepository));
	commandFactory.register("dua", new DuaCommand());
	commandFactory.register(
		"track",
		new TrackCommand(configRepository, streakService, undefined, i18nService),
	);
	commandFactory.register("quran", new QuranCommand());
	commandFactory.register("hadith", new HadithCommand());
	commandFactory.register("adhkar", new AdhkarCommand());
	commandFactory.register("goal", new GoalCommand(goalService, i18nService));
	commandFactory.register("stats", new StatsCommand(statsService, i18nService, badgeService));
	commandFactory.register("zakat", new ZakatCommand(zakatService, i18nService));
	commandFactory.register("charity", new CharityCommand(charityService, i18nService));
	commandFactory.register("export", new ExportCommand(icalService, i18nService));
	commandFactory.register(
		"compare",
		new CompareCommand(locationService, prayerTimeService, i18nService),
	);
	commandFactory.register(
		"widget",
		new WidgetCommand(locationService, prayerTimeService, highlightService, i18nService),
	);
	commandFactory.register(
		"cache",
		new CacheCommand(cacheService, locationService, prayerTimeService),
	);

	return {
		configRepository,
		prayerApiRepository,
		cacheRepository,
		geoProviderFactory,
		geocodingProvider,
		cacheService,
		dateService,
		timeFormatService,
		i18nService,
		locationService,
		prayerTimeService,
		highlightService,
		ramadanService,
		notificationService,
		themeRegistry,
		themeService,
		streakService,
		goalService,
		statsService,
		zakatService,
		charityService,
		badgeService,
		hijriEventService,
		icalService,
		formatterFactory,
		firstRunSetup,
		commandFactory,
	};
}
