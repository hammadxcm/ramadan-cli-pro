/**
 * @module setup/setup-utils
 * @description Utility functions for the interactive setup wizard,
 * including TTY detection and method/school option builders.
 */

import type { MethodOption } from "../data/calculation-methods.js";
import { METHOD_OPTIONS, findMethodLabel } from "../data/calculation-methods.js";
import { type SchoolOption, getSchoolOptions } from "../data/school-options.js";

/**
 * Returns `true` if the process is running in an interactive TTY
 * (not piped, not in CI).
 *
 * @returns Whether interactive prompts are safe to use.
 */
export const canPromptInteractively = (): boolean =>
	Boolean(process.stdin.isTTY && process.stdout.isTTY && process.env.CI !== "true");

/**
 * Returns the list of calculation method options for the setup prompt,
 * with the recommended method (if any) moved to the top and labeled.
 *
 * @param recommendedMethod - The recommended method ID for the user's country, or `null`.
 * @returns An ordered array of method options.
 */
export const getMethodOptions = (recommendedMethod: number | null): ReadonlyArray<MethodOption> => {
	if (recommendedMethod === null) {
		return METHOD_OPTIONS;
	}

	const recommendedOption: MethodOption = {
		value: recommendedMethod,
		label: `${findMethodLabel(recommendedMethod)} (Recommended)`,
		hint: "Based on your country",
	};
	const remaining = METHOD_OPTIONS.filter((option) => option.value !== recommendedMethod);
	return [recommendedOption, ...remaining];
};

export { getSchoolOptions };
