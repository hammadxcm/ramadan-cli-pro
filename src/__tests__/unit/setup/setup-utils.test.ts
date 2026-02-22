import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { METHOD_OPTIONS } from "../../../data/calculation-methods.js";
import { canPromptInteractively, getMethodOptions } from "../../../setup/setup.utils.js";

describe("canPromptInteractively", () => {
	const originalStdinIsTTY = process.stdin.isTTY;
	const originalStdoutIsTTY = process.stdout.isTTY;
	const originalCI = process.env.CI;

	afterEach(() => {
		Object.defineProperty(process.stdin, "isTTY", {
			value: originalStdinIsTTY,
			writable: true,
			configurable: true,
		});
		Object.defineProperty(process.stdout, "isTTY", {
			value: originalStdoutIsTTY,
			writable: true,
			configurable: true,
		});
		if (originalCI === undefined) {
			process.env.CI = undefined;
		} else {
			process.env.CI = originalCI;
		}
	});

	it("returns true when stdin.isTTY=true, stdout.isTTY=true, CI not set", () => {
		Object.defineProperty(process.stdin, "isTTY", {
			value: true,
			writable: true,
			configurable: true,
		});
		Object.defineProperty(process.stdout, "isTTY", {
			value: true,
			writable: true,
			configurable: true,
		});
		process.env.CI = undefined;
		expect(canPromptInteractively()).toBe(true);
	});

	it("returns false when stdin.isTTY is false", () => {
		Object.defineProperty(process.stdin, "isTTY", {
			value: false,
			writable: true,
			configurable: true,
		});
		Object.defineProperty(process.stdout, "isTTY", {
			value: true,
			writable: true,
			configurable: true,
		});
		process.env.CI = undefined;
		expect(canPromptInteractively()).toBe(false);
	});

	it("returns false when stdout.isTTY is false", () => {
		Object.defineProperty(process.stdin, "isTTY", {
			value: true,
			writable: true,
			configurable: true,
		});
		Object.defineProperty(process.stdout, "isTTY", {
			value: false,
			writable: true,
			configurable: true,
		});
		process.env.CI = undefined;
		expect(canPromptInteractively()).toBe(false);
	});

	it("returns false when stdin.isTTY is undefined", () => {
		Object.defineProperty(process.stdin, "isTTY", {
			value: undefined,
			writable: true,
			configurable: true,
		});
		Object.defineProperty(process.stdout, "isTTY", {
			value: true,
			writable: true,
			configurable: true,
		});
		process.env.CI = undefined;
		expect(canPromptInteractively()).toBe(false);
	});

	it("returns false when CI=true", () => {
		Object.defineProperty(process.stdin, "isTTY", {
			value: true,
			writable: true,
			configurable: true,
		});
		Object.defineProperty(process.stdout, "isTTY", {
			value: true,
			writable: true,
			configurable: true,
		});
		process.env.CI = "true";
		expect(canPromptInteractively()).toBe(false);
	});

	it("returns true when CI is set to something other than 'true'", () => {
		Object.defineProperty(process.stdin, "isTTY", {
			value: true,
			writable: true,
			configurable: true,
		});
		Object.defineProperty(process.stdout, "isTTY", {
			value: true,
			writable: true,
			configurable: true,
		});
		process.env.CI = "false";
		expect(canPromptInteractively()).toBe(true);
	});
});

describe("getMethodOptions", () => {
	it("returns METHOD_OPTIONS unchanged when recommendedMethod is null", () => {
		const result = getMethodOptions(null);
		expect(result).toBe(METHOD_OPTIONS);
	});

	it("puts recommended method first with '(Recommended)' label", () => {
		const result = getMethodOptions(2);
		expect(result[0]?.value).toBe(2);
		expect(result[0]?.label).toContain("ISNA (North America)");
		expect(result[0]?.label).toContain("(Recommended)");
	});

	it("adds 'Based on your country' hint to recommended method", () => {
		const result = getMethodOptions(2);
		expect(result[0]?.hint).toBe("Based on your country");
	});

	it("does not include the recommended method in the remaining list", () => {
		const result = getMethodOptions(2);
		const remaining = result.slice(1);
		const duplicate = remaining.find((o) => o.value === 2);
		expect(duplicate).toBeUndefined();
	});

	it("total count equals METHOD_OPTIONS length when method exists in list", () => {
		const result = getMethodOptions(1);
		expect(result).toHaveLength(METHOD_OPTIONS.length);
	});

	it("handles method ID not in the original list", () => {
		const result = getMethodOptions(99);
		expect(result[0]?.value).toBe(99);
		expect(result[0]?.label).toBe("Method 99 (Recommended)");
		expect(result[0]?.hint).toBe("Based on your country");
		// All original options remain since 99 is not in the list
		expect(result).toHaveLength(METHOD_OPTIONS.length + 1);
	});
});
