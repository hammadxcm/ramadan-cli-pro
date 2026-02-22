import { describe, expect, it } from "vitest";
import { err, fromPromise, ok } from "../../../utils/result.js";

describe("ok", () => {
	it("creates a result with ok: true and a string value", () => {
		const result = ok("hello");
		expect(result).toEqual({ ok: true, value: "hello" });
	});

	it("creates a result with ok: true and a number value", () => {
		const result = ok(42);
		expect(result).toEqual({ ok: true, value: 42 });
	});

	it("creates a result with ok: true and an object value", () => {
		const obj = { key: "value" };
		const result = ok(obj);
		expect(result).toEqual({ ok: true, value: obj });
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.value).toBe(obj);
		}
	});

	it("creates a result with ok: true and null value", () => {
		const result = ok(null);
		expect(result).toEqual({ ok: true, value: null });
	});
});

describe("err", () => {
	it("creates a result with ok: false and an Error", () => {
		const error = new Error("something went wrong");
		const result = err(error);
		expect(result).toEqual({ ok: false, error });
		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.error).toBe(error);
		}
	});

	it("creates a result with ok: false and a string error", () => {
		const result = err("bad input");
		expect(result).toEqual({ ok: false, error: "bad input" });
	});
});

describe("fromPromise", () => {
	it("resolves to ok for a successful promise", async () => {
		const result = await fromPromise(Promise.resolve(42));
		expect(result).toEqual({ ok: true, value: 42 });
	});

	it("resolves to ok with complex value", async () => {
		const data = { name: "test" };
		const result = await fromPromise(Promise.resolve(data));
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.value).toEqual(data);
		}
	});

	it("resolves to err for a rejected promise with Error", async () => {
		const error = new Error("fail");
		const result = await fromPromise(Promise.reject(error));
		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.error).toBe(error);
			expect(result.error.message).toBe("fail");
		}
	});

	it("wraps non-Error rejections in a new Error", async () => {
		const result = await fromPromise(Promise.reject("string rejection"));
		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.error).toBeInstanceOf(Error);
			expect(result.error.message).toBe("string rejection");
		}
	});

	it("wraps numeric rejections in a new Error", async () => {
		const result = await fromPromise(Promise.reject(404));
		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.error).toBeInstanceOf(Error);
			expect(result.error.message).toBe("404");
		}
	});
});
