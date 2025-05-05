"use client";

import { AppInitializer } from "@/components/app-initializer";

/**
 * A client component wrapper to safely call client-side hooks
 * and render client components needed globally at the root level.
 */
export function GlobalHooks() {
	// Render the AppInitializer component instead of calling it as a function
	// This ensures hooks inside AppInitializer are called correctly.
	const initializerElement = <AppInitializer />;

	// This component doesn't render anything visible itself,
	// but AppInitializer might render null or something else.
	// We need to return the element if we want its potential side effects to run.
	// Or, if AppInitializer strictly uses hooks for side effects and returns null,
	// we can keep returning null here, but it's safer to render it.
	return initializerElement; // Render the component element
}
