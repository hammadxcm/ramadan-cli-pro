import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProfileCommand } from "../../../commands/profile.command.js";
import { ConfigRepository } from "../../../repositories/config.repository.js";

describe("ProfileCommand", () => {
	let command: ProfileCommand;
	let configDir: string;
	let storeDir: string;
	let configRepo: ConfigRepository;
	let logSpy: ReturnType<typeof vi.spyOn>;
	let errorSpy: ReturnType<typeof vi.spyOn>;
	let exitSpy: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		configDir = mkdtempSync(join(tmpdir(), "profile-test-"));
		storeDir = mkdtempSync(join(tmpdir(), "profile-store-"));
		configRepo = new ConfigRepository({ cwd: configDir });
		command = new ProfileCommand(configRepo, storeDir);
		logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
		errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		exitSpy = vi
			.spyOn(process, "exit")
			.mockImplementation((() => {}) as never) as unknown as ReturnType<typeof vi.fn>;
	});

	afterEach(() => {
		vi.restoreAllMocks();
		rmSync(configDir, { recursive: true, force: true });
		rmSync(storeDir, { recursive: true, force: true });
	});

	describe("list with no profiles", () => {
		it("should display a message indicating no profiles are saved", async () => {
			await command.execute({ action: "list" });

			expect(logSpy).toHaveBeenCalled();
			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("No profiles saved");
		});
	});

	describe("add profile", () => {
		it("should add a profile with name and city", async () => {
			await command.execute({
				action: "add",
				name: "home",
				city: "Karachi",
			});

			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain('Profile "home" saved');
			expect(allOutput).toContain("Karachi");
		});

		it("should add a profile with name, city, and country", async () => {
			await command.execute({
				action: "add",
				name: "work",
				city: "Dubai",
				country: "UAE",
			});

			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain('Profile "work" saved');
			expect(allOutput).toContain("Dubai");
			expect(allOutput).toContain("UAE");
		});

		it("should overwrite an existing profile with the same name", async () => {
			await command.execute({
				action: "add",
				name: "home",
				city: "Karachi",
			});
			logSpy.mockClear();

			await command.execute({
				action: "add",
				name: "home",
				city: "Lahore",
			});

			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain('Profile "home" saved');
			expect(allOutput).toContain("Lahore");
		});
	});

	describe("list after adding profiles", () => {
		it("should show added profiles in the list", async () => {
			await command.execute({
				action: "add",
				name: "home",
				city: "Karachi",
			});
			await command.execute({
				action: "add",
				name: "work",
				city: "Dubai",
				country: "UAE",
			});
			logSpy.mockClear();

			await command.execute({ action: "list" });

			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("Location Profiles");
			expect(allOutput).toContain("home");
			expect(allOutput).toContain("Karachi");
			expect(allOutput).toContain("work");
			expect(allOutput).toContain("Dubai");
			expect(allOutput).toContain("UAE");
		});
	});

	describe("use profile", () => {
		it("should switch to an existing profile", async () => {
			await command.execute({
				action: "add",
				name: "home",
				city: "Karachi",
			});
			logSpy.mockClear();

			await command.execute({ action: "use", name: "home" });

			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain('Switched to profile "home"');
			expect(allOutput).toContain("Karachi");
		});

		it("should switch to a profile with country", async () => {
			await command.execute({
				action: "add",
				name: "work",
				city: "Dubai",
				country: "UAE",
			});
			logSpy.mockClear();

			await command.execute({ action: "use", name: "work" });

			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain('Switched to profile "work"');
			expect(allOutput).toContain("Dubai");
			expect(allOutput).toContain("UAE");
		});

		it("should update the config repository when using a profile", async () => {
			const setLocationSpy = vi.spyOn(configRepo, "setStoredLocation");

			await command.execute({
				action: "add",
				name: "test",
				city: "Istanbul",
				country: "Turkey",
			});
			await command.execute({ action: "use", name: "test" });

			expect(setLocationSpy).toHaveBeenCalledWith({
				city: "Istanbul",
				country: "Turkey",
			});
		});
	});

	describe("delete profile", () => {
		it("should delete an existing profile", async () => {
			await command.execute({
				action: "add",
				name: "temp",
				city: "London",
			});
			logSpy.mockClear();

			await command.execute({ action: "delete", name: "temp" });

			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain('Profile "temp" deleted');
		});

		it("should not show deleted profile in list", async () => {
			await command.execute({
				action: "add",
				name: "temp",
				city: "London",
			});
			await command.execute({ action: "delete", name: "temp" });
			logSpy.mockClear();

			await command.execute({ action: "list" });

			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("No profiles saved");
		});
	});

	describe("use nonexistent profile", () => {
		it("should exit with error when using a nonexistent profile", async () => {
			await command.execute({ action: "use", name: "nonexistent" });

			expect(errorSpy).toHaveBeenCalled();
			const errorOutput = errorSpy.mock.calls[0]?.[0] as string;
			expect(errorOutput).toContain('Profile "nonexistent" not found');
			expect(exitSpy).toHaveBeenCalledWith(1);
		});
	});

	describe("delete nonexistent profile", () => {
		it("should exit with error when deleting a nonexistent profile", async () => {
			await command.execute({ action: "delete", name: "nonexistent" });

			expect(errorSpy).toHaveBeenCalled();
			const errorOutput = errorSpy.mock.calls[0]?.[0] as string;
			expect(errorOutput).toContain('Profile "nonexistent" not found');
			expect(exitSpy).toHaveBeenCalledWith(1);
		});
	});

	describe("add without name", () => {
		it("should exit with error when adding without a name", async () => {
			await command.execute({
				action: "add",
				city: "Karachi",
			});

			expect(errorSpy).toHaveBeenCalled();
			const errorOutput = errorSpy.mock.calls[0]?.[0] as string;
			expect(errorOutput).toContain("Profile name is required");
			expect(exitSpy).toHaveBeenCalledWith(1);
		});
	});

	describe("add without city", () => {
		it("should exit with error when adding without a city", async () => {
			await command.execute({
				action: "add",
				name: "test",
			});

			expect(errorSpy).toHaveBeenCalled();
			const errorOutput = errorSpy.mock.calls[0]?.[0] as string;
			expect(errorOutput).toContain("City is required");
			expect(exitSpy).toHaveBeenCalledWith(1);
		});
	});

	describe("use without name", () => {
		it("should exit with error when using without a name", async () => {
			await command.execute({ action: "use" });

			expect(errorSpy).toHaveBeenCalled();
			const errorOutput = errorSpy.mock.calls[0]?.[0] as string;
			expect(errorOutput).toContain("Profile name is required");
			expect(exitSpy).toHaveBeenCalledWith(1);
		});
	});

	describe("delete without name", () => {
		it("should exit with error when deleting without a name", async () => {
			await command.execute({ action: "delete" });

			expect(errorSpy).toHaveBeenCalled();
			const errorOutput = errorSpy.mock.calls[0]?.[0] as string;
			expect(errorOutput).toContain("Profile name is required");
			expect(exitSpy).toHaveBeenCalledWith(1);
		});
	});

	describe("add without both name and city", () => {
		it("should exit with error for name first", async () => {
			await command.execute({ action: "add" });

			expect(errorSpy).toHaveBeenCalled();
			const errorOutput = errorSpy.mock.calls[0]?.[0] as string;
			expect(errorOutput).toContain("Profile name is required");
			expect(exitSpy).toHaveBeenCalledWith(1);
		});
	});
});
