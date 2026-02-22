import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CacheRepository } from "../../../repositories/cache.repository.js";

describe("CacheRepository", () => {
	let cacheDir: string;
	let repo: CacheRepository;

	beforeEach(() => {
		cacheDir = mkdtempSync(join(tmpdir(), "cache-repo-test-"));
		repo = new CacheRepository(cacheDir);
	});

	afterEach(() => {
		rmSync(cacheDir, { recursive: true, force: true });
	});

	describe("get", () => {
		it("should return null for a missing key", () => {
			expect(repo.get("nonexistent")).toBeNull();
		});
	});

	describe("set + get", () => {
		it("should round-trip a stored value", () => {
			repo.set("test-key", { value: 42 }, 60_000);
			expect(repo.get<{ value: number }>("test-key")).toEqual({ value: 42 });
		});

		it("should round-trip a string value", () => {
			repo.set("str-key", "hello", 60_000);
			expect(repo.get<string>("str-key")).toBe("hello");
		});

		it("should round-trip a numeric value", () => {
			repo.set("num-key", 123, 60_000);
			expect(repo.get<number>("num-key")).toBe(123);
		});
	});

	describe("expiration", () => {
		it("should return null for an expired entry", () => {
			vi.useFakeTimers();
			try {
				repo.set("expires-soon", "data", 1000);
				vi.advanceTimersByTime(2000);
				expect(repo.get("expires-soon")).toBeNull();
			} finally {
				vi.useRealTimers();
			}
		});

		it("should return data for a not-yet-expired entry", () => {
			vi.useFakeTimers();
			try {
				repo.set("still-valid", "data", 10_000);
				vi.advanceTimersByTime(5000);
				expect(repo.get("still-valid")).toBe("data");
			} finally {
				vi.useRealTimers();
			}
		});
	});

	describe("delete", () => {
		it("should return true for an existing key", () => {
			repo.set("to-delete", "value", 60_000);
			expect(repo.delete("to-delete")).toBe(true);
		});

		it("should return false for a missing key", () => {
			expect(repo.delete("nonexistent")).toBe(false);
		});

		it("should make the key unresolvable after deletion", () => {
			repo.set("to-delete", "value", 60_000);
			repo.delete("to-delete");
			expect(repo.get("to-delete")).toBeNull();
		});
	});

	describe("clear", () => {
		it("should remove all entries", () => {
			repo.set("a", 1, 60_000);
			repo.set("b", 2, 60_000);
			repo.set("c", 3, 60_000);
			repo.clear();
			expect(repo.get("a")).toBeNull();
			expect(repo.get("b")).toBeNull();
			expect(repo.get("c")).toBeNull();
		});
	});

	describe("pruneExpired", () => {
		it("should remove expired entries and return the count", () => {
			vi.useFakeTimers();
			try {
				repo.set("expired-1", "data1", 1000);
				repo.set("expired-2", "data2", 1000);
				repo.set("still-valid", "data3", 60_000);

				vi.advanceTimersByTime(2000);

				const pruned = repo.pruneExpired();
				expect(pruned).toBe(2);
				expect(repo.get("still-valid")).toBe("data3");
			} finally {
				vi.useRealTimers();
			}
		});

		it("should return 0 when no entries are expired", () => {
			repo.set("a", 1, 60_000);
			repo.set("b", 2, 60_000);
			expect(repo.pruneExpired()).toBe(0);
		});

		it("should return 0 when cache is empty", () => {
			expect(repo.pruneExpired()).toBe(0);
		});
	});
});
