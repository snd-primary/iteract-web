"use client";

import { useInitializeApp } from "@/lib/hooks/useInitializeApp";
import { usePersistState } from "@/lib/hooks/usePersistState";

/**
 * Initializes application state and sets up persistence on initial mount.
 * This component is intended to be used once in the root layout.
 */
export function AppInitializer() {
	// Initialize app state from localStorage on initial mount
	useInitializeApp();

	// Set up persistence effect to localStorage on initial mount
	usePersistState();

	// This component doesn't render anything itself
	return null;
}
