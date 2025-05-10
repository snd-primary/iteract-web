import { atom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

// サウンドタイプを定義
export type SoundType = "digital" | "bell1" | "bell2" | "beep";

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

const storage = createJSONStorage<PomodoroSettings>(() => {
	if (typeof window !== "undefined") {
		return localStorage;
	}

	return {
		getItem: () => null,
		setItem: () => {},
		removeItem: () => {},
	};
});

// これが settingsAtom の初期値となる「ただのJavaScriptオブジェクト」です
const initialSettingsData: PomodoroSettings = {
	workTime: 25,
	shortBreakTime: 5,
	longBreakTime: 15,
	longBreakInterval: 4,
	autoStartBreak: false,
	autoStartWork: false,
	soundVolume: 50,
	soundType: "beep",
};

// Settings atom を atomWithStorage で直接定義します。
// これが localStorage と同期する設定情報のための atom 本体です。
export const settingsAtom = atomWithStorage<PomodoroSettings>(
	"pomodoro-settings", // 1. localStorage のキー名
	initialSettingsData, // 2. 初期値 (上記のオブジェクトを指定)
	storage, // 3. ストレージ設定
	{ getOnInit: true }, // 4. 初期値を取得するかどうか
);

export const settingsOpenAtom = atom(false); // Settings Modal open state atom
