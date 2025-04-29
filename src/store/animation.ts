/**
 * アニメにひつような状態は何か
 * - タイマーの総時間
 * タイマーの総時間だけあればいい。停止、再生はWebAnimationAPI使ってDurationを制御するだけでいい
 *
 * - Controlの情報
 * 脳味噌が拒絶するレベルで難しい。俺に理解できるのだろうかこんな難しいこと。今日中にこの実装を完全に理解する
 * もし今日中に理解できなければ、この仕事を完全に諦めることにする。どこかで見切りをつけないとだめ。
 */

import { atom } from "jotai";
import { type PomodoroSettings, settingsAtom } from "./settings";

export const durationAtom = atom(
	(get) => {
		const settings = get(settingsAtom);
		return settings.workTime;
	},
	(get, set, newDuration: number) => {
		const currentSettings = get(settingsAtom);

		const updatedSettings: PomodoroSettings = {
			...currentSettings,
			workTime: Math.max(1, newDuration),
		};
		set(settingsAtom, updatedSettings);
	},
);
