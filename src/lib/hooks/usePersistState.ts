"use client";

import { useAtom } from "jotai";
import { useEffect } from "react";
import { settingsAtom } from "@/store/settings";
import { recordsAtom } from "@/store/records";

// Hook to persist state to localStorage
export function usePersistState() {
	const [settings] = useAtom(settingsAtom);
	const [records] = useAtom(recordsAtom);

	// Persist settings
	useEffect(() => {
		try {
			localStorage.setItem("pomodoro-settings", JSON.stringify(settings));
		} catch (error) {
			console.error("Failed to save settings:", error);
		}
	}, [settings]);

	// Persist records
	useEffect(() => {
		try {
			localStorage.setItem("pomodoro-records", JSON.stringify(records));
		} catch (error) {
			console.error("Failed to save records:", error);
		}
	}, [records]);
}
