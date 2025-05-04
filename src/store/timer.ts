import { atom } from "jotai";

// Timer modes
export type TimerMode = "focus" | "shortBreak" | "longBreak" | "ready";

// Timer state interface
export interface TimerState {
	mode: TimerMode | "ready"; //タイマーの状態
	timeRemaining: number; // タイマーの残時間
	isRunning: boolean; //タイマーが実行されているかどうか
	completedPomodoros: number; //そのセッションでタイマーが満了した回数
	currentSession: number; //何回目のポモドーロタイマーか
	pendingNextMode: TimerMode | null; //次に開始すべきモードを保持
}

// Initial timer state
export const initialTimerState: TimerState = {
	mode: "ready",
	timeRemaining: 0,
	isRunning: false,
	completedPomodoros: 0,
	currentSession: 0,
	pendingNextMode: null,
};

// Timer state atom
export const timerAtom = atom<TimerState>(initialTimerState);
