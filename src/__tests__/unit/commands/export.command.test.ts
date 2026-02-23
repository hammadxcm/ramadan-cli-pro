import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ExportCommand } from "../../../commands/export.command.js";

vi.mock("node:fs", () => ({ writeFileSync: vi.fn() }));

import { writeFileSync } from "node:fs";

describe("ExportCommand", () => {
	let logSpy: ReturnType<typeof vi.spyOn>;

	const mockIcalService = {
		generateIcal: vi.fn(),
		generateCsv: vi.fn(),
		generateJson: vi.fn(),
	};

	beforeEach(() => {
		logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

		mockIcalService.generateIcal.mockReturnValue("BEGIN:VCALENDAR\r\nEND:VCALENDAR");
		mockIcalService.generateCsv.mockReturnValue(
			'Title,Date,Time,Duration\n"Fajr","15-03-2026","05:30",15',
		);
		mockIcalService.generateJson.mockReturnValue(
			'[{"title":"Fajr","date":"15-03-2026","time":"05:30","duration":15}]',
		);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("execute", () => {
		it("should call generateIcal, write file, and log success with ical format", async () => {
			const command = new ExportCommand(mockIcalService as never);

			await command.execute({ format: "ical" });

			expect(mockIcalService.generateIcal).toHaveBeenCalled();
			expect(writeFileSync).toHaveBeenCalledWith(
				"ramadan-times.ics",
				"BEGIN:VCALENDAR\r\nEND:VCALENDAR",
				"utf-8",
			);
			expect(logSpy).toHaveBeenCalled();
			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("ramadan-times.ics");
		});

		it("should use ical as default format", async () => {
			const command = new ExportCommand(mockIcalService as never);

			await command.execute({});

			expect(mockIcalService.generateIcal).toHaveBeenCalled();
			expect(writeFileSync).toHaveBeenCalled();
		});

		it("should throw CommandError for unsupported format", async () => {
			const command = new ExportCommand(mockIcalService as never);

			await expect(command.execute({ format: "pdf" })).rejects.toThrow("Unsupported format");
		});

		it("should write to custom output path", async () => {
			const command = new ExportCommand(mockIcalService as never);

			await command.execute({ format: "ical", output: "/tmp/custom.ics" });

			expect(writeFileSync).toHaveBeenCalledWith(
				"/tmp/custom.ics",
				"BEGIN:VCALENDAR\r\nEND:VCALENDAR",
				"utf-8",
			);
			expect(logSpy).toHaveBeenCalled();
			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("/tmp/custom.ics");
		});

		it("should call generateCsv and write .csv file for csv format", async () => {
			const command = new ExportCommand(mockIcalService as never);

			await command.execute({ format: "csv" });

			expect(mockIcalService.generateCsv).toHaveBeenCalled();
			expect(mockIcalService.generateIcal).not.toHaveBeenCalled();
			expect(writeFileSync).toHaveBeenCalledWith(
				"ramadan-times.csv",
				expect.stringContaining("Title,Date,Time,Duration"),
				"utf-8",
			);
			expect(logSpy).toHaveBeenCalled();
			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("ramadan-times.csv");
		});

		it("should call generateJson and write .json file for json format", async () => {
			const command = new ExportCommand(mockIcalService as never);

			await command.execute({ format: "json" });

			expect(mockIcalService.generateJson).toHaveBeenCalled();
			expect(mockIcalService.generateIcal).not.toHaveBeenCalled();
			expect(writeFileSync).toHaveBeenCalledWith(
				"ramadan-times.json",
				expect.stringContaining("Fajr"),
				"utf-8",
			);
			expect(logSpy).toHaveBeenCalled();
			const output = logSpy.mock.calls[0]?.[0] as string;
			expect(output).toContain("ramadan-times.json");
		});

		it("should use custom output path for csv format", async () => {
			const command = new ExportCommand(mockIcalService as never);

			await command.execute({ format: "csv", output: "/tmp/export.csv" });

			expect(writeFileSync).toHaveBeenCalledWith("/tmp/export.csv", expect.any(String), "utf-8");
		});

		it("should use custom output path for json format", async () => {
			const command = new ExportCommand(mockIcalService as never);

			await command.execute({ format: "json", output: "/tmp/export.json" });

			expect(writeFileSync).toHaveBeenCalledWith("/tmp/export.json", expect.any(String), "utf-8");
		});
	});
});
