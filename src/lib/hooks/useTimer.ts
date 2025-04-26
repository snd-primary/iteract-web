"use client";

import { useAtom } from "jotai";
import { useCallback, useRef } from "react";
import { timerAtom, type TimerState, type TimerMode } from "@/store/timer";
import { type PomodoroSettings, settingsAtom } from "@/store/settings";
import { recordsAtom, type PomodoroRecord } from "@/store/records";
import { useNotificationSound } from "./useNotificationSound";
import { useTimerWorker } from "./useTimerWorker";
import type {
	MainToWorkerMessage,
	WorkerToMainMessage,
} from "@/types/workerMessages";

export function useTimer() {
	const [timer, setTimer] = useAtom(timerAtom);
	const [settings] = useAtom(settingsAtom);
	const [records, setRecords] = useAtom(recordsAtom);
	const { playSound } = useNotificationSound();

	// 完了または未完了のセッションを記録する
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

	const handleWorkerMessage = useCallback(
		(event: MessageEvent<WorkerToMainMessage>) => {
			const { type, payload } = event.data;

			switch (type) {
				case "TICK":
					// 残り時間の更新
					if (payload && typeof payload.timeRemaining === "number") {
						setTimer((prev) => ({
							...prev,
							timeRemaining: payload.timeRemaining,
						}));
					}
					break;
				case "COMPLETE":
					// 作業セッションが完了した場合は記録
					if (timer.mode === "work" && sessionStartRef.current) {
						recordSession(true);
					}
					break;
				case "ERROR":
					console.error("Timer worker error:", payload);
					break;
			}
		},
		[setTimer, timer.mode, recordSession],
	);

	const handleWorkerError = useCallback((error: Event | string) => {
		console.error("Worker encountered an error", error);
	}, []);

	const { postMessage, workerStatus } = useTimerWorker({
		onMessage: handleWorkerMessage, // ★これは Workerからのメッセージを「受け取って処理する」関数
		onError: handleWorkerError,
	});

	// 現在のタイマーセッションの開始時刻を追跡するための参照
	const sessionStartRef = useRef<Date | null>(null);

	// モードに基づいて時間を設定する
	const calculateDuration = (mode: TimerMode, settings: PomodoroSettings) => {
		switch (mode) {
			case "work":
				return settings.workTime * 60;
			case "shortBreak":
				return settings.shortBreakTime * 60;
			case "longBreak":
				return settings.longBreakTime * 60;
			default:
				return null;
		}
	};

	//新しいタイマーを生成する関数
	const createNextTimerState = (
		currentTimer: TimerState,
		mode: TimerMode,
		duration: number,
	) => ({
		...currentTimer,
		mode,
		timeRemaining: duration,
		isRunning: true,
	});

	// タイマーを開始する
	const startTimer = (mode: TimerMode = "work"): void => {
		// すでに実行中の場合は何もしない
		if (workerStatus !== "ready" || timer.isRunning) return;

		const duration = calculateDuration(mode, settings);

		if (duration === null) {
			console.error("Invalid timer mode:", mode);
			return;
		}

		// --- 副作用の実行 ---
		if (mode === "work") {
			sessionStartRef.current = new Date();
		}

		const nextState = createNextTimerState(timer, mode, duration);
		setTimer(nextState);
		console.log("asdfasdf", nextState);

		const message: MainToWorkerMessage = {
			type: "START",
			payload: { duration },
		};
		postMessage(message);
	};

	// タイマーを一時停止する
	const pauseTimer = (): void => {
		// 実行中でなければ何もしない
		if (!timer.isRunning) return;

		// タイマー状態を更新
		setTimer({
			...timer,
			isRunning: false,
		});

		const message: MainToWorkerMessage = {
			type: "PAUSE",
		};
		postMessage(message);
	};

	// タイマーを再開する
	const resumeTimer = (): void => {
		// すでに実行中の場合は何もしない
		if (timer.isRunning) return;

		// タイマー状態を更新
		setTimer({
			...timer,
			isRunning: true,
		});

		// Web Workerのタイマーを再開
		const message: MainToWorkerMessage = {
			type: "RESUME",
		};
		postMessage(message);
	};

	// タイマーをリセットする
	const resetTimer = (): void => {
		// 作業セッションをリセットする場合は、未完了として記録する
		if (timer.mode === "work" && sessionStartRef.current) {
			recordSession(false);
		}

		// Web Workerのタイマーをリセット
		const message: MainToWorkerMessage = {
			type: "RESET",
		};

		postMessage(message);
		// タイマーの状態をリセットする
		setTimer({
			...timer,
			mode: "idle",
			timeRemaining: 0,
			isRunning: false,
		});

		// セッション開始時刻の参照をクリアする
		sessionStartRef.current = null;
	};

	const calculateNextTimerProps = useCallback(
		(
			currentMode: TimerMode,
			currentSession: number,
			completedPomodoros: number,
			settings: Pick<
				PomodoroSettings,
				"workTime" | "shortBreakTime" | "longBreakTime" | "longBreakInterval"
			>,
		): {
			nextMode: TimerMode;
			nextDuration: number;
			newCompletedPomodoros: number;
			newCurrentSession: number;
		} => {
			let nextMode: TimerMode;
			let nextDuration: number;
			let newCompletedPomodoros = completedPomodoros;
			let newCurrentSession = currentSession;

			if (currentMode === "work") {
				newCompletedPomodoros += 1;
				newCurrentSession += 1;

				const shouldTakeLongBreak =
					newCurrentSession >= settings.longBreakInterval;
				newCurrentSession = shouldTakeLongBreak ? 0 : newCurrentSession; // 長い休憩後にリセット

				nextMode = shouldTakeLongBreak ? "longBreak" : "shortBreak";
				nextDuration = shouldTakeLongBreak
					? settings.longBreakTime * 60
					: settings.shortBreakTime * 60;
			} else {
				// 'shortBreak' または 'longBreak' から 'work' へ
				nextMode = "work";
				nextDuration = settings.workTime * 60;
				// sessionStartRef.current の更新は副作用なので、ここでは扱わない
			}

			return {
				nextMode,
				nextDuration,
				newCompletedPomodoros,
				newCurrentSession,
			};
		},
		[],
	);

	// 次のタイマーフェーズにスキップする
	const skipToNext = useCallback((): void => {
		//タイマーが実行中の場合、Workerにリセットメッセージを送る
		//
		if (timer.isRunning) {
			const resetMessage: MainToWorkerMessage = {
				type: "RESET",
			};
			postMessage(resetMessage);
		}

		const { nextMode, nextDuration, newCompletedPomodoros, newCurrentSession } =
			calculateNextTimerProps(
				timer.mode,
				timer.currentSession,
				timer.completedPomodoros,
				settings,
			);

		// --- 副作用: sessionStartRef の更新 (work 以外から work に移る場合) ---
		if (timer.mode !== "work") {
			sessionStartRef.current = new Date();
		}
		// 自動開始設定が有効なら、タイマーを開始
		// 4. 自動開始するかどうかを判断 (1秒後に使用)
		const shouldAutoStart =
			(nextMode === "work" && settings.autoStartWork) ||
			(["shortBreak", "longBreak"].includes(nextMode) &&
				settings.autoStartBreak);

		// 5. 状態を直接次の状態に更新
		setTimer((prev) => ({
			// prev を使う必要がなければ直接オブジェクトを渡しても良い
			...prev, // 念のため他の状態を維持
			mode: nextMode, // 次のモードに直接移行
			timeRemaining: nextDuration, // 次の時間を設定
			isRunning: shouldAutoStart, // 自動開始なら true
			completedPomodoros: newCompletedPomodoros,
			currentSession: newCurrentSession,
			nextMode: null, // nextMode は不要になる
		}));

		// 6. 自動開始する場合、Worker に START メッセージを送信
		if (shouldAutoStart) {
			const startMessage: MainToWorkerMessage = {
				type: "START",
				payload: { duration: nextDuration }, // 更新された時間を payload に設定
			};
			postMessage(startMessage);
		}
	}, [
		setTimer,
		postMessage,
		settings,
		timer.isRunning,
		timer.completedPomodoros,
		timer.mode,
		timer.currentSession,
		calculateNextTimerProps,
	]);

	// カスタムフックが提供する関数群
	return {
		startTimer,
		pauseTimer,
		resumeTimer,
		resetTimer,
		skipToNext,
	};
}
