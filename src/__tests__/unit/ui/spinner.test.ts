import { describe, expect, it } from "vitest";
import { createSpinner } from "../../../ui/spinner.js";

describe("createSpinner", () => {
	it("returns an object", () => {
		const spinner = createSpinner("Loading...");
		expect(typeof spinner).toBe("object");
		expect(spinner).not.toBeNull();
	});

	it("returned object has a start method", () => {
		const spinner = createSpinner("Loading...");
		expect(typeof spinner.start).toBe("function");
	});

	it("returned object has a stop method", () => {
		const spinner = createSpinner("Loading...");
		expect(typeof spinner.stop).toBe("function");
	});

	it("returned object has a succeed method", () => {
		const spinner = createSpinner("Loading...");
		expect(typeof spinner.succeed).toBe("function");
	});

	it("returned object has a fail method", () => {
		const spinner = createSpinner("Loading...");
		expect(typeof spinner.fail).toBe("function");
	});

	it("returned object has text property matching input", () => {
		const spinner = createSpinner("Fetching data...");
		expect(spinner.text).toBe("Fetching data...");
	});
});
