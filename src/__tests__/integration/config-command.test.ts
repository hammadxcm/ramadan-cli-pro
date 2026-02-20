import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConfigCommand } from "../../commands/config.command.js";
import { ResetCommand } from "../../commands/reset.command.js";
import type { ConfigRepository } from "../../repositories/config.repository.js";
import { createMockConfigRepository } from "../helpers/mocks.js";

describe("ConfigCommand + ConfigRepository", () => {
	const mockConfigRepo = createMockConfigRepository();

	beforeEach(() => {
		vi.clearAllMocks();
		mockConfigRepo.getStoredLocation.mockReturnValue({});
		mockConfigRepo.getStoredPrayerSettings.mockReturnValue({ method: 2, school: 0 });
	});

	const command = new ConfigCommand(mockConfigRepo as unknown as ConfigRepository);

	it("--city and --country saves location", async () => {
		await command.execute({ city: "Karachi", country: "Pakistan" });
		expect(mockConfigRepo.setStoredLocation).toHaveBeenCalledWith(
			expect.objectContaining({ city: "Karachi", country: "Pakistan" }),
		);
	});

	it("--method saves calculation method", async () => {
		await command.execute({ method: "1" });
		expect(mockConfigRepo.setStoredMethod).toHaveBeenCalledWith(1);
	});

	it("--school saves school", async () => {
		await command.execute({ school: "1" });
		expect(mockConfigRepo.setStoredSchool).toHaveBeenCalledWith(1);
	});

	it("--timezone saves timezone", async () => {
		await command.execute({ timezone: "Asia/Karachi" });
		expect(mockConfigRepo.setStoredTimezone).toHaveBeenCalledWith("Asia/Karachi");
	});

	it("--latitude and --longitude saves coordinates", async () => {
		await command.execute({ latitude: "31.52", longitude: "74.36" });
		expect(mockConfigRepo.setStoredLocation).toHaveBeenCalledWith(
			expect.objectContaining({ latitude: 31.52, longitude: 74.36 }),
		);
	});

	it("--clear delegates to clearAll", async () => {
		await command.execute({ clear: true });
		expect(mockConfigRepo.clearAll).toHaveBeenCalled();
	});

	it("--show reads and prints config without writing", async () => {
		mockConfigRepo.getStoredLocation.mockReturnValue({
			city: "Lahore",
			country: "Pakistan",
		});
		mockConfigRepo.getStoredFirstRozaDate.mockReturnValue(undefined);

		const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
		await command.execute({ show: true });

		expect(mockConfigRepo.setStoredLocation).not.toHaveBeenCalled();
		expect(consoleSpy).toHaveBeenCalled();
		consoleSpy.mockRestore();
	});

	it("no flags shows hint message", async () => {
		const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
		await command.execute({});
		expect(mockConfigRepo.setStoredLocation).not.toHaveBeenCalled();
		expect(consoleSpy).toHaveBeenCalled();
		consoleSpy.mockRestore();
	});

	it("invalid method throws", async () => {
		await expect(command.execute({ method: "99" })).rejects.toThrow();
	});

	it("invalid latitude throws", async () => {
		await expect(command.execute({ latitude: "999" })).rejects.toThrow();
	});
});

describe("ResetCommand + ConfigRepository", () => {
	const mockConfigRepo = createMockConfigRepository();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("reset clears all config", () => {
		const command = new ResetCommand(mockConfigRepo as unknown as ConfigRepository);
		command.execute();
		expect(mockConfigRepo.clearAll).toHaveBeenCalled();
	});
});
