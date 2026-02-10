/**
 * @module services/cache
 * @description Application-level caching service that wraps {@link CacheRepository}
 * and provides domain-specific cache key builders with predefined TTLs.
 */

import type { CacheRepository } from "../repositories/cache.repository.js";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

/**
 * Predefined cache time-to-live durations.
 * @readonly
 */
export const CACHE_TTL = {
	/** 6 hours for single-day prayer timings. */
	SINGLE_DAY_TIMINGS: 6 * HOUR,
	/** 24 hours for full Ramadan calendars. */
	FULL_CALENDAR: 24 * HOUR,
	/** 1 hour for geo-IP lookups. */
	GEO_IP: 1 * HOUR,
	/** 7 days for calculation methods (rarely change). */
	METHODS: 7 * DAY,
} as const;

/**
 * Thin service layer over {@link CacheRepository} that adds domain-specific key builders.
 */
export class CacheService {
	/**
	 * @param cacheRepository - The underlying file-based cache repository.
	 */
	constructor(private readonly cacheRepository: CacheRepository) {}

	/**
	 * Retrieves a cached value.
	 *
	 * @typeParam T - Expected type of the cached data.
	 * @param key - Cache key.
	 * @returns Cached data or `null` if missing/expired.
	 */
	get<T>(key: string): T | null {
		return this.cacheRepository.get<T>(key);
	}

	/**
	 * Stores a value in the cache.
	 *
	 * @typeParam T - Type of the data to cache.
	 * @param key - Cache key.
	 * @param data - Data to store.
	 * @param ttlMs - Time-to-live in milliseconds.
	 */
	set<T>(key: string, data: T, ttlMs: number): void {
		this.cacheRepository.set(key, data, ttlMs);
	}

	/**
	 * Deletes a single cache entry.
	 *
	 * @param key - Cache key to delete.
	 * @returns `true` if the entry existed and was removed.
	 */
	delete(key: string): boolean {
		return this.cacheRepository.delete(key);
	}

	/**
	 * Removes all cached entries.
	 */
	clear(): void {
		this.cacheRepository.clear();
	}

	/**
	 * Removes all expired entries.
	 *
	 * @returns Number of entries pruned.
	 */
	pruneExpired(): number {
		return this.cacheRepository.pruneExpired();
	}

	/**
	 * Builds a cache key for a single-day prayer timing lookup.
	 *
	 * @param params - City, country, method, school, and date identifying the entry.
	 * @returns A deterministic cache key string.
	 */
	buildTimingsKey(params: {
		city: string;
		country: string;
		method: number;
		school: number;
		date: string;
	}): string {
		return `timings:${params.city}:${params.country}:${params.method}:${params.school}:${params.date}`;
	}

	/**
	 * Builds a cache key for a full-year calendar lookup.
	 *
	 * @param params - City, country, method, school, and year identifying the entry.
	 * @returns A deterministic cache key string.
	 */
	buildCalendarKey(params: {
		city: string;
		country: string;
		method: number;
		school: number;
		year: number;
	}): string {
		return `calendar:${params.city}:${params.country}:${params.method}:${params.school}:${params.year}`;
	}

	/**
	 * Builds a cache key for a geo-IP provider result.
	 *
	 * @param provider - Provider name (e.g. `"ip-api"`).
	 * @returns A deterministic cache key string.
	 */
	buildGeoKey(provider: string): string {
		return `geo:ip:${provider}`;
	}
}
