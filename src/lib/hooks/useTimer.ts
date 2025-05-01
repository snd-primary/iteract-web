"use client";

import { useAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";
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

	// 現在のタイマーセッションの開始時刻を追跡するための参照
	const sessionStartRef = useRef<Date | null>(null);

	//  skipToNext関数への参照を保持するrefを作成
	const skipToNextRef = useRef<() => void>(() => {
		console.warn("skipToNext called before initialization");
	}); // 初期値は警告を出すダミー関数

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
					if (timer.mode === "focus" && sessionStartRef.current) {
						recordSession(true);
					}

					skipToNextRef.current();

					playSound();
					break;
				case "ERROR":
					console.error("Timer worker error:", payload);
					break;
			}
		},
		[setTimer, timer.mode, recordSession, playSound],
	);

	const handleWorkerError = useCallback((error: Event | string) => {
		console.error("Worker encountered an error", error);
	}, []);

	const { postMessage, workerStatus } = useTimerWorker({
		onMessage: handleWorkerMessage, // ★これは Workerからのメッセージを「受け取って処理する」関数
		onError: handleWorkerError,
	});

	// モードに基づいて時間を設定する
	const calculateDuration = (mode: TimerMode, settings: PomodoroSettings) => {
		switch (mode) {
			case "focus":
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

			if (currentMode === "focus") {
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
				nextMode = "focus";
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
		if (timer.mode !== "focus") {
			sessionStartRef.current = new Date();
		}
		// 自動開始設定が有効なら、タイマーを開始
		const shouldAutoStart =
			(nextMode === "focus" && settings.autoStartWork) ||
			(["shortBreak", "longBreak"].includes(nextMode) &&
				settings.autoStartBreak);

		// 6. 自動開始する場合、Worker に START メッセージを送信
		if (shouldAutoStart) {
			// ★ 自動実行する場合: 直接次のモードへ
			setTimer((prev) => ({
				...prev,
				mode: nextMode,
				timeRemaining: nextDuration,
				isRunning: true, // すぐに実行
				completedPomodoros: newCompletedPomodoros,
				currentSession: newCurrentSession,
				pendingNextMode: null, // 保留モードはなし
			}));

			if (postMessage) {
				setTimeout(() => {
					const startMessage: MainToWorkerMessage = {
						type: "START",
						payload: { duration: nextDuration },
					};
					postMessage(startMessage);
				}, 1000);
			}
		} else {
			// ★ 自動実行しない場合: idle 状態にし、次のモードを pending に
			setTimer((prev) => ({
				...prev,
				mode: "idle", // idle 状態へ移行
				timeRemaining: 0, // idle なので残り時間は 0
				isRunning: false, // 実行しない
				completedPomodoros: newCompletedPomodoros, // ポモドーロ数は更新
				currentSession: newCurrentSession, // セッション数も更新
				pendingNextMode: nextMode, // 次に開始すべきモードを保持
			}));
			// Worker へのメッセージは送らない (ユーザーがStartを押すまで待つ)
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

	// 5. useEffectでrefを最新のskipToNext関数で更新
	useEffect(() => {
		skipToNextRef.current = skipToNext;
	}, [skipToNext]); // skipToNextが再生成されたらrefを更新

	// タイマーを開始する
	const startTimer = (mode: TimerMode = "focus"): void => {
		// すでに実行中の場合は何もしない
		if (workerStatus !== "ready" || timer.isRunning) return;

		const duration = calculateDuration(mode, settings);

		if (duration === null) {
			console.error("Invalid timer mode:", mode);
			return;
		}

		// --- 副作用の実行 ---
		if (mode === "focus") {
			sessionStartRef.current = new Date();
		}

		const nextState = createNextTimerState(timer, mode, duration);
		setTimer(nextState);

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
		if (timer.mode === "focus" && sessionStartRef.current) {
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

	// カスタムフックが提供する関数群
	return {
		startTimer,
		pauseTimer,
		resumeTimer,
		resetTimer,
		skipToNext,
	};
}
