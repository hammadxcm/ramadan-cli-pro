import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("logger", () => {
	let debugSpy: ReturnType<typeof vi.spyOn>;
	let infoSpy: ReturnType<typeof vi.spyOn>;
	let warnSpy: ReturnType<typeof vi.spyOn>;
	let errorSpy: ReturnType<typeof vi.spyOn>;

	beforeEach(() => {
		debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
		infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
		warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
		errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		vi.resetModules();
	});

	afterEach(() => {
		debugSpy.mockRestore();
		infoSpy.mockRestore();
		warnSpy.mockRestore();
		errorSpy.mockRestore();
		vi.unstubAllEnvs();
	});

	async function loadLogger() {
		const mod = await import("../../../utils/logger.js");
		return mod.logger;
	}

	describe("default level (warn)", () => {
		it("logs warn messages", async () => {
			vi.stubEnv("LOG_LEVEL", "");
			const logger = await loadLogger();
			logger.warn("test warn");
			expect(warnSpy).toHaveBeenCalled();
		});

		it("logs error messages", async () => {
			vi.stubEnv("LOG_LEVEL", "");
			const logger = await loadLogger();
			logger.error("test error");
			expect(errorSpy).toHaveBeenCalled();
		});

		it("does not log debug messages", async () => {
			vi.stubEnv("LOG_LEVEL", "");
			const logger = await loadLogger();
			logger.debug("test debug");
			expect(debugSpy).not.toHaveBeenCalled();
		});

		it("does not log info messages", async () => {
			vi.stubEnv("LOG_LEVEL", "");
			const logger = await loadLogger();
			logger.info("test info");
			expect(infoSpy).not.toHaveBeenCalled();
		});
	});

	describe("LOG_LEVEL=debug", () => {
		it("logs all levels", async () => {
			vi.stubEnv("LOG_LEVEL", "debug");
			const logger = await loadLogger();

			logger.debug("d");
			logger.info("i");
			logger.warn("w");
			logger.error("e");

			expect(debugSpy).toHaveBeenCalled();
			expect(infoSpy).toHaveBeenCalled();
			expect(warnSpy).toHaveBeenCalled();
			expect(errorSpy).toHaveBeenCalled();
		});
	});

	describe("LOG_LEVEL=error", () => {
		it("only logs error messages", async () => {
			vi.stubEnv("LOG_LEVEL", "error");
			const logger = await loadLogger();

			logger.debug("d");
			logger.info("i");
			logger.warn("w");
			logger.error("e");

			expect(debugSpy).not.toHaveBeenCalled();
			expect(infoSpy).not.toHaveBeenCalled();
			expect(warnSpy).not.toHaveBeenCalled();
			expect(errorSpy).toHaveBeenCalled();
		});
	});

	describe("LOG_LEVEL=info", () => {
		it("logs info, warn, and error but not debug", async () => {
			vi.stubEnv("LOG_LEVEL", "info");
			const logger = await loadLogger();

			logger.debug("d");
			logger.info("i");
			logger.warn("w");
			logger.error("e");

			expect(debugSpy).not.toHaveBeenCalled();
			expect(infoSpy).toHaveBeenCalled();
			expect(warnSpy).toHaveBeenCalled();
			expect(errorSpy).toHaveBeenCalled();
		});
	});

	describe("message prefixes", () => {
		it("prepends [DEBUG] to debug messages", async () => {
			vi.stubEnv("LOG_LEVEL", "debug");
			const logger = await loadLogger();
			logger.debug("hello");
			expect(debugSpy).toHaveBeenCalledWith("[DEBUG] hello", "");
		});

		it("prepends [INFO] to info messages", async () => {
			vi.stubEnv("LOG_LEVEL", "debug");
			const logger = await loadLogger();
			logger.info("hello");
			expect(infoSpy).toHaveBeenCalledWith("[INFO] hello", "");
		});

		it("prepends [WARN] to warn messages", async () => {
			vi.stubEnv("LOG_LEVEL", "debug");
			const logger = await loadLogger();
			logger.warn("hello");
			expect(warnSpy).toHaveBeenCalledWith("[WARN] hello", "");
		});

		it("prepends [ERROR] to error messages", async () => {
			vi.stubEnv("LOG_LEVEL", "debug");
			const logger = await loadLogger();
			logger.error("hello");
			expect(errorSpy).toHaveBeenCalledWith("[ERROR] hello", "");
		});
	});

	describe("data parameter", () => {
		it("passes data as second argument when provided", async () => {
			vi.stubEnv("LOG_LEVEL", "debug");
			const logger = await loadLogger();
			const data = { city: "Karachi" };

			logger.debug("test", data);
			expect(debugSpy).toHaveBeenCalledWith("[DEBUG] test", data);
		});

		it("passes empty string when data is not provided", async () => {
			vi.stubEnv("LOG_LEVEL", "debug");
			const logger = await loadLogger();

			logger.info("test");
			expect(infoSpy).toHaveBeenCalledWith("[INFO] test", "");
		});
	});
});
