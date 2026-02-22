import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiNetworkError } from "../../../errors/api.error.js";

describe("typedFetch", () => {
	let mockFetch: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mockFetch = vi.fn();
		vi.stubGlobal("fetch", mockFetch);
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
		vi.useRealTimers();
	});

	async function loadTypedFetch() {
		const mod = await import("../../../utils/fetch.js");
		return mod.typedFetch;
	}

	it("returns parsed JSON on successful fetch", async () => {
		const data = { prayer: "Fajr", time: "05:30" };
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve(data),
		});

		const typedFetch = await loadTypedFetch();
		const result = await typedFetch<typeof data>("https://api.example.com/data");
		expect(result).toEqual(data);
		expect(mockFetch).toHaveBeenCalledTimes(1);
	});

	it("passes AbortController signal to fetch", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve({}),
		});

		const typedFetch = await loadTypedFetch();
		await typedFetch("https://api.example.com/data");
		expect(mockFetch).toHaveBeenCalledWith(
			"https://api.example.com/data",
			expect.objectContaining({ signal: expect.any(AbortSignal) }),
		);
	});

	it("throws ApiNetworkError on non-2xx HTTP status", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: false,
			status: 500,
			statusText: "Internal Server Error",
			json: () => Promise.resolve({}),
		});

		const typedFetch = await loadTypedFetch();
		await expect(typedFetch("https://api.example.com/data", { retries: 0 })).rejects.toThrow(
			ApiNetworkError,
		);
	});

	it("includes HTTP status in the error message", async () => {
		mockFetch.mockResolvedValueOnce({
			ok: false,
			status: 500,
			statusText: "Internal Server Error",
			json: () => Promise.resolve({}),
		});

		const typedFetch = await loadTypedFetch();
		await expect(typedFetch("https://api.example.com/data", { retries: 0 })).rejects.toThrow(
			"HTTP 500: Internal Server Error",
		);
	});

	it("throws ApiNetworkError on network error with retries: 0", async () => {
		mockFetch.mockRejectedValueOnce(new Error("network failure"));

		const typedFetch = await loadTypedFetch();
		await expect(typedFetch("https://api.example.com/data", { retries: 0 })).rejects.toThrow(
			ApiNetworkError,
		);
	});

	it("includes original error message after retries exhausted", async () => {
		mockFetch.mockRejectedValueOnce(new Error("connection refused"));

		const typedFetch = await loadTypedFetch();
		await expect(typedFetch("https://api.example.com/data", { retries: 0 })).rejects.toThrow(
			"connection refused",
		);
	});

	it("retries on network error and succeeds on retry", async () => {
		vi.useFakeTimers();
		const data = { success: true };
		mockFetch.mockRejectedValueOnce(new Error("network failure")).mockResolvedValueOnce({
			ok: true,
			json: () => Promise.resolve(data),
		});

		const typedFetch = await loadTypedFetch();
		const promise = typedFetch("https://api.example.com/data", { retries: 1 });

		await vi.advanceTimersByTimeAsync(1_000);

		const result = await promise;
		expect(result).toEqual(data);
		expect(mockFetch).toHaveBeenCalledTimes(2);
	});

	it("retries on non-2xx status and succeeds on retry", async () => {
		vi.useFakeTimers();
		const data = { retried: true };
		mockFetch
			.mockResolvedValueOnce({
				ok: false,
				status: 503,
				statusText: "Service Unavailable",
			})
			.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(data),
			});

		const typedFetch = await loadTypedFetch();
		const promise = typedFetch("https://api.example.com/data", { retries: 1 });

		await vi.advanceTimersByTimeAsync(1_000);

		const result = await promise;
		expect(result).toEqual(data);
		expect(mockFetch).toHaveBeenCalledTimes(2);
	});

	it("uses default retries of 1 (initial + 1 retry = 2 calls)", async () => {
		mockFetch
			.mockResolvedValueOnce({
				ok: false,
				status: 502,
				statusText: "Bad Gateway",
			})
			.mockResolvedValueOnce({
				ok: false,
				status: 502,
				statusText: "Bad Gateway",
			});

		vi.useFakeTimers();
		const typedFetch = await loadTypedFetch();
		const promise = typedFetch("https://api.example.com/data");

		// Attach the rejection handler before advancing timers to prevent unhandled rejection
		const assertion = expect(promise).rejects.toThrow(ApiNetworkError);
		await vi.runAllTimersAsync();
		await assertion;

		expect(mockFetch).toHaveBeenCalledTimes(2);
	});
});

describe("fetchJson", () => {
	let mockFetch: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mockFetch = vi.fn();
		vi.stubGlobal("fetch", mockFetch);
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.unstubAllGlobals();
	});

	async function loadFetchJson() {
		const mod = await import("../../../utils/fetch.js");
		return mod.fetchJson;
	}

	it("returns parsed JSON on success", async () => {
		const data = { timings: { Fajr: "05:30" } };
		mockFetch.mockResolvedValueOnce({
			json: () => Promise.resolve(data),
		});

		const fetchJson = await loadFetchJson();
		const result = await fetchJson("https://api.example.com/data");
		expect(result).toEqual(data);
	});

	it("throws on network error", async () => {
		mockFetch.mockRejectedValueOnce(new Error("network error"));

		const fetchJson = await loadFetchJson();
		await expect(fetchJson("https://api.example.com/data")).rejects.toThrow("network error");
	});

	it("throws on invalid JSON", async () => {
		mockFetch.mockResolvedValueOnce({
			json: () => Promise.reject(new SyntaxError("Unexpected token")),
		});

		const fetchJson = await loadFetchJson();
		await expect(fetchJson("https://api.example.com/data")).rejects.toThrow(SyntaxError);
	});
});
