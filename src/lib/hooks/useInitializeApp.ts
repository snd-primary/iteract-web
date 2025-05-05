"use client";

import { useAtom } from "jotai";
import { useEffect } from "react";
import { settingsAtom, defaultSettings } from "@/store/settings";
import { recordsAtom } from "@/store/records";

// Hook to initialize app state from localStorage
export function useInitializeApp() {
	const [, setSettings] = useAtom(settingsAtom);
	const [, setRecords] = useAtom(recordsAtom);

	useEffect(() => {
		// Load settings from localStorage
		try {
			const storedSettings = localStorage.getItem("pomodoro-settings");
			if (storedSettings) {
				setSettings(JSON.parse(storedSettings));
			}
		} catch (error) {
			console.error("Failed to load settings:", error);
			// Use default settings if loading fails
			setSettings(defaultSettings);
		}

		// Load records from localStorage
		try {
			const storedRecords = localStorage.getItem("pomodoro-records");
			if (storedRecords) {
				setRecords(JSON.parse(storedRecords));
			}
		} catch (error) {
			console.error("Failed to load records:", error);
			// Use empty records if loading fails
			setRecords([]);
		}
	}, [setSettings, setRecords]);
}
