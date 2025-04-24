import { atom } from "jotai";

// Timer modes
export type TimerMode =
	| "work"
	| "shortBreak"
	| "longBreak"
	| "idle"
	| "waiting";

// Timer state interface
export interface TimerState {
	mode: TimerMode; //タイマーの状態
	timeRemaining: number; // タイマーの残時間
	isRunning: boolean; //タイマーが実行されているかどうか
	completedPomodoros: number; //そのセッションでタイマーが満了した回数
	currentCycle: number; //何回目のポモドーロタイマーか
	nextMode: TimerMode | null;
}

// Initial timer state
export const initialTimerState: TimerState = {
	mode: "idle",
	timeRemaining: 0,
	isRunning: false,
	completedPomodoros: 0,
	currentCycle: 0,
	nextMode: null,
};

// Timer state atom
export const timerAtom = atom<TimerState>(initialTimerState);
