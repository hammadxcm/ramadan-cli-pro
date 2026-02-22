import { describe, expect, it } from "vitest";
import { GeoProviderFactory } from "../../../providers/geo/geo-provider.factory.js";
import type { IGeoProvider } from "../../../providers/geo/geo-provider.interface.js";
import type { GeoLocation } from "../../../types/geo.js";
import { sampleGeoLocation } from "../../helpers/fixtures.js";

const createMockProvider = (
	name: string,
	priority: number,
	result: GeoLocation | null,
): IGeoProvider => ({
	name,
	priority,
	detect: async () => result,
});

const createFailingProvider = (name: string, priority: number): IGeoProvider => ({
	name,
	priority,
	detect: async () => {
		throw new Error(`${name} failed`);
	},
});

describe("GeoProviderFactory", () => {
	it("should return the first successful result", async () => {
		const factory = new GeoProviderFactory([
			createMockProvider("provider-a", 1, sampleGeoLocation),
			createMockProvider("provider-b", 2, { ...sampleGeoLocation, city: "Other" }),
		]);

		const result = await factory.detect();
		expect(result).toEqual(sampleGeoLocation);
	});

	it("should fall back to next provider on null result", async () => {
		const factory = new GeoProviderFactory([
			createMockProvider("provider-a", 1, null),
			createMockProvider("provider-b", 2, sampleGeoLocation),
		]);

		const result = await factory.detect();
		expect(result).toEqual(sampleGeoLocation);
	});

	it("should return null when all providers fail", async () => {
		const factory = new GeoProviderFactory([
			createMockProvider("provider-a", 1, null),
			createMockProvider("provider-b", 2, null),
		]);

		const result = await factory.detect();
		expect(result).toBeNull();
	});

	it("should sort providers by priority", () => {
		const factory = new GeoProviderFactory([
			createMockProvider("low-priority", 3, null),
			createMockProvider("high-priority", 1, null),
			createMockProvider("medium-priority", 2, null),
		]);

		expect(factory.getProviderNames()).toEqual([
			"high-priority",
			"medium-priority",
			"low-priority",
		]);
	});

	it("should handle empty provider list", async () => {
		const factory = new GeoProviderFactory([]);
		const result = await factory.detect();
		expect(result).toBeNull();
		expect(factory.getProviderNames()).toEqual([]);
	});
});
