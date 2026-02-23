import { describe, expect, it } from "vitest";
import { getErrorMessage } from "../../../utils/error.js";

describe("getErrorMessage", () => {
	it("should return the message from an Error instance", () => {
		const error = new Error("something went wrong");
		expect(getErrorMessage(error)).toBe("something went wrong");
	});

	it("should return the message from an Error subclass", () => {
		const error = new TypeError("type mismatch");
		expect(getErrorMessage(error)).toBe("type mismatch");
	});

	it("should return 'unknown error' for a string input", () => {
		expect(getErrorMessage("some string")).toBe("unknown error");
	});

	it("should return 'unknown error' for null", () => {
		expect(getErrorMessage(null)).toBe("unknown error");
	});

	it("should return 'unknown error' for undefined", () => {
		expect(getErrorMessage(undefined)).toBe("unknown error");
	});

	it("should return 'unknown error' for a number", () => {
		expect(getErrorMessage(42)).toBe("unknown error");
	});

	it("should return 'unknown error' for an object", () => {
		expect(getErrorMessage({ message: "not an Error" })).toBe("unknown error");
	});
});
