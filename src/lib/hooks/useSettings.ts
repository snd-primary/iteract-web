import {
	type PomodoroSettings,
	settingsAtom,
	settingsOpenAtom,
} from "@/store/settings";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { useNotificationSound } from "./useNotificationSound";

export const useSettings = () => {
	const [settings, setSettings] = useAtom(settingsAtom);
	const [settingsOpen, setSettingsOpen] = useAtom(settingsOpenAtom);

	// tempSettings の初期値は、最初のレンダリングでは settingsAtom の初期値になる可能性がある
	const [tempSettings, setTempSettings] = useState<PomodoroSettings>(settings);

	const { getSoundPath } = useNotificationSound();

	useEffect(() => {
		if (!settingsOpen) {
			// settingsOpen が false のときに tempSettings を settings に更新
			setTempSettings(settings);
		}
	}, [settingsOpen, settings]);

	// Open settings panel
	const openSettings = () => {
		setTempSettings({ ...settings });
		setSettingsOpen(true);
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
		(name: keyof PomodoroSettings) => (checked: boolean | "indeterminate") => {
			setTempSettings((prev) => ({
				...prev,
				[name]: checked === "indeterminate" ? false : checked,
			}));
		};

	// Handle input change
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		// valueAsNumber を使うか、明示的にパースする方がより安全
		const numericValue =
			e.target.type === "number" ? Number.parseFloat(value) : Number(value);

		setTempSettings((prev) => ({
			...prev,
			[name as keyof PomodoroSettings]: Number.isNaN(numericValue)
				? prev[name as keyof PomodoroSettings]
				: numericValue, // 不正な数値の場合は元の値を維持するなどのエラーハンドリングも考慮
		}));
	};

	return {
		openSettings,
		closeSettings,
		saveSettings,
		handleCheckboxChange,
		handleChange,
		getSoundPath,
		settingsOpen,
		settings,
		tempSettings,
		setTempSettings,
	};
};
