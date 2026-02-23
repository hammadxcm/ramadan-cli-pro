import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DashboardCommand } from "../../../commands/dashboard.command.js";
import { CommandError } from "../../../errors/command.error.js";
import type { CommandContext } from "../../../types/command.js";

const mockRender = vi.fn();
const mockCreateElement = vi.fn().mockReturnValue("mock-element");
const MockApp = vi.fn();

vi.mock("ink", () => ({
	render: (...args: unknown[]) => mockRender(...args),
}));

vi.mock("react", () => ({
	default: {
		createElement: (...args: unknown[]) => mockCreateElement(...args),
	},
	createElement: (...args: unknown[]) => mockCreateElement(...args),
}));

vi.mock("../../../tui/app.js", () => ({
	App: MockApp,
}));

describe("DashboardCommand", () => {
	let command: DashboardCommand;

	beforeEach(() => {
		command = new DashboardCommand();
		mockRender.mockReset();
		mockCreateElement.mockReset().mockReturnValue("mock-element");
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("can be instantiated", () => {
		expect(command).toBeInstanceOf(DashboardCommand);
	});

	it("has an execute method", () => {
		expect(typeof command.execute).toBe("function");
	});

	it("calls ink render when execute is called", async () => {
		const context: CommandContext = { city: "Lahore" };

		await command.execute(context);

		expect(mockRender).toHaveBeenCalledTimes(1);
	});

	it("creates a React element with the App component and context", async () => {
		const context: CommandContext = { city: "Karachi", tui: true };

		await command.execute(context);

		expect(mockCreateElement).toHaveBeenCalledTimes(1);
		expect(mockCreateElement).toHaveBeenCalledWith(MockApp, { context });
	});

	it("passes the created element to ink render", async () => {
		const context: CommandContext = {};

		await command.execute(context);

		expect(mockCreateElement).toHaveBeenCalledTimes(1);
		expect(mockRender).toHaveBeenCalledWith("mock-element");
	});

	it("handles import failure gracefully", async () => {
		mockRender.mockImplementation(() => {
			throw new Error("ink not available");
		});

		await expect(command.execute({})).rejects.toThrow(CommandError);
		await expect(command.execute({})).rejects.toThrow("Failed to start TUI dashboard");
	});

	it("handles non-Error exceptions in the catch block", async () => {
		mockRender.mockImplementation(() => {
			throw "string error";
		});

		await expect(command.execute({})).rejects.toThrow(CommandError);
	});

	it("passes empty context through to the App component", async () => {
		const context: CommandContext = {};

		await command.execute(context);

		expect(mockCreateElement).toHaveBeenCalledWith(MockApp, { context: {} });
	});

	it("passes context with all options through to the App component", async () => {
		const context: CommandContext = {
			city: "Istanbul",
			all: true,
			rozaNumber: 5,
			plain: false,
			json: false,
			status: false,
			tui: true,
			locale: "en",
		};

		await command.execute(context);

		expect(mockCreateElement).toHaveBeenCalledWith(MockApp, { context });
	});
});
