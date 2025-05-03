import {
	type PomodoroSettings,
	settingsAtom,
	settingsOpenAtom,
} from "@/store/settings";
import { useAtom } from "jotai";
import { useState } from "react";
import { useNotificationSound } from "./useNotificationSound";

export const useSettings = () => {
	const [settings, setSettings] = useAtom(settingsAtom);
	const [settingsOpen, setSettingsOpen] = useAtom(settingsOpenAtom);
	const [tempSettings, setTempSettings] = useState<PomodoroSettings>(settings);

	const { getSoundPath } = useNotificationSound();

	// Open settings panel
	const openSettings = () => {
		setTempSettings({ ...settings });
		setSettingsOpen(true);
		console.log("Settings opened", settings);
	};

	// Close settings panel
	const closeSettings = () => {
		setSettingsOpen(false);
	};

	// Save settings
	const saveSettings = () => {
		setSettings(tempSettings);
		setSettingsOpen(false);
	};

	const handleCheckboxChange =
		(name: string) => (checked: boolean | "indeterminate") => {
			setTempSettings({
				...tempSettings,
				[name]: checked === "indeterminate" ? false : checked,
			});
		};

	// Handle input change
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setTempSettings({
			...tempSettings,
			[name]: Number(value),
		});
	};

	return {
		openSettings,
		closeSettings,
		saveSettings,
		handleCheckboxChange,
		handleChange,
		getSoundPath,
		tempSettings,
		setTempSettings,
		settingsOpen,
	};
};
