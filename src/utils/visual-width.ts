/**
 * @module utils/visual-width
 * @description Visual-width-aware string padding for Arabic/RTL text.
 * Uses `string-width` to correctly handle zero-width combining characters
 * (tashkeel/diacritics) that inflate `.length` but don't occupy terminal columns.
 */

import stringWidth from "string-width";

export { stringWidth };

/**
 * Pads a string to the given visual width using spaces on the right.
 * Unlike `String.padEnd()`, this accounts for zero-width combining characters
 * and full-width CJK characters.
 *
 * @param str - The string to pad.
 * @param width - The desired visual column width.
 * @returns The padded string.
 */
export const visualPadEnd = (str: string, width: number): string => {
	const visWidth = stringWidth(str);
	if (visWidth >= width) return str;
	return str + " ".repeat(width - visWidth);
};
