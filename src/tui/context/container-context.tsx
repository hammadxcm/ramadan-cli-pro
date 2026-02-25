/**
 * @module tui/context/container-context
 * @description React context to expose the full AppContainer to all TUI screens.
 */

import { createContext, useContext } from "react";
import type { AppContainer } from "../../container.js";

const ContainerContext = createContext<AppContainer | null>(null);

/** Provider component for the DI container context. */
export const ContainerProvider = ContainerContext.Provider;

/**
 * Hook to consume the application DI container.
 * Throws if used outside a ContainerProvider.
 */
export const useContainer = (): AppContainer => {
	const container = useContext(ContainerContext);
	if (!container) {
		throw new Error("useContainer must be used within a ContainerProvider");
	}
	return container;
};
