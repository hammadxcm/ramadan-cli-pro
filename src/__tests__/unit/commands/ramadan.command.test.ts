import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RamadanCommand } from "../../../commands/ramadan.command.js";
import { CommandError } from "../../../errors/command.error.js";
import { PrayerTimeFetchError } from "../../../errors/prayer.error.js";
import type { CommandContext } from "../../../types/command.js";
import type { PrayerData } from "../../../types/prayer.js";
import type { HighlightState, RamadanRow } from "../../../types/ramadan.js";
import { createPrayerDataForDay, samplePrayerData } from "../../helpers/fixtures.js";
import { createMockConfigRepository } from "../../helpers/mocks.js";

vi.mock("../../../ui/spinner.js", () => ({
	createSpinner: vi.fn().mockReturnValue({
		start: vi.fn(),
		stop: vi.fn(),
		succeed: vi.fn(),
		fail: vi.fn(),
	}),
}));

vi.mock("../../../setup/setup.utils.js", () => ({
	canPromptInteractively: vi.fn().mockReturnValue(false),
}));

const defaultQuery = {
	address: "Lahore, Pakistan",
	city: "Lahore",
	country: "Pakistan",
	latitude: 31.5204,
	longitude: 74.3587,
	method: 2,
	school: 0,
};

const sampleRow: RamadanRow = {
	roza: 1,
	sehar: "05:15 AM",
	iftar: "05:55 PM",
	date: "01 Mar 2026",
	hijri: "1 Ramadan 1447",
};

const sampleHighlight: HighlightState = {
	current: "Sehar",
	next: "Iftar",
	countdown: "02:15:30",
};

describe("RamadanCommand", () => {
	let command: RamadanCommand;
	let mockConfigRepo: ReturnType<typeof createMockConfigRepository>;
	let mockLocationService: {
		resolveQuery: ReturnType<typeof vi.fn>;
		normalizeCityAlias: ReturnType<typeof vi.fn>;
		parseCityCountry: ReturnType<typeof vi.fn>;
	};
	let mockPrayerTimeService: {
		fetchDay: ReturnType<typeof vi.fn>;
		fetchCalendar: ReturnType<typeof vi.fn>;
		fetchCustomDays: ReturnType<typeof vi.fn>;
	};
	let mockRamadanService: {
		toRamadanRow: ReturnType<typeof vi.fn>;
		getHighlightState: ReturnType<typeof vi.fn>;
		formatStatusLine: ReturnType<typeof vi.fn>;
		getTargetRamadanYear: ReturnType<typeof vi.fn>;
		getRowByRozaNumber: ReturnType<typeof vi.fn>;
		getDayByRozaNumber: ReturnType<typeof vi.fn>;
		getHijriYearFromRozaNumber: ReturnType<typeof vi.fn>;
		getAllModeRowAnnotations: ReturnType<typeof vi.fn>;
	};
	let mockDateService: {
		parseGregorian: ReturnType<typeof vi.fn>;
		parseIso: ReturnType<typeof vi.fn>;
		formatForApi: ReturnType<typeof vi.fn>;
		getRozaNumber: ReturnType<typeof vi.fn>;
		getRozaNumberFromHijriDay: ReturnType<typeof vi.fn>;
		getTargetRamadanYear: ReturnType<typeof vi.fn>;
		addDays: ReturnType<typeof vi.fn>;
		parseGregorianDay: ReturnType<typeof vi.fn>;
	};
	let mockFormatter: {
		format: ReturnType<typeof vi.fn>;
		name: string;
	};
	let mockFormatterFactory: {
		select: ReturnType<typeof vi.fn>;
		get: ReturnType<typeof vi.fn>;
	};
	let mockFirstRunSetup: {
		run: ReturnType<typeof vi.fn>;
	};
	let logSpy: ReturnType<typeof vi.spyOn>;
	let errorSpy: ReturnType<typeof vi.spyOn>;
	let stderrSpy: ReturnType<typeof vi.fn>;
	let exitSpy: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mockConfigRepo = createMockConfigRepository();

		mockLocationService = {
			resolveQuery: vi.fn().mockResolvedValue(defaultQuery),
			normalizeCityAlias: vi.fn((x: string) => x),
			parseCityCountry: vi.fn(),
		};

		mockPrayerTimeService = {
			fetchDay: vi.fn().mockResolvedValue(samplePrayerData),
			fetchCalendar: vi.fn().mockResolvedValue([samplePrayerData]),
			fetchCustomDays: vi.fn().mockResolvedValue([samplePrayerData]),
		};

		mockRamadanService = {
			toRamadanRow: vi.fn().mockReturnValue(sampleRow),
			getHighlightState: vi.fn().mockReturnValue(sampleHighlight),
			formatStatusLine: vi.fn().mockReturnValue("Sehar | Iftar in 02:15:30"),
			getTargetRamadanYear: vi.fn().mockReturnValue(1447),
			getRowByRozaNumber: vi.fn().mockReturnValue(sampleRow),
			getDayByRozaNumber: vi.fn().mockReturnValue(samplePrayerData),
			getHijriYearFromRozaNumber: vi.fn().mockReturnValue(1447),
			getAllModeRowAnnotations: vi.fn().mockReturnValue({ 1: "current", 2: "next" }),
		};

		mockDateService = {
			parseGregorian: vi.fn().mockReturnValue(new Date("2026-03-01")),
			parseIso: vi.fn().mockReturnValue(new Date("2026-03-01")),
			formatForApi: vi.fn().mockReturnValue("01-03-2026"),
			getRozaNumber: vi.fn().mockReturnValue(1),
			getRozaNumberFromHijriDay: vi.fn().mockReturnValue(1),
			getTargetRamadanYear: vi.fn().mockReturnValue(1447),
			addDays: vi.fn().mockReturnValue(new Date("2026-03-02")),
			parseGregorianDay: vi.fn().mockReturnValue({ year: 2026, month: 3, day: 1 }),
		};

		mockFormatter = {
			format: vi.fn().mockReturnValue("formatted output"),
			name: "table",
		};

		mockFormatterFactory = {
			select: vi.fn().mockReturnValue(mockFormatter),
			get: vi.fn().mockReturnValue(mockFormatter),
		};

		mockFirstRunSetup = {
			run: vi.fn().mockResolvedValue(true),
		};

		// biome-ignore lint/suspicious/noExplicitAny: test mocks
		command = new (RamadanCommand as any)(
			mockConfigRepo,
			mockLocationService,
			mockPrayerTimeService,
			mockRamadanService,
			mockDateService,
			mockFormatterFactory,
			mockFirstRunSetup,
		);

		logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
		errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		stderrSpy = vi
			.spyOn(process.stderr, "write")
			.mockImplementation(() => true) as unknown as ReturnType<typeof vi.fn>;
		exitSpy = vi.spyOn(process, "exit").mockImplementation(((code?: number) => {
			throw new Error(`process.exit(${code})`);
		}) as never) as unknown as ReturnType<typeof vi.fn>;
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("validate", () => {
		it("should throw when both all and rozaNumber are set", () => {
			const context: CommandContext = { all: true, rozaNumber: 5 };

			expect(() => command.validate(context)).toThrow("Use either --all or --number, not both.");
		});

		it("should not throw when only all is set", () => {
			const context: CommandContext = { all: true };

			expect(() => command.validate(context)).not.toThrow();
		});

		it("should not throw when only rozaNumber is set", () => {
			const context: CommandContext = { rozaNumber: 5 };

			expect(() => command.validate(context)).not.toThrow();
		});

		it("should not throw when neither all nor rozaNumber is set", () => {
			const context: CommandContext = {};

			expect(() => command.validate(context)).not.toThrow();
		});
	});

	describe("status mode", () => {
		it("should output formatted status line when highlight exists", async () => {
			const context: CommandContext = { status: true };

			await command.execute(context);

			expect(mockLocationService.resolveQuery).toHaveBeenCalledWith({
				city: undefined,
				allowInteractiveSetup: false,
			});
			expect(mockPrayerTimeService.fetchDay).toHaveBeenCalledWith(defaultQuery);
			expect(mockRamadanService.getHighlightState).toHaveBeenCalledWith(samplePrayerData);
			expect(mockFormatterFactory.select).toHaveBeenCalledWith({ status: true });
			expect(mockFormatter.format).toHaveBeenCalledWith({
				output: {
					mode: "today",
					location: "Lahore, Pakistan",
					hijriYear: 0,
					rows: [],
				},
				highlight: sampleHighlight,
			});
			expect(logSpy).toHaveBeenCalledWith("formatted output");
		});

		it("should not output anything when no highlight exists", async () => {
			mockRamadanService.getHighlightState.mockReturnValue(null);
			const context: CommandContext = { status: true };

			await command.execute(context);

			expect(mockRamadanService.getHighlightState).toHaveBeenCalledWith(samplePrayerData);
			expect(logSpy).not.toHaveBeenCalled();
		});

		it("should silently swallow errors", async () => {
			mockLocationService.resolveQuery.mockRejectedValue(new Error("network error"));
			const context: CommandContext = { status: true };

			await command.execute(context);

			expect(logSpy).not.toHaveBeenCalled();
			expect(exitSpy).not.toHaveBeenCalled();
		});

		it("should pass city to resolveQuery when provided", async () => {
			const context: CommandContext = { status: true, city: "Karachi" };

			await command.execute(context);

			expect(mockLocationService.resolveQuery).toHaveBeenCalledWith({
				city: "Karachi",
				allowInteractiveSetup: false,
			});
		});
	});

	describe("today mode (default)", () => {
		it("should fetch data and display with today mode when in Ramadan", async () => {
			const context: CommandContext = {};

			await command.execute(context);

			expect(mockLocationService.resolveQuery).toHaveBeenCalled();
			expect(mockPrayerTimeService.fetchDay).toHaveBeenCalledWith(defaultQuery);
			expect(mockDateService.parseGregorian).toHaveBeenCalledWith("01-03-2026");
			expect(mockRamadanService.getTargetRamadanYear).toHaveBeenCalledWith(samplePrayerData);
			expect(mockRamadanService.toRamadanRow).toHaveBeenCalled();
			expect(mockFormatterFactory.select).toHaveBeenCalledWith({
				json: undefined,
				plain: undefined,
			});
			expect(mockFormatter.format).toHaveBeenCalled();
			expect(logSpy).toHaveBeenCalledWith("formatted output");
		});

		it("should use hijri day for roza number when in Ramadan month", async () => {
			const context: CommandContext = {};

			await command.execute(context);

			// samplePrayerData has hijri month number 9 (Ramadan)
			expect(mockDateService.getRozaNumberFromHijriDay).toHaveBeenCalledWith("1");
			expect(mockRamadanService.toRamadanRow).toHaveBeenCalledWith(samplePrayerData, 1);
		});

		it("should fetch calendar when not in Ramadan and use first day", async () => {
			const nonRamadanData: PrayerData = {
				...samplePrayerData,
				date: {
					...samplePrayerData.date,
					hijri: {
						...samplePrayerData.date.hijri,
						month: {
							number: 8,
							en: "Shaban",
							ar: "شعبان",
						},
					},
				},
			};
			mockPrayerTimeService.fetchDay.mockResolvedValue(nonRamadanData);
			const firstRamadanDay = createPrayerDataForDay(1);
			mockPrayerTimeService.fetchCalendar.mockResolvedValue([firstRamadanDay]);
			const context: CommandContext = {};

			await command.execute(context);

			expect(mockPrayerTimeService.fetchCalendar).toHaveBeenCalledWith(defaultQuery, 1447);
			expect(mockRamadanService.toRamadanRow).toHaveBeenCalledWith(firstRamadanDay, 1);
		});

		it("should throw when calendar returns empty array (no first Ramadan day)", async () => {
			const nonRamadanData: PrayerData = {
				...samplePrayerData,
				date: {
					...samplePrayerData.date,
					hijri: {
						...samplePrayerData.date.hijri,
						month: {
							number: 8,
							en: "Shaban",
							ar: "شعبان",
						},
					},
				},
			};
			mockPrayerTimeService.fetchDay.mockResolvedValue(nonRamadanData);
			mockPrayerTimeService.fetchCalendar.mockResolvedValue([]);
			const context: CommandContext = {};

			await expect(command.execute(context)).rejects.toThrow(CommandError);
		});

		it("should throw when row is null after toRamadanRow", async () => {
			mockRamadanService.toRamadanRow.mockReturnValue(null);
			const context: CommandContext = {};

			await expect(command.execute(context)).rejects.toThrow(CommandError);
		});

		it("should output formatted result to console.log", async () => {
			mockFormatter.format.mockReturnValue("table output for today");
			const context: CommandContext = {};

			await command.execute(context);

			expect(logSpy).toHaveBeenCalledWith("table output for today");
		});
	});

	describe("all mode", () => {
		it("should fetch calendar and show all 30 days with annotations", async () => {
			const days = Array.from({ length: 30 }, (_, i) => createPrayerDataForDay(i + 1));
			mockPrayerTimeService.fetchCalendar.mockResolvedValue(days);
			mockRamadanService.toRamadanRow.mockImplementation((_day: PrayerData, roza: number) => ({
				...sampleRow,
				roza,
			}));
			const context: CommandContext = { all: true };

			await command.execute(context);

			expect(mockPrayerTimeService.fetchCalendar).toHaveBeenCalledWith(defaultQuery, 1447);
			expect(mockRamadanService.toRamadanRow).toHaveBeenCalledTimes(30);
			expect(mockRamadanService.getAllModeRowAnnotations).toHaveBeenCalled();
			expect(mockFormatterFactory.select).toHaveBeenCalledWith({
				json: undefined,
				plain: undefined,
			});
			expect(mockFormatter.format).toHaveBeenCalled();
			const formatCall = mockFormatter.format.mock.calls[0]?.[0];
			expect(formatCall.output.mode).toBe("all");
			expect(formatCall.output.rows).toHaveLength(30);
			expect(formatCall.rowAnnotations).toEqual({ 1: "current", 2: "next" });
			expect(logSpy).toHaveBeenCalledWith("formatted output");
		});

		it("should pass today's data and Gregorian date to getAllModeRowAnnotations", async () => {
			mockPrayerTimeService.fetchCalendar.mockResolvedValue([samplePrayerData]);
			const context: CommandContext = { all: true };

			await command.execute(context);

			expect(mockRamadanService.getAllModeRowAnnotations).toHaveBeenCalledWith({
				today: samplePrayerData,
				todayGregorianDate: new Date("2026-03-01"),
				targetYear: 1447,
				configuredFirstRozaDate: null,
			});
		});

		it("should use custom days when firstRozaDate is configured", async () => {
			const customDays = Array.from({ length: 30 }, (_, i) => createPrayerDataForDay(i + 1));
			mockPrayerTimeService.fetchCustomDays.mockResolvedValue(customDays);
			mockRamadanService.toRamadanRow.mockImplementation((_day: PrayerData, roza: number) => ({
				...sampleRow,
				roza,
			}));
			const context: CommandContext = { all: true, firstRozaDate: "2026-03-01" };

			await command.execute(context);

			expect(mockDateService.parseIso).toHaveBeenCalledWith("2026-03-01");
			expect(mockConfigRepo.setStoredFirstRozaDate).toHaveBeenCalledWith("2026-03-01");
			expect(mockPrayerTimeService.fetchCustomDays).toHaveBeenCalledWith(
				defaultQuery,
				new Date("2026-03-01"),
			);
			expect(mockRamadanService.toRamadanRow).toHaveBeenCalledTimes(30);
		});
	});

	describe("number mode", () => {
		it("should fetch calendar and show specific roza by number", async () => {
			const context: CommandContext = { rozaNumber: 5 };

			await command.execute(context);

			expect(mockPrayerTimeService.fetchCalendar).toHaveBeenCalledWith(defaultQuery, 1447);
			expect(mockRamadanService.getRowByRozaNumber).toHaveBeenCalled();
			expect(mockRamadanService.getDayByRozaNumber).toHaveBeenCalled();
			expect(mockRamadanService.getHijriYearFromRozaNumber).toHaveBeenCalled();
			expect(mockFormatter.format).toHaveBeenCalled();
			const formatCall = mockFormatter.format.mock.calls[0]?.[0];
			expect(formatCall.output.mode).toBe("number");
			expect(formatCall.output.rows).toEqual([sampleRow]);
			expect(logSpy).toHaveBeenCalledWith("formatted output");
		});

		it("should use custom days when firstRozaDate is configured", async () => {
			const customDays = Array.from({ length: 30 }, (_, i) => createPrayerDataForDay(i + 1));
			mockPrayerTimeService.fetchCustomDays.mockResolvedValue(customDays);
			const context: CommandContext = { rozaNumber: 5, firstRozaDate: "2026-03-01" };

			await command.execute(context);

			expect(mockPrayerTimeService.fetchCustomDays).toHaveBeenCalledWith(
				defaultQuery,
				new Date("2026-03-01"),
			);
			expect(mockRamadanService.getRowByRozaNumber).toHaveBeenCalledWith(customDays, 5);
			expect(mockRamadanService.getDayByRozaNumber).toHaveBeenCalledWith(customDays, 5);
			expect(mockRamadanService.getHijriYearFromRozaNumber).toHaveBeenCalledWith(
				customDays,
				5,
				1447,
			);
		});

		it("should pass highlight state from selected day to formatter", async () => {
			const selectedDay = createPrayerDataForDay(5);
			const selectedHighlight: HighlightState = {
				current: "Iftar",
				next: "Sehar",
				countdown: "01:00:00",
			};
			mockRamadanService.getDayByRozaNumber.mockReturnValue(selectedDay);
			mockRamadanService.getHighlightState.mockReturnValue(selectedHighlight);
			const context: CommandContext = { rozaNumber: 5 };

			await command.execute(context);

			expect(mockRamadanService.getHighlightState).toHaveBeenCalledWith(selectedDay);
			const formatCall = mockFormatter.format.mock.calls[0]?.[0];
			expect(formatCall.highlight).toBe(selectedHighlight);
		});
	});

	describe("JSON mode error handling", () => {
		it("should output JSON error to stderr and throw CommandError", async () => {
			mockLocationService.resolveQuery.mockRejectedValue(
				new PrayerTimeFetchError("Could not fetch prayer times. timeout", ["timeout"]),
			);
			const context: CommandContext = { json: true };

			await expect(command.execute(context)).rejects.toThrow(CommandError);

			expect(stderrSpy).toHaveBeenCalledTimes(1);
			const written = stderrSpy.mock.calls[0]?.[0] as string;
			const parsed = JSON.parse(written.trim());
			expect(parsed).toEqual({
				ok: false,
				error: {
					code: "PRAYER_TIMES_FETCH_FAILED",
					message: "Could not fetch prayer times. timeout",
				},
			});
		});

		it("should use INVALID_FLAG_COMBINATION code for flag errors", async () => {
			mockLocationService.resolveQuery.mockRejectedValue(
				new Error("Use either --all or --number, not both."),
			);
			const context: CommandContext = { json: true };

			await expect(command.execute(context)).rejects.toThrow(CommandError);

			const written = stderrSpy.mock.calls[0]?.[0] as string;
			const parsed = JSON.parse(written.trim());
			expect(parsed.error.code).toBe("INVALID_FLAG_COMBINATION");
		});

		it("should use UNKNOWN_ERROR code for unknown errors", async () => {
			mockLocationService.resolveQuery.mockRejectedValue("string error");
			const context: CommandContext = { json: true };

			await expect(command.execute(context)).rejects.toThrow(CommandError);

			const written = stderrSpy.mock.calls[0]?.[0] as string;
			const parsed = JSON.parse(written.trim());
			expect(parsed.error.code).toBe("UNKNOWN_ERROR");
			expect(parsed.error.message).toBe("unknown error");
		});

		it("should use LOCATION_DETECTION_FAILED code for location errors", async () => {
			mockLocationService.resolveQuery.mockRejectedValue(
				new Error("Could not detect location. No providers available."),
			);
			const context: CommandContext = { json: true };

			await expect(command.execute(context)).rejects.toThrow(CommandError);

			const written = stderrSpy.mock.calls[0]?.[0] as string;
			const parsed = JSON.parse(written.trim());
			expect(parsed.error.code).toBe("LOCATION_DETECTION_FAILED");
		});

		it("should use ROZA_NOT_FOUND code for roza not found errors", async () => {
			mockLocationService.resolveQuery.mockRejectedValue(
				new Error("Could not find roza 31 timings."),
			);
			const context: CommandContext = { json: true };

			await expect(command.execute(context)).rejects.toThrow(CommandError);

			const written = stderrSpy.mock.calls[0]?.[0] as string;
			const parsed = JSON.parse(written.trim());
			expect(parsed.error.code).toBe("ROZA_NOT_FOUND");
		});

		it("should use INVALID_FIRST_ROZA_DATE code for invalid date errors", async () => {
			mockDateService.parseIso.mockReturnValue(null);
			const context: CommandContext = { json: true, firstRozaDate: "invalid-date" };

			await expect(command.execute(context)).rejects.toThrow(CommandError);

			const written = stderrSpy.mock.calls[0]?.[0] as string;
			const parsed = JSON.parse(written.trim());
			expect(parsed.error.code).toBe("INVALID_FIRST_ROZA_DATE");
		});

		it("should not trigger interactive setup in JSON mode", async () => {
			const context: CommandContext = { json: true };

			await command.execute(context);

			expect(mockLocationService.resolveQuery).toHaveBeenCalledWith(
				expect.objectContaining({
					allowInteractiveSetup: false,
				}),
			);
		});
	});

	describe("first roza date configuration", () => {
		it("should use configured firstRozaDate for custom days in today mode", async () => {
			mockDateService.parseIso.mockReturnValue(new Date("2026-03-01"));
			mockDateService.getRozaNumber.mockReturnValue(1);
			const context: CommandContext = { firstRozaDate: "2026-03-01" };

			await command.execute(context);

			expect(mockDateService.parseIso).toHaveBeenCalledWith("2026-03-01");
			expect(mockConfigRepo.setStoredFirstRozaDate).toHaveBeenCalledWith("2026-03-01");
			expect(mockRamadanService.toRamadanRow).toHaveBeenCalledWith(samplePrayerData, 1);
		});

		it("should throw on invalid firstRozaDate format", async () => {
			mockDateService.parseIso.mockReturnValue(null);
			const context: CommandContext = { firstRozaDate: "not-a-date" };

			await expect(command.execute(context)).rejects.toThrow("Invalid first roza date");
		});

		it("should use stored first roza date when no explicit one is provided", async () => {
			mockConfigRepo.getStoredFirstRozaDate.mockReturnValue("2026-02-28");
			mockDateService.parseIso.mockReturnValue(new Date("2026-02-28"));
			mockDateService.getRozaNumber.mockReturnValue(2);
			const context: CommandContext = {};

			await command.execute(context);

			expect(mockConfigRepo.getStoredFirstRozaDate).toHaveBeenCalled();
			expect(mockDateService.parseIso).toHaveBeenCalledWith("2026-02-28");
		});

		it("should clear invalid stored first roza date", async () => {
			mockConfigRepo.getStoredFirstRozaDate.mockReturnValue("bad-date");
			mockDateService.parseIso.mockReturnValue(null);
			const context: CommandContext = {};

			await command.execute(context);

			expect(mockConfigRepo.clearStoredFirstRozaDate).toHaveBeenCalled();
		});

		it("should show first roza day when roza number is less than 1", async () => {
			const firstRozaDate = new Date("2026-03-05");
			mockDateService.parseIso.mockReturnValue(firstRozaDate);
			mockDateService.getRozaNumber.mockReturnValue(0); // before Ramadan started
			const firstRozaDay = createPrayerDataForDay(5);
			mockPrayerTimeService.fetchDay.mockResolvedValueOnce(samplePrayerData);
			mockPrayerTimeService.fetchDay.mockResolvedValueOnce(firstRozaDay);
			const context: CommandContext = { firstRozaDate: "2026-03-05" };

			await command.execute(context);

			expect(mockPrayerTimeService.fetchDay).toHaveBeenCalledWith(defaultQuery, firstRozaDate);
			expect(mockRamadanService.toRamadanRow).toHaveBeenCalledWith(firstRozaDay, 1);
		});
	});

	describe("clear first roza date", () => {
		it("should call clearStoredFirstRozaDate when clearFirstRozaDate is set", async () => {
			const context: CommandContext = { clearFirstRozaDate: true };

			await command.execute(context);

			expect(mockConfigRepo.clearStoredFirstRozaDate).toHaveBeenCalled();
		});
	});

	describe("error handling", () => {
		it("should catch PrayerTimeFetchError and throw CommandError", async () => {
			mockPrayerTimeService.fetchDay.mockRejectedValue(
				new PrayerTimeFetchError("Could not fetch prayer times. API down", ["API down"]),
			);
			const context: CommandContext = {};

			await expect(command.execute(context)).rejects.toThrow(CommandError);
			await expect(command.execute(context)).rejects.toThrow(
				"Could not fetch prayer times. API down",
			);
		});

		it("should show generic message for non-Error throws", async () => {
			mockPrayerTimeService.fetchDay.mockRejectedValue("string error");
			const context: CommandContext = {};

			await expect(command.execute(context)).rejects.toThrow("Failed to fetch Ramadan timings");
		});

		it("should show error message from Error objects", async () => {
			mockPrayerTimeService.fetchDay.mockRejectedValue(new Error("Something went wrong"));
			const context: CommandContext = {};

			await expect(command.execute(context)).rejects.toThrow("Something went wrong");
		});
	});

	describe("location from CLI city", () => {
		it("should pass city to resolveQuery", async () => {
			const context: CommandContext = { city: "Karachi" };

			await command.execute(context);

			expect(mockLocationService.resolveQuery).toHaveBeenCalledWith(
				expect.objectContaining({
					city: "Karachi",
				}),
			);
		});

		it("should allow interactive setup when not in JSON mode", async () => {
			const context: CommandContext = { city: "Lahore" };

			await command.execute(context);

			expect(mockLocationService.resolveQuery).toHaveBeenCalledWith(
				expect.objectContaining({
					allowInteractiveSetup: true,
				}),
			);
		});
	});

	describe("plain mode", () => {
		it("should pass plain flag to formatter select", async () => {
			const context: CommandContext = { plain: true };

			await command.execute(context);

			expect(mockFormatterFactory.select).toHaveBeenCalledWith({
				json: undefined,
				plain: true,
			});
		});

		it("should pass plain flag to formatter format call", async () => {
			const context: CommandContext = { plain: true };

			await command.execute(context);

			const formatCall = mockFormatter.format.mock.calls[0]?.[0];
			expect(formatCall.plain).toBe(true);
		});

		it("should pass plain flag in all mode", async () => {
			mockPrayerTimeService.fetchCalendar.mockResolvedValue([samplePrayerData]);
			const context: CommandContext = { all: true, plain: true };

			await command.execute(context);

			expect(mockFormatterFactory.select).toHaveBeenCalledWith({
				json: undefined,
				plain: true,
			});
			const formatCall = mockFormatter.format.mock.calls[0]?.[0];
			expect(formatCall.plain).toBe(true);
		});

		it("should pass plain flag in number mode", async () => {
			const context: CommandContext = { rozaNumber: 3, plain: true };

			await command.execute(context);

			expect(mockFormatterFactory.select).toHaveBeenCalledWith({
				json: undefined,
				plain: true,
			});
			const formatCall = mockFormatter.format.mock.calls[0]?.[0];
			expect(formatCall.plain).toBe(true);
		});
	});

	describe("JSON output mode", () => {
		it("should select JSON formatter when json flag is set", async () => {
			const context: CommandContext = { json: true };

			await command.execute(context);

			expect(mockFormatterFactory.select).toHaveBeenCalledWith({
				json: true,
				plain: undefined,
			});
		});
	});

	describe("spinner behavior", () => {
		it("should not create spinner in JSON mode", async () => {
			const { createSpinner } = await import("../../../ui/spinner.js");
			(createSpinner as ReturnType<typeof vi.fn>).mockClear();
			const context: CommandContext = { json: true };

			await command.execute(context);

			expect(createSpinner).not.toHaveBeenCalled();
		});

		it("should not create spinner in status mode", async () => {
			const { createSpinner } = await import("../../../ui/spinner.js");
			(createSpinner as ReturnType<typeof vi.fn>).mockClear();
			const context: CommandContext = { status: true };

			await command.execute(context);

			expect(createSpinner).not.toHaveBeenCalled();
		});

		it("should create spinner in normal mode", async () => {
			const { createSpinner } = await import("../../../ui/spinner.js");
			(createSpinner as ReturnType<typeof vi.fn>).mockClear();
			const context: CommandContext = {};

			await command.execute(context);

			expect(createSpinner).toHaveBeenCalledWith("Fetching Ramadan timings...");
		});
	});

	describe("Gregorian date parsing failure", () => {
		it("should throw when parseGregorian returns null", async () => {
			mockDateService.parseGregorian.mockReturnValue(null);
			const context: CommandContext = {};

			await expect(command.execute(context)).rejects.toThrow(
				"Could not parse Gregorian date from prayer response",
			);
		});
	});

	describe("RAMADAN_CALENDAR_FETCH_FAILED error code", () => {
		it("should use RAMADAN_CALENDAR_FETCH_FAILED code for calendar fetch errors", async () => {
			mockLocationService.resolveQuery.mockRejectedValue(
				new Error("Could not fetch Ramadan calendar. All strategies failed."),
			);
			const context: CommandContext = { json: true };

			await expect(command.execute(context)).rejects.toThrow(CommandError);

			const written = stderrSpy.mock.calls[0]?.[0] as string;
			const parsed = JSON.parse(written.trim());
			expect(parsed.error.code).toBe("RAMADAN_CALENDAR_FETCH_FAILED");
		});
	});

	describe("RAMADAN_CLI_ERROR fallback error code", () => {
		it("should use RAMADAN_CLI_ERROR for unrecognized error messages", async () => {
			mockLocationService.resolveQuery.mockRejectedValue(new Error("Some random error occurred"));
			const context: CommandContext = { json: true };

			await expect(command.execute(context)).rejects.toThrow(CommandError);

			const written = stderrSpy.mock.calls[0]?.[0] as string;
			const parsed = JSON.parse(written.trim());
			expect(parsed.error.code).toBe("RAMADAN_CLI_ERROR");
		});
	});
});
