import { beforeEach, describe, expect, it, vi } from "vitest";
import { FirstRunSetup } from "../../../setup/first-run.setup.js";
import type { GeoLocation } from "../../../types/geo.js";
import { createMockConfigRepository, createMockGeocodingProvider } from "../../helpers/mocks.js";

vi.mock("@clack/prompts", () => ({
	intro: vi.fn(),
	outro: vi.fn(),
	cancel: vi.fn(),
	log: { error: vi.fn() },
	text: vi.fn(),
	select: vi.fn(),
	isCancel: vi.fn().mockReturnValue(false),
	spinner: vi.fn().mockReturnValue({
		start: vi.fn(),
		stop: vi.fn(),
	}),
}));

import { cancel, intro, isCancel, outro, select, spinner, text } from "@clack/prompts";

const mockedText = vi.mocked(text);
const mockedSelect = vi.mocked(select);
const mockedIsCancel = vi.mocked(isCancel);
const mockedIntro = vi.mocked(intro);
const mockedOutro = vi.mocked(outro);
const mockedSpinner = vi.mocked(spinner);

const DEFAULT_IP_GUESS: GeoLocation = {
	city: "Lahore",
	country: "Pakistan",
	latitude: 31.5497,
	longitude: 74.3436,
	timezone: "Asia/Karachi",
};

const DEFAULT_GEOCODED = {
	city: "Lahore",
	country: "Pakistan",
	latitude: 31.5497,
	longitude: 74.3436,
	timezone: "Asia/Karachi",
};

function createMockGeoProviderFactory(result: GeoLocation | null = DEFAULT_IP_GUESS) {
	return {
		detect: vi.fn().mockResolvedValue(result),
		getProviderNames: vi.fn().mockReturnValue(["mock"]),
	};
}

/**
 * Sets up the mocked prompts for a full happy-path run.
 * Prompt sequence:
 *   1. text (city) -> "Lahore"
 *   2. text (country) -> "Pakistan"
 *   3. select (method) -> 1
 *   4. select (school) -> 1
 *   5. select (timezone) -> "detected"
 */
function setupHappyPathPrompts() {
	mockedText
		.mockResolvedValueOnce("Lahore") // city
		.mockResolvedValueOnce("Pakistan"); // country

	mockedSelect
		.mockResolvedValueOnce(1) // method
		.mockResolvedValueOnce(1) // school
		.mockResolvedValueOnce("detected"); // timezone
}

describe("FirstRunSetup", () => {
	let configRepo: ReturnType<typeof createMockConfigRepository>;
	let geoFactory: ReturnType<typeof createMockGeoProviderFactory>;
	let geocodingProvider: ReturnType<typeof createMockGeocodingProvider>;
	let setup: FirstRunSetup;

	beforeEach(() => {
		vi.clearAllMocks();
		mockedIsCancel.mockReturnValue(false);

		configRepo = createMockConfigRepository();
		geoFactory = createMockGeoProviderFactory();
		geocodingProvider = createMockGeocodingProvider(DEFAULT_GEOCODED);
		setup = new FirstRunSetup(configRepo as never, geoFactory as never, geocodingProvider);
	});

	describe("happy path", () => {
		it("returns true when all prompts are answered", async () => {
			setupHappyPathPrompts();

			const result = await setup.run();

			expect(result).toBe(true);
		});

		it("calls intro with branded message", async () => {
			setupHappyPathPrompts();

			await setup.run();

			expect(mockedIntro).toHaveBeenCalledOnce();
		});

		it("calls outro on successful completion", async () => {
			setupHappyPathPrompts();

			await setup.run();

			expect(mockedOutro).toHaveBeenCalledOnce();
		});

		it("starts the IP detection spinner", async () => {
			setupHappyPathPrompts();

			await setup.run();

			expect(mockedSpinner).toHaveBeenCalled();
			const spinnerInstance = mockedSpinner.mock.results[0]?.value as {
				start: ReturnType<typeof vi.fn>;
				stop: ReturnType<typeof vi.fn>;
			};
			expect(spinnerInstance.start).toHaveBeenCalled();
			expect(spinnerInstance.stop).toHaveBeenCalled();
		});

		it("saves config with correct location values", async () => {
			setupHappyPathPrompts();

			await setup.run();

			expect(configRepo.setStoredLocation).toHaveBeenCalledWith(
				expect.objectContaining({
					city: "Lahore",
					country: "Pakistan",
					latitude: 31.5497,
					longitude: 74.3436,
				}),
			);
		});

		it("saves the selected method", async () => {
			setupHappyPathPrompts();

			await setup.run();

			expect(configRepo.setStoredMethod).toHaveBeenCalledWith(1);
		});

		it("saves the selected school", async () => {
			setupHappyPathPrompts();

			await setup.run();

			expect(configRepo.setStoredSchool).toHaveBeenCalledWith(1);
		});

		it("saves detected timezone when user picks 'detected'", async () => {
			setupHappyPathPrompts();

			await setup.run();

			expect(configRepo.setStoredTimezone).toHaveBeenCalledWith("Asia/Karachi");
		});
	});

	describe("cancellation", () => {
		it("returns false when user cancels at city prompt", async () => {
			const cancelSymbol = Symbol("cancel");
			mockedText.mockResolvedValueOnce(cancelSymbol as never);
			mockedIsCancel.mockImplementation((value) => value === cancelSymbol);

			const result = await setup.run();

			expect(result).toBe(false);
		});

		it("returns false when user cancels at country prompt", async () => {
			const cancelSymbol = Symbol("cancel");
			mockedText.mockResolvedValueOnce("Lahore").mockResolvedValueOnce(cancelSymbol as never);
			mockedIsCancel.mockImplementation((value) => value === cancelSymbol);

			const result = await setup.run();

			expect(result).toBe(false);
		});

		it("returns false when user cancels at method prompt", async () => {
			const cancelSymbol = Symbol("cancel");
			mockedText.mockResolvedValueOnce("Lahore").mockResolvedValueOnce("Pakistan");
			mockedSelect.mockResolvedValueOnce(cancelSymbol as never);
			mockedIsCancel.mockImplementation((value) => value === cancelSymbol);

			const result = await setup.run();

			expect(result).toBe(false);
		});

		it("returns false when user cancels at school prompt", async () => {
			const cancelSymbol = Symbol("cancel");
			mockedText.mockResolvedValueOnce("Lahore").mockResolvedValueOnce("Pakistan");
			mockedSelect.mockResolvedValueOnce(1).mockResolvedValueOnce(cancelSymbol as never);
			mockedIsCancel.mockImplementation((value) => value === cancelSymbol);

			const result = await setup.run();

			expect(result).toBe(false);
		});

		it("returns false when user cancels at timezone prompt", async () => {
			const cancelSymbol = Symbol("cancel");
			mockedText.mockResolvedValueOnce("Lahore").mockResolvedValueOnce("Pakistan");
			mockedSelect
				.mockResolvedValueOnce(1)
				.mockResolvedValueOnce(1)
				.mockResolvedValueOnce(cancelSymbol as never);
			mockedIsCancel.mockImplementation((value) => value === cancelSymbol);

			const result = await setup.run();

			expect(result).toBe(false);
		});
	});

	describe("IP detection failure", () => {
		it("still completes when IP detection returns null", async () => {
			geoFactory = createMockGeoProviderFactory(null);
			geocodingProvider = createMockGeocodingProvider(DEFAULT_GEOCODED);
			setup = new FirstRunSetup(configRepo as never, geoFactory as never, geocodingProvider);

			mockedText.mockResolvedValueOnce("Lahore").mockResolvedValueOnce("Pakistan");
			mockedSelect
				.mockResolvedValueOnce(1)
				.mockResolvedValueOnce(1)
				.mockResolvedValueOnce("detected");

			const result = await setup.run();

			expect(result).toBe(true);
		});

		it("shows 'Could not detect location' when IP detection fails", async () => {
			geoFactory = createMockGeoProviderFactory(null);
			setup = new FirstRunSetup(configRepo as never, geoFactory as never, geocodingProvider);

			setupHappyPathPrompts();

			await setup.run();

			const spinnerInstance = mockedSpinner.mock.results[0]?.value as {
				start: ReturnType<typeof vi.fn>;
				stop: ReturnType<typeof vi.fn>;
			};
			expect(spinnerInstance.stop).toHaveBeenCalledWith(
				expect.stringContaining("Could not detect location"),
			);
		});
	});

	describe("geocoding failure", () => {
		it("still completes when geocoding returns null", async () => {
			geocodingProvider = createMockGeocodingProvider(null);
			setup = new FirstRunSetup(configRepo as never, geoFactory as never, geocodingProvider);

			mockedText.mockResolvedValueOnce("UnknownCity").mockResolvedValueOnce("UnknownCountry");
			mockedSelect.mockResolvedValueOnce(2).mockResolvedValueOnce(0).mockResolvedValueOnce("skip");

			const result = await setup.run();

			expect(result).toBe(true);
		});

		it("does not include lat/lon when geocoding fails and city does not match IP guess", async () => {
			geocodingProvider = createMockGeocodingProvider(null);
			setup = new FirstRunSetup(configRepo as never, geoFactory as never, geocodingProvider);

			mockedText.mockResolvedValueOnce("DifferentCity").mockResolvedValueOnce("DifferentCountry");
			mockedSelect.mockResolvedValueOnce(2).mockResolvedValueOnce(0).mockResolvedValueOnce("skip");

			await setup.run();

			expect(configRepo.setStoredLocation).toHaveBeenCalledWith({
				city: "DifferentCity",
				country: "DifferentCountry",
			});
		});
	});

	describe("timezone options", () => {
		it("allows user to skip timezone", async () => {
			mockedText.mockResolvedValueOnce("Lahore").mockResolvedValueOnce("Pakistan");
			mockedSelect.mockResolvedValueOnce(1).mockResolvedValueOnce(1).mockResolvedValueOnce("skip");

			await setup.run();

			expect(configRepo.setStoredTimezone).toHaveBeenCalledWith(undefined);
		});

		it("allows user to enter custom timezone", async () => {
			mockedText
				.mockResolvedValueOnce("Lahore")
				.mockResolvedValueOnce("Pakistan")
				.mockResolvedValueOnce("America/New_York"); // custom timezone text
			mockedSelect
				.mockResolvedValueOnce(1)
				.mockResolvedValueOnce(1)
				.mockResolvedValueOnce("custom");

			const result = await setup.run();

			expect(result).toBe(true);
			expect(configRepo.setStoredTimezone).toHaveBeenCalledWith("America/New_York");
		});

		it("returns false when user cancels at custom timezone prompt", async () => {
			const cancelSymbol = Symbol("cancel");
			mockedText
				.mockResolvedValueOnce("Lahore")
				.mockResolvedValueOnce("Pakistan")
				.mockResolvedValueOnce(cancelSymbol as never); // cancel at timezone text
			mockedSelect
				.mockResolvedValueOnce(1)
				.mockResolvedValueOnce(1)
				.mockResolvedValueOnce("custom");
			mockedIsCancel.mockImplementation((value) => value === cancelSymbol);

			const result = await setup.run();

			expect(result).toBe(false);
		});
	});

	describe("geocoding falls back to IP guess when city/country matches", () => {
		it("uses IP guess coordinates when geocoding fails but city matches", async () => {
			geocodingProvider = createMockGeocodingProvider(null);
			setup = new FirstRunSetup(configRepo as never, geoFactory as never, geocodingProvider);

			// Use the same city/country as the IP guess
			mockedText.mockResolvedValueOnce("Lahore").mockResolvedValueOnce("Pakistan");
			mockedSelect
				.mockResolvedValueOnce(1)
				.mockResolvedValueOnce(1)
				.mockResolvedValueOnce("detected");

			await setup.run();

			expect(configRepo.setStoredLocation).toHaveBeenCalledWith(
				expect.objectContaining({
					city: "Lahore",
					country: "Pakistan",
					latitude: 31.5497,
					longitude: 74.3436,
				}),
			);
		});
	});

	describe("custom timezone without detected timezone", () => {
		it("allows custom timezone entry when no timezone was detected", async () => {
			// Use a geocoding provider that returns no timezone
			geocodingProvider = createMockGeocodingProvider({
				city: "SomeCity",
				country: "SomeCountry",
				latitude: 10,
				longitude: 20,
			});
			setup = new FirstRunSetup(configRepo as never, geoFactory as never, geocodingProvider);

			mockedText
				.mockResolvedValueOnce("SomeCity")
				.mockResolvedValueOnce("SomeCountry")
				.mockResolvedValueOnce("Europe/London"); // custom timezone text
			mockedSelect
				.mockResolvedValueOnce(2)
				.mockResolvedValueOnce(0)
				.mockResolvedValueOnce("custom");

			const result = await setup.run();

			expect(result).toBe(true);
			expect(configRepo.setStoredTimezone).toHaveBeenCalledWith("Europe/London");
		});

		it("passes no defaultValue/initialValue when detected timezone is absent", async () => {
			geocodingProvider = createMockGeocodingProvider({
				city: "SomeCity",
				country: "SomeCountry",
				latitude: 10,
				longitude: 20,
			});
			setup = new FirstRunSetup(configRepo as never, geoFactory as never, geocodingProvider);

			mockedText
				.mockResolvedValueOnce("SomeCity")
				.mockResolvedValueOnce("SomeCountry")
				.mockResolvedValueOnce("US/Eastern");
			mockedSelect
				.mockResolvedValueOnce(2)
				.mockResolvedValueOnce(0)
				.mockResolvedValueOnce("custom");

			await setup.run();

			// The third call to text() is the timezone prompt
			const timezoneCallArgs = mockedText.mock.calls[2]?.[0] as Record<string, unknown> | undefined;
			expect(timezoneCallArgs).toBeDefined();
			// When no detected timezone, placeholder should be the default
			expect(timezoneCallArgs?.placeholder).toBe("e.g., Asia/Karachi");
			// No defaultValue or initialValue should be set
			expect(timezoneCallArgs?.defaultValue).toBeUndefined();
			expect(timezoneCallArgs?.initialValue).toBeUndefined();
		});
	});

	describe("custom timezone validation callback", () => {
		it("validate callback rejects empty timezone input", async () => {
			mockedText
				.mockResolvedValueOnce("Lahore")
				.mockResolvedValueOnce("Pakistan")
				.mockResolvedValueOnce("Asia/Karachi");
			mockedSelect
				.mockResolvedValueOnce(1)
				.mockResolvedValueOnce(1)
				.mockResolvedValueOnce("custom");

			await setup.run();

			// Extract the validate function from the third text() call (timezone prompt)
			const timezoneCallArgs = mockedText.mock.calls[2]?.[0] as
				| { validate?: (value: string) => string | undefined }
				| undefined;
			const validate = timezoneCallArgs?.validate;
			expect(validate).toBeDefined();
			expect(validate?.("")).toBe("Timezone is required.");
			expect(validate?.("   ")).toBe("Timezone is required.");
			expect(validate?.("Asia/Karachi")).toBeUndefined();
		});
	});

	describe("validation edge cases", () => {
		it("returns false when city text prompt returns a non-string value", async () => {
			// toNonEmptyString returns null for non-string values
			mockedText.mockResolvedValueOnce(123 as never);

			const result = await setup.run();

			expect(result).toBe(false);
		});

		it("returns false when country text prompt returns a non-string value", async () => {
			mockedText.mockResolvedValueOnce("Lahore").mockResolvedValueOnce(456 as never);

			const result = await setup.run();

			expect(result).toBe(false);
		});

		it("returns false when method select returns a non-number value", async () => {
			mockedText.mockResolvedValueOnce("Lahore").mockResolvedValueOnce("Pakistan");
			// Return a string instead of a number for method
			mockedSelect.mockResolvedValueOnce("not-a-number" as never);

			const result = await setup.run();

			expect(result).toBe(false);
		});

		it("returns false when school select returns a non-number value", async () => {
			mockedText.mockResolvedValueOnce("Lahore").mockResolvedValueOnce("Pakistan");
			mockedSelect.mockResolvedValueOnce(1).mockResolvedValueOnce("not-a-number" as never);

			const result = await setup.run();

			expect(result).toBe(false);
		});

		it("returns false when timezone select returns an invalid value", async () => {
			mockedText.mockResolvedValueOnce("Lahore").mockResolvedValueOnce("Pakistan");
			mockedSelect
				.mockResolvedValueOnce(1)
				.mockResolvedValueOnce(1)
				.mockResolvedValueOnce("invalid-choice" as never);

			const result = await setup.run();

			expect(result).toBe(false);
		});

		it("returns false when custom timezone text returns a non-string value", async () => {
			mockedText
				.mockResolvedValueOnce("Lahore")
				.mockResolvedValueOnce("Pakistan")
				.mockResolvedValueOnce(789 as never); // non-string for custom timezone
			mockedSelect
				.mockResolvedValueOnce(1)
				.mockResolvedValueOnce(1)
				.mockResolvedValueOnce("custom");

			const result = await setup.run();

			expect(result).toBe(false);
		});
	});
});
