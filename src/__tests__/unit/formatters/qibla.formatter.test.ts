import { describe, expect, it } from "vitest";
import { formatQiblaOutput } from "../../../formatters/qibla.formatter.js";
import type { QiblaFormatData } from "../../../formatters/qibla.formatter.js";

describe("formatQiblaOutput", () => {
	const baseData: QiblaFormatData = {
		direction: 0,
		latitude: 40.7128,
		longitude: -74.006,
		location: "New York, US",
	};

	describe("cardinal directions", () => {
		it("should show North (N) for bearing 0", () => {
			const output = formatQiblaOutput({ ...baseData, direction: 0 });
			expect(output).toContain("(N)");
		});

		it("should show East (E) for bearing 90", () => {
			const output = formatQiblaOutput({ ...baseData, direction: 90 });
			expect(output).toContain("(E)");
		});

		it("should show South (S) for bearing 180", () => {
			const output = formatQiblaOutput({ ...baseData, direction: 180 });
			expect(output).toContain("(S)");
		});

		it("should show West (W) for bearing 270", () => {
			const output = formatQiblaOutput({ ...baseData, direction: 270 });
			expect(output).toContain("(W)");
		});

		it("should show NE for bearing 45", () => {
			const output = formatQiblaOutput({ ...baseData, direction: 45 });
			expect(output).toContain("(NE)");
		});

		it("should show SE for bearing 135", () => {
			const output = formatQiblaOutput({ ...baseData, direction: 135 });
			expect(output).toContain("(SE)");
		});

		it("should show SW for bearing 225", () => {
			const output = formatQiblaOutput({ ...baseData, direction: 225 });
			expect(output).toContain("(SW)");
		});

		it("should show NW for bearing 315", () => {
			const output = formatQiblaOutput({ ...baseData, direction: 315 });
			expect(output).toContain("(NW)");
		});

		it("should show N for bearing 360 (wraps around)", () => {
			const output = formatQiblaOutput({ ...baseData, direction: 360 });
			expect(output).toContain("(N)");
		});

		it("should handle negative degrees", () => {
			// -90 should normalize to 270 => W
			const output = formatQiblaOutput({ ...baseData, direction: -90 });
			expect(output).toContain("(W)");
		});
	});

	describe("location display", () => {
		it("should contain the location string", () => {
			const output = formatQiblaOutput(baseData);
			expect(output).toContain("New York, US");
		});

		it("should display different locations", () => {
			const data: QiblaFormatData = {
				direction: 58.5,
				latitude: 24.8607,
				longitude: 67.0011,
				location: "Karachi, Pakistan",
			};
			const output = formatQiblaOutput(data);
			expect(output).toContain("Karachi, Pakistan");
		});
	});

	describe("bearing degrees", () => {
		it("should contain bearing in degrees with 2 decimal places", () => {
			const output = formatQiblaOutput({ ...baseData, direction: 58.49 });
			expect(output).toContain("58.49");
		});

		it("should format whole numbers with .00", () => {
			const output = formatQiblaOutput({ ...baseData, direction: 90 });
			expect(output).toContain("90.00");
		});

		it("should contain the degree symbol", () => {
			const output = formatQiblaOutput(baseData);
			expect(output).toContain("\u00B0");
		});

		it("should contain the Bearing label", () => {
			const output = formatQiblaOutput(baseData);
			expect(output).toContain("Bearing:");
		});
	});

	describe("Kaaba reference", () => {
		it("should contain 'Kaaba, Mecca' in the output", () => {
			const output = formatQiblaOutput(baseData);
			expect(output).toContain("Kaaba, Mecca");
		});

		it("should contain the Towards label", () => {
			const output = formatQiblaOutput(baseData);
			expect(output).toContain("Towards:");
		});
	});

	describe("coordinates display", () => {
		it("should contain latitude with 4 decimal places", () => {
			const output = formatQiblaOutput(baseData);
			expect(output).toContain("40.7128");
		});

		it("should contain longitude with 4 decimal places", () => {
			const output = formatQiblaOutput(baseData);
			expect(output).toContain("-74.0060");
		});

		it("should contain the From label", () => {
			const output = formatQiblaOutput(baseData);
			expect(output).toContain("From:");
		});
	});

	describe("compass display", () => {
		it("should contain compass cardinal points", () => {
			const output = formatQiblaOutput(baseData);
			expect(output).toContain("N");
			expect(output).toContain("S");
			expect(output).toContain("E");
			expect(output).toContain("W");
		});

		it("should contain the Qibla Direction title", () => {
			const output = formatQiblaOutput(baseData);
			expect(output).toContain("Qibla Direction");
		});
	});

	describe("edge cases", () => {
		it("should handle very small bearing", () => {
			const output = formatQiblaOutput({ ...baseData, direction: 0.01 });
			expect(output).toContain("0.01");
			expect(output).toContain("(N)");
		});

		it("should handle bearing just below 360", () => {
			const output = formatQiblaOutput({ ...baseData, direction: 359.99 });
			expect(output).toContain("359.99");
			expect(output).toContain("(N)");
		});

		it("should handle zero coordinates", () => {
			const data: QiblaFormatData = {
				direction: 90,
				latitude: 0,
				longitude: 0,
				location: "Gulf of Guinea",
			};
			const output = formatQiblaOutput(data);
			expect(output).toContain("0.0000, 0.0000");
			expect(output).toContain("Gulf of Guinea");
		});
	});

	describe("arrow direction coverage", () => {
		it("should render NW arrow for bearing 300 (292.5-337.5 range)", () => {
			const output = formatQiblaOutput({ ...baseData, direction: 300 });
			expect(output).toContain("(NW)");
			// The arrow character for NW is \u2196
			expect(output).toContain("\u2196");
		});

		it("should render N arrow for bearing 350 (>=337.5)", () => {
			const output = formatQiblaOutput({ ...baseData, direction: 350 });
			expect(output).toContain("(N)");
			expect(output).toContain("\u2191");
		});

		it("should render NE arrow for bearing 30", () => {
			const output = formatQiblaOutput({ ...baseData, direction: 30 });
			expect(output).toContain("\u2197");
		});

		it("should render E arrow for bearing 90", () => {
			const output = formatQiblaOutput({ ...baseData, direction: 90 });
			expect(output).toContain("\u2192");
		});

		it("should render SE arrow for bearing 130", () => {
			const output = formatQiblaOutput({ ...baseData, direction: 130 });
			expect(output).toContain("\u2198");
		});

		it("should render S arrow for bearing 180", () => {
			const output = formatQiblaOutput({ ...baseData, direction: 180 });
			expect(output).toContain("\u2193");
		});

		it("should render SW arrow for bearing 225", () => {
			const output = formatQiblaOutput({ ...baseData, direction: 225 });
			expect(output).toContain("\u2199");
		});

		it("should render W arrow for bearing 270", () => {
			const output = formatQiblaOutput({ ...baseData, direction: 270 });
			expect(output).toContain("\u2190");
		});
	});

	describe("compass direction fallback", () => {
		it("should return N for bearing that produces index 8 (wraps via modulo)", () => {
			// Math.round(360 / 45) = 8, 8 % 8 = 0 => COMPASS_POINTS[0] = "N"
			// This ensures the modulo wrap works correctly
			const output = formatQiblaOutput({ ...baseData, direction: 360 });
			expect(output).toContain("(N)");
		});

		it("should handle large positive degrees wrapping correctly", () => {
			// 720 degrees => normalized to 0 => N
			const output = formatQiblaOutput({ ...baseData, direction: 720 });
			expect(output).toContain("(N)");
		});

		it("should handle large negative degrees wrapping correctly", () => {
			// -720 degrees => normalized to 0 => N
			const output = formatQiblaOutput({ ...baseData, direction: -720 });
			expect(output).toContain("(N)");
		});
	});
});
