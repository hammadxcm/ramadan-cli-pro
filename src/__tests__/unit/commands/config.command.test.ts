import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ConfigCommand } from "../../../commands/config.command.js";
import { ConfigRepository } from "../../../repositories/config.repository.js";

describe("ConfigCommand", () => {
	let tempDir: string;
	let configRepo: ConfigRepository;
	let command: ConfigCommand;
	let logSpy: ReturnType<typeof vi.spyOn>;
	let errorSpy: ReturnType<typeof vi.spyOn>;
	let exitSpy: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		tempDir = mkdtempSync(join(tmpdir(), "config-cmd-test-"));
		configRepo = new ConfigRepository({
			projectName: "ramadan-cli-pro-config-cmd-test",
			cwd: tempDir,
		});
		command = new ConfigCommand(configRepo);

		logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
		errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		exitSpy = vi.spyOn(process, "exit").mockImplementation(((code?: number) => {
			throw new Error(`process.exit(${code})`);
		}) as never) as unknown as ReturnType<typeof vi.fn>;
	});

	afterEach(() => {
		configRepo.clearAll();
		vi.restoreAllMocks();
	});

	describe("clear", () => {
		it("should call clearAll and print confirmation", async () => {
			configRepo.setStoredLocation({ city: "Lahore", country: "Pakistan" });

			await command.execute({ clear: true });

			expect(logSpy).toHaveBeenCalledTimes(1);
			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("Configuration cleared");

			const location = configRepo.getStoredLocation();
			expect(location.city).toBeUndefined();
			expect(location.country).toBeUndefined();
		});
	});

	describe("show", () => {
		it("should print current config summary", async () => {
			configRepo.setStoredLocation({
				city: "Karachi",
				country: "Pakistan",
				latitude: 24.86,
				longitude: 67.0,
			});
			configRepo.setStoredMethod(3);
			configRepo.setStoredSchool(1);
			configRepo.setStoredTimezone("Asia/Karachi");

			await command.execute({ show: true });

			expect(logSpy).toHaveBeenCalled();
			const allOutput = logSpy.mock.calls.map((c) => c[0] as string).join("\n");
			expect(allOutput).toContain("Current configuration");
			expect(allOutput).toContain("Karachi");
			expect(allOutput).toContain("Pakistan");
			expect(allOutput).toContain("24.86");
			expect(allOutput).toContain("67");
			expect(allOutput).toContain("Method: 3");
			expect(allOutput).toContain("School: 1");
			expect(allOutput).toContain("Asia/Karachi");
		});
	});

	describe("update city", () => {
		it("should save city to config", async () => {
			await command.execute({ city: "Islamabad" });

			expect(logSpy).toHaveBeenCalled();
			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("Configuration updated");

			const location = configRepo.getStoredLocation();
			expect(location.city).toBe("Islamabad");
		});
	});

	describe("update city + country", () => {
		it("should save both city and country", async () => {
			await command.execute({ city: "Dubai", country: "UAE" });

			const location = configRepo.getStoredLocation();
			expect(location.city).toBe("Dubai");
			expect(location.country).toBe("UAE");

			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("Configuration updated");
		});
	});

	describe("update method", () => {
		it("should validate and save method number", async () => {
			await command.execute({ method: "5" });

			const settings = configRepo.getStoredPrayerSettings();
			expect(settings.method).toBe(5);

			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("Configuration updated");
		});
	});

	describe("update school", () => {
		it("should validate and save school number", async () => {
			await command.execute({ school: "1" });

			const settings = configRepo.getStoredPrayerSettings();
			expect(settings.school).toBe(1);

			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("Configuration updated");
		});
	});

	describe("update timezone", () => {
		it("should save timezone", async () => {
			await command.execute({ timezone: "America/New_York" });

			const settings = configRepo.getStoredPrayerSettings();
			expect(settings.timezone).toBe("America/New_York");

			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("Configuration updated");
		});
	});

	describe("update latitude + longitude", () => {
		it("should save coordinates", async () => {
			await command.execute({ latitude: "40.7128", longitude: "-74.006" });

			const location = configRepo.getStoredLocation();
			expect(location.latitude).toBeCloseTo(40.7128);
			expect(location.longitude).toBeCloseTo(-74.006);

			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("Configuration updated");
		});
	});

	describe("export", () => {
		it("should output valid JSON to console.log", async () => {
			configRepo.setStoredLocation({
				city: "London",
				country: "UK",
				latitude: 51.5,
				longitude: -0.12,
			});
			configRepo.setStoredMethod(3);
			configRepo.setStoredSchool(0);
			configRepo.setStoredTimezone("Europe/London");

			await command.execute({ export: true });

			expect(logSpy).toHaveBeenCalledTimes(1);
			const output = logSpy.mock.calls[0]?.[0] as string;
			const parsed = JSON.parse(output);
			expect(parsed.city).toBe("London");
			expect(parsed.country).toBe("UK");
			expect(parsed.latitude).toBe(51.5);
			expect(parsed.longitude).toBe(-0.12);
			expect(parsed.method).toBe(3);
			expect(parsed.school).toBe(0);
			expect(parsed.timezone).toBe("Europe/London");
		});
	});

	describe("no flags", () => {
		it("should show a no-updates message when no flags are provided", async () => {
			await command.execute({});

			expect(logSpy).toHaveBeenCalledTimes(1);
			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("No config updates provided");
		});
	});

	describe("multiple updates at once", () => {
		it("should save city, method, and school together", async () => {
			await command.execute({ city: "Istanbul", method: "12", school: "1" });

			const location = configRepo.getStoredLocation();
			expect(location.city).toBe("Istanbul");

			const settings = configRepo.getStoredPrayerSettings();
			expect(settings.method).toBe(12);
			expect(settings.school).toBe(1);

			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("Configuration updated");
		});
	});

	describe("import", () => {
		it("should read file, validate, and apply config", async () => {
			const importData = {
				city: "Cairo",
				country: "Egypt",
				latitude: 30.04,
				longitude: 31.24,
				method: 5,
				school: 0,
				timezone: "Africa/Cairo",
			};
			const filePath = join(tempDir, "import-config.json");
			writeFileSync(filePath, JSON.stringify(importData), "utf-8");

			await command.execute({ import: filePath });

			expect(logSpy).toHaveBeenCalled();
			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("Configuration imported successfully");

			const location = configRepo.getStoredLocation();
			expect(location.city).toBe("Cairo");
			expect(location.country).toBe("Egypt");
			expect(location.latitude).toBe(30.04);
			expect(location.longitude).toBe(31.24);

			const settings = configRepo.getStoredPrayerSettings();
			expect(settings.method).toBe(5);
			expect(settings.school).toBe(0);
			expect(settings.timezone).toBe("Africa/Cairo");
		});

		it("should error on non-existent file", async () => {
			await expect(command.execute({ import: "/nonexistent/path.json" })).rejects.toThrow(
				"process.exit(1)",
			);

			expect(errorSpy).toHaveBeenCalled();
			const errorOutput = errorSpy.mock.calls[0]?.[0] as string;
			expect(errorOutput).toContain("Could not read file");
			expect(exitSpy).toHaveBeenCalledWith(1);
		});

		it("should error on invalid JSON", async () => {
			const filePath = join(tempDir, "bad.json");
			writeFileSync(filePath, "not json at all{{{", "utf-8");

			await expect(command.execute({ import: filePath })).rejects.toThrow("process.exit(1)");

			expect(errorSpy).toHaveBeenCalled();
			const errorOutput = errorSpy.mock.calls[0]?.[0] as string;
			expect(errorOutput).toContain("Invalid JSON");
			expect(exitSpy).toHaveBeenCalledWith(1);
		});

		it("should error on invalid config schema", async () => {
			const filePath = join(tempDir, "bad-schema.json");
			writeFileSync(filePath, JSON.stringify({ method: "not-a-number" }), "utf-8");

			await expect(command.execute({ import: filePath })).rejects.toThrow("process.exit(1)");

			expect(errorSpy).toHaveBeenCalled();
			const errorOutput = errorSpy.mock.calls[0]?.[0] as string;
			expect(errorOutput).toContain("Invalid config format");
			expect(exitSpy).toHaveBeenCalledWith(1);
		});
	});
});
