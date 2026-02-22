import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { CacheRepository } from "../../../repositories/cache.repository.js";
import { CacheService } from "../../../services/cache.service.js";

describe("CacheService", () => {
	let cacheDir: string;
	let service: CacheService;

	beforeEach(() => {
		cacheDir = mkdtempSync(join(tmpdir(), "cache-test-"));
		service = new CacheService(new CacheRepository(cacheDir));
	});

	afterEach(() => {
		rmSync(cacheDir, { recursive: true, force: true });
	});

	it("should return null for missing keys", () => {
		expect(service.get("nonexistent")).toBeNull();
	});

	it("should store and retrieve data", () => {
		service.set("test-key", { foo: "bar" }, 60_000);
		expect(service.get("test-key")).toEqual({ foo: "bar" });
	});

	it("should delete entries", () => {
		service.set("to-delete", 42, 60_000);
		expect(service.delete("to-delete")).toBe(true);
		expect(service.get("to-delete")).toBeNull();
	});

	it("should return false when deleting non-existent entries", () => {
		expect(service.delete("nonexistent")).toBe(false);
	});

	it("should clear all entries", () => {
		service.set("a", 1, 60_000);
		service.set("b", 2, 60_000);
		service.clear();
		expect(service.get("a")).toBeNull();
		expect(service.get("b")).toBeNull();
	});

	it("should build deterministic timings keys", () => {
		const key = service.buildTimingsKey({
			city: "Lahore",
			country: "Pakistan",
			method: 1,
			school: 1,
			date: "2026-03-01",
		});
		expect(key).toBe("timings:Lahore:Pakistan:1:1:2026-03-01");
	});

	it("should build deterministic calendar keys", () => {
		const key = service.buildCalendarKey({
			city: "Lahore",
			country: "Pakistan",
			method: 1,
			school: 1,
			year: 1447,
		});
		expect(key).toBe("calendar:Lahore:Pakistan:1:1:1447");
	});

	it("should build deterministic geo keys", () => {
		expect(service.buildGeoKey("ip-api")).toBe("geo:ip:ip-api");
	});

	it("should prune expired entries and return the count", () => {
		// Set two entries with very short TTLs that will be expired by the time we prune
		service.set("expired-a", "value-a", 1); // 1ms TTL
		service.set("expired-b", "value-b", 1); // 1ms TTL
		service.set("still-valid", "value-c", 60_000); // 60s TTL

		// Wait a tiny bit so the 1ms entries expire
		const start = Date.now();
		while (Date.now() - start < 10) {
			// busy-wait ~10ms
		}

		const pruned = service.pruneExpired();
		expect(pruned).toBeGreaterThanOrEqual(2);
		expect(service.get("expired-a")).toBeNull();
		expect(service.get("expired-b")).toBeNull();
		expect(service.get("still-valid")).toBe("value-c");
	});
});
