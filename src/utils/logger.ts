/**
 * @module utils/logger
 * @description Minimal structured logger with level filtering.
 * The log level is controlled by the `LOG_LEVEL` environment variable
 * (default: `"warn"`).
 */

type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVELS: Record<LogLevel, number> = {
	debug: 0,
	info: 1,
	warn: 2,
	error: 3,
};

const currentLevel = (): LogLevel => {
	const env = process.env.LOG_LEVEL?.toLowerCase();
	if (env && env in LOG_LEVELS) {
		return env as LogLevel;
	}
	return "warn";
};

const shouldLog = (level: LogLevel): boolean => LOG_LEVELS[level] >= LOG_LEVELS[currentLevel()];

/**
 * Application logger with `debug`, `info`, `warn`, and `error` methods.
 * Messages below the current log level are silently discarded.
 *
 * @example
 * ```ts
 * logger.info("Fetching prayer times", { city: "Karachi" });
 * logger.error("API call failed", err);
 * ```
 */
export const logger = {
	/**
	 * Logs a debug-level message.
	 * @param message - Log message.
	 * @param data - Optional structured data.
	 */
	debug: (message: string, data?: unknown): void => {
		if (shouldLog("debug")) {
			console.debug(`[DEBUG] ${message}`, data ?? "");
		}
	},
	/**
	 * Logs an info-level message.
	 * @param message - Log message.
	 * @param data - Optional structured data.
	 */
	info: (message: string, data?: unknown): void => {
		if (shouldLog("info")) {
			console.info(`[INFO] ${message}`, data ?? "");
		}
	},
	/**
	 * Logs a warn-level message.
	 * @param message - Log message.
	 * @param data - Optional structured data.
	 */
	warn: (message: string, data?: unknown): void => {
		if (shouldLog("warn")) {
			console.warn(`[WARN] ${message}`, data ?? "");
		}
	},
	/**
	 * Logs an error-level message.
	 * @param message - Log message.
	 * @param data - Optional structured data.
	 */
	error: (message: string, data?: unknown): void => {
		if (shouldLog("error")) {
			console.error(`[ERROR] ${message}`, data ?? "");
		}
	},
};
