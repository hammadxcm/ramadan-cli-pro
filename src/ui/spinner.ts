/**
 * @module ui/spinner
 * @description Factory for creating ora terminal spinners.
 */

import ora, { type Ora } from "ora";

/**
 * Creates an ora spinner configured to write to stdout.
 *
 * @param text - The initial spinner message.
 * @returns An `Ora` spinner instance.
 */
export const createSpinner = (text: string): Ora => ora({ text, stream: process.stdout });
