/**
 * @module container
 * @description Dependency injection container that wires together all
 * repositories, providers, services, formatters, and commands.
 */

import { CommandFactory } from "./commands/command.factory.js";
import { ConfigCommand } from "./commands/config.command.js";
import { DashboardCommand } from "./commands/dashboard.command.js";
import { DuaCommand } from "./commands/dua.command.js";
import { NotifyCommand } from "./commands/notify.command.js";
import { QiblaCommand } from "./commands/qibla.command.js";
import { RamadanCommand } from "./commands/ramadan.command.js";
import { ResetCommand } from "./commands/reset.command.js";
import { TrackCommand } from "./commands/track.command.js";
import { FormatterFactory } from "./formatters/formatter.factory.js";
import { GeoProviderFactory } from "./providers/geo/geo-provider.factory.js";
import { IpApiProvider } from "./providers/geo/ip-api.provider.js";
import { IpWhoisProvider } from "./providers/geo/ip-whois.provider.js";
import { IpapiCoProvider } from "./providers/geo/ipapi-co.provider.js";
import { OpenMeteoProvider } from "./providers/geocoding/open-meteo.provider.js";
import { CacheRepository } from "./repositories/cache.repository.js";
import { ConfigRepository } from "./repositories/config.repository.js";
import { PrayerApiRepository } from "./repositories/prayer-api.repository.js";
import { CacheService } from "./services/cache.service.js";
import { DateService } from "./services/date.service.js";
import { HighlightService } from "./services/highlight.service.js";
import { I18nService } from "./services/i18n.service.js";
import { LocationService } from "./services/location.service.js";
import { NotificationService } from "./services/notification.service.js";
import { PrayerTimeService } from "./services/prayer-time.service.js";
import { RamadanService } from "./services/ramadan.service.js";
import { TimeFormatService } from "./services/time-format.service.js";
import { FirstRunSetup } from "./setup/first-run.setup.js";

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

	// Formatters
	const formatterFactory = new FormatterFactory();

	// Setup
	const firstRunSetup = new FirstRunSetup(configRepository, geoProviderFactory, geocodingProvider);

	// Commands
	const ramadanCommand = new RamadanCommand(
		configRepository,
		locationService,
		prayerTimeService,
		ramadanService,
		dateService,
		formatterFactory,
		firstRunSetup,
	);
	const configCommand = new ConfigCommand(configRepository);
	const resetCommand = new ResetCommand(configRepository);
	const dashboardCommand = new DashboardCommand();
	const notifyCommand = new NotifyCommand(notificationService);
	const qiblaCommand = new QiblaCommand(locationService, prayerApiRepository);
	const duaCommand = new DuaCommand();
	const trackCommand = new TrackCommand(configRepository);
	const commandFactory = new CommandFactory(
		ramadanCommand,
		configCommand,
		resetCommand,
		dashboardCommand,
		notifyCommand,
		qiblaCommand,
		duaCommand,
		trackCommand,
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
		formatterFactory,
		firstRunSetup,
		commandFactory,
	};
}
