import { describe, expect, it } from "vitest";
import { assertDefined, assertNever } from "../../../utils/assert.js";

describe("assertNever", () => {
	it("throws an error with a message containing the value", () => {
		const value = "unexpected" as never;
		expect(() => assertNever(value)).toThrow("Unexpected value: unexpected");
	});

	it("throws an error for numeric values", () => {
		const value = 42 as never;
		expect(() => assertNever(value)).toThrow("Unexpected value: 42");
	});
});

describe("assertDefined", () => {
	it("returns the value when it is a string", () => {
		expect(assertDefined("hello")).toBe("hello");
	});

	it("returns the value when it is a number", () => {
		expect(assertDefined(42)).toBe(42);
	});

	it("returns the value when it is an object", () => {
		const obj = { key: "value" };
		expect(assertDefined(obj)).toBe(obj);
	});

	it("throws the default message for null", () => {
		expect(() => assertDefined(null)).toThrow("Expected value to be defined");
	});

	it("throws the default message for undefined", () => {
		expect(() => assertDefined(undefined)).toThrow("Expected value to be defined");
	});

	it("throws a custom message when provided", () => {
		expect(() => assertDefined(null, "Custom error")).toThrow("Custom error");
	});

	it("throws a custom message for undefined when provided", () => {
		expect(() => assertDefined(undefined, "Missing value")).toThrow("Missing value");
	});
});
