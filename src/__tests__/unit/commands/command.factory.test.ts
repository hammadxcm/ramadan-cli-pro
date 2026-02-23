import { describe, expect, it } from "vitest";
import { CommandFactory } from "../../../commands/command.factory.js";

describe("CommandFactory", () => {
	const mockCommand = (name: string) => ({ name, execute: () => {} });

	const factory = new CommandFactory();
	factory.register("ramadan", mockCommand("ramadan"));
	factory.register("config", mockCommand("config"));
	factory.register("reset", mockCommand("reset"));
	factory.register("dashboard", mockCommand("dashboard"));
	factory.register("notify", mockCommand("notify"));
	factory.register("qibla", mockCommand("qibla"));
	factory.register("dua", mockCommand("dua"));
	factory.register("track", mockCommand("track"));

	it("get: returns a registered command", () => {
		const cmd = factory.get("ramadan");
		expect(cmd).toBeDefined();
	});

	it("get: returns undefined for unregistered command", () => {
		const cmd = factory.get("nonexistent");
		expect(cmd).toBeUndefined();
	});

	it("register + get: registers and retrieves a new command", () => {
		factory.register("custom", mockCommand("custom"));
		const cmd = factory.get("custom");
		expect(cmd).toBeDefined();
	});

	it("list: returns all registered command names", () => {
		const names = factory.list();
		expect(names).toContain("ramadan");
		expect(names).toContain("config");
		expect(names).toContain("reset");
		expect(Array.isArray(names)).toBe(true);
	});
});
