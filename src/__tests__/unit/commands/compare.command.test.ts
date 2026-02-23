import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CompareCommand } from "../../../commands/compare.command.js";

describe("CompareCommand", () => {
	let logSpy: ReturnType<typeof vi.spyOn>;

	const mockLocationService = {
		resolveQuery: vi.fn(),
	};

	const mockPrayerTimeService = {
		fetchDay: vi.fn(),
	};

	beforeEach(() => {
		logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

		mockLocationService.resolveQuery.mockResolvedValue({
			address: "San Francisco",
			latitude: 37.77,
			longitude: -122.42,
		});
		mockPrayerTimeService.fetchDay.mockResolvedValue({
			timings: {
				Fajr: "05:30 (PST)",
				Sunrise: "06:45",
				Dhuhr: "12:15",
				Asr: "15:30",
				Maghrib: "18:10 (PST)",
				Isha: "19:30",
			},
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("execute", () => {
		it("should output Prayer Time Comparison and both city addresses", async () => {
			mockLocationService.resolveQuery
				.mockResolvedValueOnce({
					address: "San Francisco",
					latitude: 37.77,
					longitude: -122.42,
				})
				.mockResolvedValueOnce({
					address: "New York",
					latitude: 40.71,
					longitude: -74.01,
				});

			const command = new CompareCommand(
				mockLocationService as never,
				mockPrayerTimeService as never,
			);

			await command.execute({ cities: ["San Francisco", "New York"] });

			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("Prayer Time Comparison");
			expect(allOutput).toContain("San Francisco");
			expect(allOutput).toContain("New York");
		});

		it("should throw error for too few cities", async () => {
			const command = new CompareCommand(
				mockLocationService as never,
				mockPrayerTimeService as never,
			);

			await expect(command.execute({ cities: ["San Francisco"] })).rejects.toThrow(
				"Provide 2-4 cities to compare.",
			);
		});

		it("should throw error for too many cities (5)", async () => {
			const command = new CompareCommand(
				mockLocationService as never,
				mockPrayerTimeService as never,
			);

			await expect(
				command.execute({
					cities: ["City1", "City2", "City3", "City4", "City5"],
				}),
			).rejects.toThrow("Provide 2-4 cities to compare.");
		});

		it("should handle fetch error gracefully and show N/A", async () => {
			mockLocationService.resolveQuery
				.mockResolvedValueOnce({
					address: "San Francisco",
					latitude: 37.77,
					longitude: -122.42,
				})
				.mockRejectedValueOnce(new Error("Network error"));

			const command = new CompareCommand(
				mockLocationService as never,
				mockPrayerTimeService as never,
			);

			await command.execute({ cities: ["San Francisco", "BadCity"] });

			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("N/A");
		});
	});
});
