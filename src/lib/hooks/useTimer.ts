import { useAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import { timerAtom, type TimerMode, type TimerState } from "@/store/timer";
import { settingsAtom } from "@/store/settings";
import { recordsAtom, type PomodoroRecord } from "@/store/records";
import { useNotificationSound } from "./useNotificationSound";

export function useTimer() {
	const [timer, setTimer] = useAtom(timerAtom);
	const [settings] = useAtom(settingsAtom);
	const [records, setRecords] = useAtom(recordsAtom);
	const { playSound } = useNotificationSound();

	// 現在のタイマーセッションの開始時刻を追跡するための参照
	const sessionStartRef = useRef<Date | null>(null);
	// インターバル（setInterval）を追跡するための参照
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

		// タイマーの状態を更新する
		setTimer({
			...timer,
			mode,
			timeRemaining: duration,
			isRunning: true,
		});
	};

	// タイマーを一時停止する
	const pauseTimer = () => {
		// 実行中でなければ何もしない
		if (!timer.isRunning) return;

		setTimer({
			...timer,
			isRunning: false,
		});
	};

	// タイマーを再開する
	const resumeTimer = () => {
		// すでに実行中の場合は何もしない
		if (timer.isRunning) return;

		setTimer({
			...timer,
			isRunning: true,
		});
	};

	// タイマーをリセットする
	const resetTimer = () => {
		// インターバルをクリア（停止）する
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}

		// 作業セッションをリセットする場合は、未完了として記録する
		if (timer.mode === "work" && sessionStartRef.current) {
			recordSession(false);
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
		console.log("asdfasfasdfasdf");
		// 作業セッション中の場合は、それを完了させる
		if (timer.mode === "work") {
			/* (セッション開始時刻があれば、完了として記録する - このロジックはrecordSessionに集約されているか、useEffect内で処理される) */
			/* if (sessionStartRef.current) {
				recordSession(true);
			} */

			// 完了したポモドーロ数をインクリメント（増加）する
			const completedPomodoros = timer.completedPomodoros + 1;
			const currentCycle = timer.currentCycle + 1;

			// 長い休憩を取るべきかどうかを判断する
			const shouldTakeLongBreak = currentCycle >= settings.longBreakInterval;

			// 長い休憩の間隔に達したら、サイクルカウンターをリセットする
			const nextCycle = shouldTakeLongBreak ? 0 : currentCycle;

			// 次の休憩タイプを設定する
			const nextMode = shouldTakeLongBreak ? "longBreak" : "shortBreak";

			// タイマーの状態を更新する
			setTimer({
				...timer,
				mode: nextMode,
				completedPomodoros,
				currentCycle: nextCycle,
				isRunning: settings.autoStartBreak, // 休憩を自動開始するかどうか
				timeRemaining: shouldTakeLongBreak
					? settings.longBreakTime * 60
					: settings.shortBreakTime * 60,
			});

			// 通知音を再生する (タイマーが0になった時にも呼ばれるため、二重再生に注意が必要かも)
			// playSound(); // useEffect内のタイマー完了時に再生するため、ここでは不要かもしれない
		}
		// 休憩中の場合は、作業に戻る
		else if (timer.mode === "shortBreak" || timer.mode === "longBreak") {
			sessionStartRef.current = new Date(); // 新しい作業セッションの開始時刻を記録

			setTimer({
				...timer,
				mode: "work",
				timeRemaining: settings.workTime * 60,
				isRunning: settings.autoStartWork, // 作業を自動開始するかどうか
			});

			// 通知音を再生する (同上)
			// playSound(); // useEffect内のタイマー完了時に再生するため、ここでは不要かもしれない
		}
	}, [
		setTimer,
		// playSound, // skipToNext自体が音を鳴らすのではなく、状態遷移の結果として音が鳴るべき
		settings.autoStartBreak,
		settings.workTime,
		settings.autoStartWork,
		settings.longBreakInterval,
		settings.longBreakTime,
		settings.shortBreakTime,
		timer, // timerオブジェクト全体に依存しているため、変更があると再生成される
	]);

	// タイマーのティック（刻み）効果 - 実行中に毎秒タイマーを更新する
	useEffect(() => {
		// タイマーが実行中でなければ、インターバルをクリアして終了
		if (!timer.isRunning) {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
			return;
		}

		// タイマー実行中なら、1秒ごとにインターバル処理を開始
		intervalRef.current = setInterval(() => {
			setTimer((prev: TimerState) => {
				// 通常のティック - まだ残り時間がある場合（2秒以上）
				if (prev.timeRemaining > 1) {
					return {
						...prev,
						timeRemaining: prev.timeRemaining - 1,
					};
				}

				// タイマーがゼロになった場合（残り時間が1秒以下）
				// インターバルをクリア（停止）する
				if (intervalRef.current) {
					clearInterval(intervalRef.current);
					intervalRef.current = null;
				}

				// 通知音を再生する
				playSound();

				// 必要であれば、完了した作業セッションを記録する
				// (skipToNextより前に記録する必要がある場合)
				if (prev.mode === "work" && sessionStartRef.current) {
					recordSession(true); // ここで記録するか、skipToNextに任せるか要検討
				}

				// 作業と休憩の両方について、次のフェーズを処理する
				skipToNext(); // skipToNextが状態を更新する

				// このインターバルコールバックとしては、残り時間を0にして返す
				// skipToNextによる状態更新が非同期の場合、一瞬0が表示される
				return {
					...prev,
				};
			});
		}, 1000);

		// アンマウント時や依存配列の変更時にインターバルをクリーンアップ（クリア）する
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
		// 依存配列: isRunningが変わるたび、または関連関数が再生成されるたびに副作用を再実行
	}, [timer.isRunning, setTimer, playSound, recordSession, skipToNext]);

	// カスタムフックが提供する関数群
	return {
		startTimer,
		pauseTimer,
		resumeTimer,
		resetTimer,
		skipToNext,
	};
}
