/**
 * @module types/branded
 * @description Branded (nominal) types for compile-time safety of numeric domain values.
 * Each branded type is a plain `number` at runtime but is distinct at the type level,
 * preventing accidental misuse (e.g. passing a latitude where a longitude is expected).
 */

/**
 * A geographic latitude value in the range \[-90, 90\].
 * @see {@link toLatitude} to construct a valid `Latitude`.
 */
export type Latitude = number & { readonly __brand: "Latitude" };

/**
 * A geographic longitude value in the range \[-180, 180\].
 * @see {@link toLongitude} to construct a valid `Longitude`.
 */
export type Longitude = number & { readonly __brand: "Longitude" };

/**
 * An Aladhan API calculation-method identifier (integer 0–23).
 * @see {@link toMethodId} to construct a valid `MethodId`.
 */
export type MethodId = number & { readonly __brand: "MethodId" };

/**
 * An Aladhan API juristic-school identifier (`0` = Shafi, `1` = Hanafi).
 * @see {@link toSchoolId} to construct a valid `SchoolId`.
 */
export type SchoolId = number & { readonly __brand: "SchoolId" };

/**
 * A Ramadan roza (fast) number in the range 1–30.
 * @see {@link toRozaNumber} to construct a valid `RozaNumber`.
 */
export type RozaNumber = number & { readonly __brand: "RozaNumber" };

/**
 * Validates and brands a number as a {@link Latitude}.
 *
 * @param value - Raw numeric latitude.
 * @returns The branded `Latitude` value.
 * @throws {RangeError} If `value` is outside \[-90, 90\].
 *
 * @example
 * ```ts
 * const lat = toLatitude(24.8607);
 * ```
 */
export const toLatitude = (value: number): Latitude => {
	if (value < -90 || value > 90) {
		throw new RangeError(`Latitude must be between -90 and 90, got ${value}`);
	}
	return value as Latitude;
};

/**
 * Validates and brands a number as a {@link Longitude}.
 *
 * @param value - Raw numeric longitude.
 * @returns The branded `Longitude` value.
 * @throws {RangeError} If `value` is outside \[-180, 180\].
 *
 * @example
 * ```ts
 * const lng = toLongitude(67.0011);
 * ```
 */
export const toLongitude = (value: number): Longitude => {
	if (value < -180 || value > 180) {
		throw new RangeError(`Longitude must be between -180 and 180, got ${value}`);
	}
	return value as Longitude;
};

/**
 * Validates and brands a number as a {@link MethodId}.
 *
 * @param value - Raw numeric method ID.
 * @returns The branded `MethodId` value.
 * @throws {RangeError} If `value` is not an integer in 0–23.
 *
 * @example
 * ```ts
 * const method = toMethodId(2); // ISNA
 * ```
 */
export const toMethodId = (value: number): MethodId => {
	if (!Number.isInteger(value) || value < 0 || value > 23) {
		throw new RangeError(`Method ID must be an integer between 0 and 23, got ${value}`);
	}
	return value as MethodId;
};

/**
 * Validates and brands a number as a {@link SchoolId}.
 *
 * @param value - `0` for Shafi or `1` for Hanafi.
 * @returns The branded `SchoolId` value.
 * @throws {RangeError} If `value` is not `0` or `1`.
 *
 * @example
 * ```ts
 * const school = toSchoolId(1); // Hanafi
 * ```
 */
export const toSchoolId = (value: number): SchoolId => {
	if (value !== 0 && value !== 1) {
		throw new RangeError(`School ID must be 0 or 1, got ${value}`);
	}
	return value as SchoolId;
};

/**
 * Validates and brands a number as a {@link RozaNumber}.
 *
 * @param value - Roza number (1–30).
 * @returns The branded `RozaNumber` value.
 * @throws {RangeError} If `value` is not an integer in 1–30.
 *
 * @example
 * ```ts
 * const roza = toRozaNumber(15);
 * ```
 */
export const toRozaNumber = (value: number): RozaNumber => {
	if (!Number.isInteger(value) || value < 1 || value > 30) {
		throw new RangeError(`Roza number must be between 1 and 30, got ${value}`);
	}
	return value as RozaNumber;
};
