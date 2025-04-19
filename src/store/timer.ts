import { atom } from "jotai";

// Timer modes
export type TimerMode = "work" | "shortBreak" | "longBreak" | "idle";

// Timer state interface
export interface TimerState {
	mode: TimerMode;
	timeRemaining: number; // in seconds
	isRunning: boolean;
	completedPomodoros: number;
	currentCycle: number;
}

// Initial timer state
export const initialTimerState: TimerState = {
	mode: "idle",
	timeRemaining: 0,
	isRunning: false,
	completedPomodoros: 0,
	currentCycle: 0,
};

// Timer state atom
export const timerAtom = atom<TimerState>(initialTimerState);
