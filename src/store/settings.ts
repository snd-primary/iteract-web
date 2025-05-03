import { atom } from "jotai";

// サウンドタイプを定義
export type SoundType = "bell" | "chime" | "beep";

// Settings interface
export interface PomodoroSettings {
	workTime: number; // in minutes
	shortBreakTime: number; // in minutes
	longBreakTime: number; // in minutes
	longBreakInterval: number; // number of work sessions before long break
	autoStartBreak: boolean; // automatically start break after work session
	autoStartWork: boolean; // automatically start work after break
	soundVolume: number;
	soundType: SoundType;
}

// Default settings
export const defaultSettings: PomodoroSettings = {
	workTime: 25,
	shortBreakTime: 5,
	longBreakTime: 15,
	longBreakInterval: 4,
	autoStartBreak: false,
	autoStartWork: false,
	soundVolume: 80,
	soundType: "beep",
};

export const settingsOpenAtom = atom(false); // Settings open state atom

// Settings atom
export const settingsAtom = atom<PomodoroSettings>(defaultSettings);
