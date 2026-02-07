/**
 * @module repositories/cache
 * @description File-system-based cache repository that stores JSON entries
 * with TTL-based expiration under `~/.cache/ramadan-cli-pro/`.
 */

import { createHash } from "node:crypto";
import {
	existsSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	unlinkSync,
	writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

interface CacheEntry<T> {
	readonly data: T;
	readonly expiresAt: number;
	readonly createdAt: number;
}

/**
 * Persistent file-based cache keyed by SHA-256 hashes.
 * Each entry is stored as a separate JSON file with an expiration timestamp.
 *
 * @example
 * ```ts
 * const cache = new CacheRepository();
 * cache.set("key", { data: 42 }, 60_000);
 * const value = cache.get<{ data: number }>("key"); // { data: 42 }
 * ```
 */
export class CacheRepository {
	private readonly cacheDir: string;

	/**
	 * @param cacheDir - Override directory for cache files (defaults to `~/.cache/ramadan-cli-pro/prayer-timings`).
	 */
	constructor(cacheDir?: string) {
		this.cacheDir = cacheDir ?? join(homedir(), ".cache", "ramadan-cli-pro", "prayer-timings");
		this.ensureCacheDir();
	}

	private ensureCacheDir(): void {
		if (!existsSync(this.cacheDir)) {
			mkdirSync(this.cacheDir, { recursive: true });
		}
	}

	private hashKey(key: string): string {
		return createHash("sha256").update(key).digest("hex");
	}

	private filePath(key: string): string {
		return join(this.cacheDir, `${this.hashKey(key)}.json`);
	}

	/**
	 * Retrieves a cached value by key. Returns `null` if the entry is missing or expired.
	 *
	 * @typeParam T - The expected type of the cached data.
	 * @param key - The cache key.
	 * @returns The cached data, or `null`.
	 */
	get<T>(key: string): T | null {
		const path = this.filePath(key);
		if (!existsSync(path)) {
			return null;
		}

		try {
			const raw = readFileSync(path, "utf-8");
			const entry = JSON.parse(raw) as CacheEntry<T>;
			if (Date.now() > entry.expiresAt) {
				unlinkSync(path);
				return null;
			}
			return entry.data;
		} catch {
			return null;
		}
	}

	/**
	 * Stores a value in the cache with a time-to-live.
	 *
	 * @typeParam T - The type of the data to cache.
	 * @param key - The cache key.
	 * @param data - The data to store.
	 * @param ttlMs - Time-to-live in milliseconds.
	 */
	set<T>(key: string, data: T, ttlMs: number): void {
		const entry: CacheEntry<T> = {
			data,
			expiresAt: Date.now() + ttlMs,
			createdAt: Date.now(),
		};

		const path = this.filePath(key);
		writeFileSync(path, JSON.stringify(entry), "utf-8");
	}

	/**
	 * Deletes a single cache entry.
	 *
	 * @param key - The cache key to delete.
	 * @returns `true` if the entry existed and was deleted, `false` otherwise.
	 */
	delete(key: string): boolean {
		const path = this.filePath(key);
		if (!existsSync(path)) {
			return false;
		}
		unlinkSync(path);
		return true;
	}

	/**
	 * Removes all cached entries.
	 */
	clear(): void {
		if (!existsSync(this.cacheDir)) {
			return;
		}

		const files = readdirSync(this.cacheDir);
		for (const file of files) {
			if (file.endsWith(".json")) {
				unlinkSync(join(this.cacheDir, file));
			}
		}
	}

	/**
	 * Removes all expired entries from the cache directory.
	 *
	 * @returns The number of entries pruned.
	 */
	pruneExpired(): number {
		if (!existsSync(this.cacheDir)) {
			return 0;
		}

		let count = 0;
		const files = readdirSync(this.cacheDir);
		for (const file of files) {
			if (!file.endsWith(".json")) continue;
			const path = join(this.cacheDir, file);
			try {
				const raw = readFileSync(path, "utf-8");
				const entry = JSON.parse(raw) as CacheEntry<unknown>;
				if (Date.now() > entry.expiresAt) {
					unlinkSync(path);
					count++;
				}
			} catch {
				unlinkSync(path);
				count++;
			}
		}
		return count;
	}
}
