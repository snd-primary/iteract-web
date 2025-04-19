import { useAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import { timerAtom, type TimerMode, type TimerState } from "@/store/timer";
import { settingsAtom } from "@/store/settings";
import { recordsAtom, type PomodoroRecord } from "@/store/records";
import { useNotificationSound } from "./useNotificationSound";
import { skip } from "node:test";

export function useTimer() {
	const [timer, setTimer] = useAtom(timerAtom);
	const [settings] = useAtom(settingsAtom);
	const [records, setRecords] = useAtom(recordsAtom);
	const { playSound } = useNotificationSound();

	// Reference to keep track of the current timer session start time
	const sessionStartRef = useRef<Date | null>(null);
	// Reference to keep track of the interval
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	// Start timer
	const startTimer = (mode: TimerMode = "work") => {
		// If already running, do nothing
		if (timer.isRunning) return;

		// Set up time based on the mode
		let duration = 0;
		switch (mode) {
			case "work":
				duration = settings.workTime * 60;
				break;
			case "shortBreak":
				duration = settings.shortBreakTime * 60;
				break;
			case "longBreak":
				duration = settings.longBreakTime * 60;
				break;
			default:
				return; // Do nothing for idle
		}

		// If starting a new work session, record the start time
		if (mode === "work") {
			sessionStartRef.current = new Date();
		}

		// Update timer state
		setTimer({
			...timer,
			mode,
			timeRemaining: duration,
			isRunning: true,
		});
	};

	// Pause timer
	const pauseTimer = () => {
		if (!timer.isRunning) return;

		setTimer({
			...timer,
			isRunning: false,
		});
	};

	// Resume timer
	const resumeTimer = () => {
		if (timer.isRunning) return;

		setTimer({
			...timer,
			isRunning: true,
		});
	};

	// Reset timer
	const resetTimer = () => {
		// Clear interval
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}

		// If we're resetting a work session, record it as incomplete
		if (timer.mode === "work" && sessionStartRef.current) {
			recordSession(false);
		}

		// Reset timer state
		setTimer({
			...timer,
			mode: "idle",
			timeRemaining: 0,
			isRunning: false,
		});

		// Clear session start reference
		sessionStartRef.current = null;
	};

	// Record a completed or incomplete session
	const recordSession = useCallback(
		(completed: boolean) => {
			if (!sessionStartRef.current) return;

			const record: PomodoroRecord = {
				id: Date.now().toString(),
				startTime: sessionStartRef.current.toISOString(),
				endTime: new Date().toISOString(),
				completed,
				sessionNumber: timer.completedPomodoros + (completed ? 1 : 0),
			};

			setRecords([...records, record]);
			sessionStartRef.current = null;
		},
		[setRecords, records, timer.completedPomodoros],
	);

	// Skip to the next timer phase
	const skipToNext = useCallback(() => {
		// If we're in a work session, complete it
		if (timer.mode === "work") {
			/* if (sessionStartRef.current) {
				recordSession(true);
			} */

			// Increment completed pomodoros
			const completedPomodoros = timer.completedPomodoros + 1;
			const currentCycle = timer.currentCycle + 1;

			// Determine if we should take a long break
			const shouldTakeLongBreak = currentCycle >= settings.longBreakInterval;

			// Reset cycle counter if we've reached the long break interval
			const nextCycle = shouldTakeLongBreak ? 0 : currentCycle;

			// Set the next break type
			const nextMode = shouldTakeLongBreak ? "longBreak" : "shortBreak";

			// Update timer state
			setTimer({
				...timer,
				mode: nextMode,
				completedPomodoros,
				currentCycle: nextCycle,
				isRunning: settings.autoStartBreak,
				timeRemaining: shouldTakeLongBreak
					? settings.longBreakTime * 60
					: settings.shortBreakTime * 60,
			});

			// Play sound notification
			playSound();
		}
		// If we're in a break, go back to work
		else if (timer.mode === "shortBreak" || timer.mode === "longBreak") {
			sessionStartRef.current = new Date();

			setTimer({
				...timer,
				mode: "work",
				timeRemaining: settings.workTime * 60,
				isRunning: settings.autoStartWork,
			});

			// Play sound notification
			playSound();
		}
	}, [
		setTimer,
		playSound,
		settings.autoStartBreak,
		settings.workTime,
		settings.autoStartWork,
		settings.longBreakInterval,
		settings.longBreakTime,
		settings.shortBreakTime,
		timer,
	]);

	// Timer tick effect - update timer every second when running
	useEffect(() => {
		if (!timer.isRunning) {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
			return;
		}

		intervalRef.current = setInterval(() => {
			setTimer((prev: TimerState) => {
				// Normal tick - time still remaining
				if (prev.timeRemaining > 1) {
					return {
						...prev,
						timeRemaining: prev.timeRemaining - 1,
					};
				}

				// Timer has reached zero (timeRemaining <= 1)
				// Clear interval
				if (intervalRef.current) {
					clearInterval(intervalRef.current);
					intervalRef.current = null;
				}

				// Play sound notification
				playSound();

				// Record completed work session if needed
				if (prev.mode === "work" && sessionStartRef.current) {
					recordSession(true);
				}

				// Handle next phase for both work and break
				skipToNext();
				return prev; // Return previous state as we're updating elsewhere
			});
		}, 1000);

		// Cleanup interval on unmount
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [timer.isRunning, setTimer, playSound, recordSession, skipToNext]);

	return {
		startTimer,
		pauseTimer,
		resumeTimer,
		resetTimer,
		skipToNext,
	};
}
