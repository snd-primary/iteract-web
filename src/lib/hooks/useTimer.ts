"use client";

import { useAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import { timerAtom, type TimerMode } from "@/store/timer";
import { settingsAtom } from "@/store/settings";
import { recordsAtom, type PomodoroRecord } from "@/store/records";
import { useNotificationSound } from "./useNotificationSound";

type TickPayload = {
	timeRemaining: number;
};

type ErrorPayload = {
	message: string;
	code?: number;
};

// Workerからメインスレッドへのメッセージ型定義
type WorkerToMainMessage =
	| { type: "TICK"; payload: TickPayload }
	| { type: "COMPLETE"; payload?: undefined }
	| { type: "ERROR"; payload: ErrorPayload };

// メインスレッドからWorkerへのメッセージ型定義
type MainToWorkerMessage =
	| { type: "START"; payload: { duration: number } }
	| { type: "PAUSE"; payload?: undefined }
	| { type: "RESUME"; payload?: undefined }
	| { type: "RESET"; payload?: undefined };

export function useTimer() {
	const [timer, setTimer] = useAtom(timerAtom);
	const [settings] = useAtom(settingsAtom);
	const [records, setRecords] = useAtom(recordsAtom);
	const { playSound } = useNotificationSound();

	// 現在のタイマーセッションの開始時刻を追跡するための参照
	const sessionStartRef = useRef<Date | null>(null);

	// Web Workerの参照
	const workerRef = useRef<Worker | null>(null);

	// Web Workerからのメッセージを処理する最新の関数（ハンドラ）への参照を保持するref
	const handleMessageRef = useRef<
		((event: MessageEvent<WorkerToMainMessage>) => void) | null
	>(null);

	// Workerの生成・破棄用Effect
	useEffect(() => {
		if (typeof window === "undefined") return;
		try {
			const workerUrl = new URL(
				"../../workers/timerWorker.ts",
				import.meta.url,
			);
			workerRef.current = new Worker(workerUrl);
			// onmessageには常にRefの最新関数を呼ぶラッパーを設定
			workerRef.current.onmessage = (event) =>
				handleMessageRef.current?.(event);

			return () => {
				if (workerRef.current) {
					workerRef.current.terminate();
				}
				workerRef.current = null;
			};
		} catch (error) {
			console.error("Failed initialize Web Worker:", error);
		}
	}, []); // マウント・アンマウント時のみ

	// タイマーを開始する
	const startTimer = (mode: TimerMode = "work") => {
		// すでに実行中の場合は何もしない
		if (timer.isRunning) return;

		// モードに基づいて時間を設定する
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
				return; // アイドル（待機）モードの場合は何もしない
		}

		// 新しい作業セッションを開始する場合は、開始時刻を記録する
		if (mode === "work") {
			sessionStartRef.current = new Date();
		}

		// タイマー状態を更新
		setTimer({
			...timer,
			mode,
			timeRemaining: duration,
			isRunning: true,
		});

		// Web Workerでタイマーを開始
		if (workerRef.current) {
			const message: MainToWorkerMessage = {
				type: "START",
				payload: { duration },
			};
			workerRef.current.postMessage(message);
		}
	};

	// タイマーを一時停止する
	const pauseTimer = () => {
		// 実行中でなければ何もしない
		if (!timer.isRunning) return;

		// タイマー状態を更新
		setTimer({
			...timer,
			isRunning: false,
		});

		// Web Workerのタイマーを一時停止
		if (workerRef.current) {
			const message: MainToWorkerMessage = {
				type: "PAUSE",
			};
			workerRef.current.postMessage(message);
		}
	};

	// タイマーを再開する
	const resumeTimer = () => {
		// すでに実行中の場合は何もしない
		if (timer.isRunning) return;

		// タイマー状態を更新
		setTimer({
			...timer,
			isRunning: true,
		});

		// Web Workerのタイマーを再開
		if (workerRef.current) {
			console.log("Workerにタイアー再開指示を送信");
			const message: MainToWorkerMessage = {
				type: "RESUME",
			};
			workerRef.current.postMessage(message);
		}
	};

	// タイマーをリセットする
	const resetTimer = () => {
		// 作業セッションをリセットする場合は、未完了として記録する
		if (timer.mode === "work" && sessionStartRef.current) {
			recordSession(false);
		}

		// Web Workerのタイマーをリセット
		if (workerRef.current) {
			const message: MainToWorkerMessage = {
				type: "RESET",
			};
			workerRef.current.postMessage(message);
		}

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

	// 次のタイマーフェーズにスキップする
	const skipToNext = useCallback(() => {
		//タイマーが実行中の場合、Workerにリセットメッセージを送る
		if (workerRef.current) {
			const resetMessage: MainToWorkerMessage = {
				type: "RESET",
			};
			workerRef.current.postMessage(resetMessage);
		}

		// 2. 次のモード・時間を計算（元のコードを維持）
		// let nextMode: TimerMode;
		let nextDuration: number;
		let newCompletedPomodoros = timer.completedPomodoros;
		let newCurrentCycle = timer.currentCycle;

		// 作業セッション中の場合は、それを完了させる
		if (timer.mode === "work") {
			// 既存の処理（ポモドーロのカウントなど）
			newCompletedPomodoros = timer.completedPomodoros + 1;
			newCurrentCycle = timer.currentCycle + 1;

			//超休憩を取るかどうかのロジック。
			const shouldTakeLongBreak = newCurrentCycle >= settings.longBreakInterval;

			// 長い休憩を取るべき時（shouldTakeLongBreakがtrue）なら、サイクルカウンターを0にリセット
			newCurrentCycle = shouldTakeLongBreak ? 0 : newCurrentCycle;

			timer.nextMode = shouldTakeLongBreak ? "longBreak" : "shortBreak";

			nextDuration = shouldTakeLongBreak
				? settings.longBreakTime * 60
				: settings.shortBreakTime * 60;
		}
		// 休憩中の場合は、作業に戻る
		else {
			// 休憩中の場合
			timer.nextMode = "work";
			nextDuration = settings.workTime * 60;
			sessionStartRef.current = new Date();
		}

		//次のモードに移行する前に数秒のブランク'waiting'状態を取る
		setTimer({
			...timer,
			mode: "waiting",
			timeRemaining: nextDuration,
			isRunning: false, // 常にfalseにする
			completedPomodoros: newCompletedPomodoros,
			currentCycle: newCurrentCycle,
		});

		setTimeout(() => {
			setTimer((prev) => ({
				...prev,
				mode: prev.nextMode || "idle",
				nextMode: null,
				timeRemaining: nextDuration,
				isRunning: false,
			}));

			// 自動開始設定が有効なら、タイマーを開始
			const shouldAutoStart =
				(timer.nextMode === "work" && settings.autoStartWork) ||
				(timer.nextMode &&
					["shortBreak", "longBreak"].includes(timer.nextMode) &&
					settings.autoStartBreak);

			if (shouldAutoStart) {
				// 状態更新が確実に完了してから実行するため、少し遅延させる
				setTimeout(() => {
					if (workerRef.current) {
						const startMessage: MainToWorkerMessage = {
							type: "START",
							payload: { duration: nextDuration },
						};
						workerRef.current.postMessage(startMessage);

						// タイマーの実行状態を更新
						setTimer((prev) => ({
							...prev,
							isRunning: true,
						}));
					}
				}, 50);
			}
		}, 3000);
	}, [
		setTimer,
		settings.autoStartBreak,
		settings.autoStartWork,
		settings.longBreakInterval,
		settings.longBreakTime,
		settings.shortBreakTime,
		settings.workTime,
		timer,
	]);

	//Web Workerから現在のカウント処理の結果を受取り、タイマーに適用する
	useEffect(() => {
		handleMessageRef.current = (event: MessageEvent<WorkerToMainMessage>) => {
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
					// タイマー完了時の処理
					playSound();

					// 作業セッションが完了した場合は記録
					if (timer.mode === "work" && sessionStartRef.current) {
						recordSession(true);
					}

					skipToNext();
					break;

				case "ERROR":
					console.error("Timer worker error:", payload);
					break;
			}
		};
	}, [timer, playSound, setTimer, recordSession, skipToNext]);

	// カスタムフックが提供する関数群
	return {
		startTimer,
		pauseTimer,
		resumeTimer,
		resetTimer,
		skipToNext,
	};
}
