import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CacheRepository } from "../../../repositories/cache.repository.js";

describe("CacheRepository – extended coverage", () => {
	let cacheDir: string;

	beforeEach(() => {
		cacheDir = mkdtempSync(join(tmpdir(), "cache-repo-ext-test-"));
	});

	afterEach(() => {
		rmSync(cacheDir, { recursive: true, force: true });
	});

	it("get returns null when cache file contains corrupt JSON", () => {
		const repo = new CacheRepository(cacheDir);

		// Store a valid entry first, then overwrite its file with garbage
		repo.set("good-key", "data", 60_000);

		// Find the file and corrupt it
		const { readdirSync } = require("node:fs") as typeof import("node:fs");
		const files = readdirSync(cacheDir).filter((f: string) => f.endsWith(".json"));
		expect(files.length).toBe(1);
		const cacheFile = files[0] ?? "fallback.json";
		writeFileSync(join(cacheDir, cacheFile), "<<<not valid json>>>", "utf-8");

		// get should catch the parse error and return null
		expect(repo.get("good-key")).toBeNull();
	});

	it("clear does nothing when cache directory does not exist", () => {
		const nonExistentDir = join(cacheDir, "no-such-dir");
		const repo = new CacheRepository(nonExistentDir);
		// Remove the dir that the constructor created
		rmSync(nonExistentDir, { recursive: true, force: true });

		// clear should not throw when the dir is missing
		expect(() => repo.clear()).not.toThrow();
	});

	it("returns 0 when the cache directory does not exist", () => {
		const nonExistentDir = join(cacheDir, "does-not-exist");
		// Construct with a dir that is NOT auto-created because we remove it
		const repo = new CacheRepository(nonExistentDir);
		// CacheRepository constructor calls ensureCacheDir(), which creates it.
		// Remove it after construction so pruneExpired finds it missing.
		rmSync(nonExistentDir, { recursive: true, force: true });

		const pruned = repo.pruneExpired();
		expect(pruned).toBe(0);
	});

	it("skips non-JSON files during pruning", () => {
		vi.useFakeTimers();
		try {
			const repo = new CacheRepository(cacheDir);

			// Write a non-JSON file into the cache directory
			writeFileSync(join(cacheDir, "readme.txt"), "not a cache file", "utf-8");
			writeFileSync(join(cacheDir, "data.csv"), "a,b,c", "utf-8");

			// Add one entry that will expire
			repo.set("will-expire", "data", 1000);

			// Advance time so the entry is expired
			vi.advanceTimersByTime(2000);

			const pruned = repo.pruneExpired();
			// Only the expired JSON entry should be pruned, non-JSON files are ignored
			expect(pruned).toBe(1);
		} finally {
			vi.useRealTimers();
		}
	});

	it("handles corrupt JSON files in the catch block", () => {
		const repo = new CacheRepository(cacheDir);

		// Write a corrupt JSON file (invalid JSON content but .json extension)
		writeFileSync(join(cacheDir, "corrupt1.json"), "{{{invalid json", "utf-8");
		writeFileSync(join(cacheDir, "corrupt2.json"), "", "utf-8");

		const pruned = repo.pruneExpired();
		// Both corrupt files should be caught and removed (counted)
		expect(pruned).toBe(2);
	});

	it("handles a mix of expired, valid, corrupt, and non-JSON files", () => {
		vi.useFakeTimers();
		try {
			const repo = new CacheRepository(cacheDir);

			// Valid non-expired entry
			repo.set("still-valid", "data", 60_000);

			// Entry that will expire soon
			repo.set("expired-key", "old-data", 1000);

			// Corrupt JSON file
			writeFileSync(join(cacheDir, "broken.json"), "not-json!", "utf-8");

			// Non-JSON file (should be skipped)
			writeFileSync(join(cacheDir, "notes.txt"), "skip me", "utf-8");

			// Advance time so the short-lived entry expires but the long-lived one doesn't
			vi.advanceTimersByTime(2000);

			const pruned = repo.pruneExpired();
			// 1 expired + 1 corrupt = 2 pruned; valid entry and .txt file untouched
			expect(pruned).toBe(2);
			expect(repo.get("still-valid")).toBe("data");
		} finally {
			vi.useRealTimers();
		}
	});
});
