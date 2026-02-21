/**
 * @module formatters/qibla
 * @description ASCII compass formatter for Qibla direction display.
 */

import pc from "picocolors";

/**
 * Data needed to format the Qibla output.
 */
export interface QiblaFormatData {
	readonly direction: number;
	readonly latitude: number;
	readonly longitude: number;
	readonly location: string;
}

const COMPASS_POINTS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;

/**
 * Returns the cardinal/intercardinal label for a bearing in degrees.
 */
const getCardinalDirection = (degrees: number): string => {
	const normalized = ((degrees % 360) + 360) % 360;
	const index = Math.round(normalized / 45) % 8;
	return COMPASS_POINTS[index] ?? "N";
};

/**
 * Renders an ASCII compass with the Qibla direction highlighted.
 */
export const formatQiblaOutput = (data: QiblaFormatData): string => {
	const { direction, latitude, longitude, location } = data;
	const cardinal = getCardinalDirection(direction);
	const bearing = direction.toFixed(2);

	const arrow = getArrowForDirection(direction);

	const lines = [
		"",
		pc.bold(pc.green("  Qibla Direction")),
		pc.dim(`  ${location}`),
		"",
		pc.dim("        N"),
		pc.dim("        |"),
		pc.dim(`   W ---${arrow}--- E`),
		pc.dim("        |"),
		pc.dim("        S"),
		"",
		`  ${pc.bold("Bearing:")}  ${pc.cyan(`${bearing}\u00B0`)} ${pc.yellow(`(${cardinal})`)}`,
		`  ${pc.bold("From:")}     ${pc.dim(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)}`,
		`  ${pc.bold("Towards:")}  ${pc.dim("Kaaba, Mecca")}`,
		"",
	];

	return lines.join("\n");
};

/**
 * Returns a single-char arrow indicator based on the compass quadrant.
 */
const getArrowForDirection = (degrees: number): string => {
	const normalized = ((degrees % 360) + 360) % 360;
	if (normalized >= 337.5 || normalized < 22.5) return pc.green("\u2191");
	if (normalized >= 22.5 && normalized < 67.5) return pc.green("\u2197");
	if (normalized >= 67.5 && normalized < 112.5) return pc.green("\u2192");
	if (normalized >= 112.5 && normalized < 157.5) return pc.green("\u2198");
	if (normalized >= 157.5 && normalized < 202.5) return pc.green("\u2193");
	if (normalized >= 202.5 && normalized < 247.5) return pc.green("\u2199");
	if (normalized >= 247.5 && normalized < 292.5) return pc.green("\u2190");
	return pc.green("\u2196");
};
