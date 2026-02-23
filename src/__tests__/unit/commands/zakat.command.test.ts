import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ZakatCommand } from "../../../commands/zakat.command.js";

describe("ZakatCommand", () => {
	let logSpy: ReturnType<typeof vi.spyOn>;
	let errorSpy: ReturnType<typeof vi.spyOn>;
	let exitSpy: ReturnType<typeof vi.fn>;

	const mockZakatService = {
		calculateZakat: vi.fn(),
		isAboveNisab: vi.fn(),
	};

	beforeEach(() => {
		logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
		errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		exitSpy = vi.spyOn(process, "exit").mockImplementation(((code?: number) => {
			throw new Error(`process.exit(${code})`);
		}) as never) as unknown as ReturnType<typeof vi.fn>;

		mockZakatService.calculateZakat.mockReturnValue({
			totalWealth: 10000,
			totalDeductions: 500,
			netWorth: 9500,
			nisabGold: 5686.2,
			nisabSilver: 520.51,
			isAboveNisab: true,
			zakatDue: 237.5,
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("execute", () => {
		it("should call calculateZakat with options", async () => {
			const command = new ZakatCommand(mockZakatService as never);

			await command.execute({
				cash: 5000,
				gold: 2000,
				silver: 500,
				investments: 2000,
				property: 500,
				debts: 500,
			});

			expect(mockZakatService.calculateZakat).toHaveBeenCalledWith({
				cash: 5000,
				gold: 2000,
				silver: 500,
				investments: 2000,
				property: 500,
				debts: 500,
			});
		});

		it("should output Zakat Calculator header, total wealth, net worth, and zakat due", async () => {
			const command = new ZakatCommand(mockZakatService as never);

			await command.execute({ cash: 10000 });

			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("Zakat Calculator");
			expect(allOutput).toContain("10000.00");
			expect(allOutput).toContain("9500.00");
			expect(allOutput).toContain("237.50");
		});

		it("should show below nisab message when not above nisab", async () => {
			mockZakatService.calculateZakat.mockReturnValueOnce({
				totalWealth: 200,
				totalDeductions: 0,
				netWorth: 200,
				nisabGold: 5686.2,
				nisabSilver: 520.51,
				isAboveNisab: false,
				zakatDue: 0,
			});
			const command = new ZakatCommand(mockZakatService as never);

			await command.execute({ cash: 200 });

			const allOutput = logSpy.mock.calls.map((c) => c[0]).join("\n");
			expect(allOutput).toContain("below nisab");
		});
	});
});
