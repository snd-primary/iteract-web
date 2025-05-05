"use client";

import styles from "./progress-circle.module.css";
import { timerAtom, type TimerMode } from "@/store/timer";
import { useAtom } from "jotai";
import { useEffect, useRef, useCallback } from "react";
import { type PomodoroSettings, settingsAtom } from "@/store/settings";

/* type Props = {
	duration: number; // duration in minutes
} */ export const ProgressCircle: React.FC = () => {
	const animationRef = useRef<Animation | null>(null);
	const divRef = useRef<HTMLDivElement | null>(null);

	const [timer] = useAtom(timerAtom);
	const [settings] = useAtom(settingsAtom);

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
				return settings.workTime * 60; // デフォルトは作業時間
		}
	};

	// 現在のモードに基づいた総時間を取得 (秒単位)
	const totalDurationSeconds = calculateDuration(timer.mode, settings);

	// アニメーションを作成・更新する関数
	const createOrUpdateAnimation = useCallback(() => {
		const element = divRef.current;
		if (!element) return;

		// 既存のアニメーションをキャンセル（念のため）
		if (animationRef.current) {
			animationRef.current.cancel();
		}

		// 新しいアニメーションを作成
		const animation = element.animate(
			[{ "--angle": "0deg" }, { "--angle": "360deg" }],
			{
				duration: totalDurationSeconds * 1000, // 総時間をミリ秒で設定
				easing: "linear",
			},
		);

		// タイマーが既に進行中の場合、アニメーションの開始位置を調整
		if (timer.mode !== "ready" && timer.timeRemaining < totalDurationSeconds) {
			const elapsedTimeMs = (totalDurationSeconds - timer.timeRemaining) * 1000;
			animation.currentTime = elapsedTimeMs;
			console.log(`ProgressCircle: Setting currentTime to ${elapsedTimeMs}ms`);
		} else {
			// ready モードや初回開始時は 0 から
			animation.currentTime = 0;
		}

		// タイマーの状態に応じてアニメーションを制御
		if (timer.isRunning) {
			animation.play();
		} else {
			animation.pause();
		}

		animationRef.current = animation;
	}, [totalDurationSeconds, timer.mode, timer.timeRemaining, timer.isRunning]);

	// モードまたは設定が変わった時にアニメーションを更新
	useEffect(() => {
		createOrUpdateAnimation();
	}, [createOrUpdateAnimation]);

	// リセット時にイージングを付与する関数
	const resetWithEasing = useCallback(() => {
		const element = divRef.current;
		if (!element) return;

		// 既存のアニメーションがあればキャンセル
		if (animationRef.current) {
			animationRef.current.cancel();
			animationRef.current = null;
		}

		// 現在の角度（CSSから取得）
		const computedStyle = getComputedStyle(element);
		const currentAngle = computedStyle.getPropertyValue("--angle") || "0deg";

		// 現在の角度から 0deg に戻るアニメーションを作成
		element.animate([{ "--angle": currentAngle }, { "--angle": "0deg" }], {
			duration: 220,
			easing: "ease-in-out",
			fill: "forwards", // アニメーション終了後、最後の状態を保持
		});
	}, []);

	// isRunning または mode が変わった時のアニメーション制御
	useEffect(() => {
		if (!animationRef.current) {
			// アニメーションがない場合 (例: ready から開始)
			if (timer.isRunning) {
				createOrUpdateAnimation(); // 新しく作成して再生
			}
			return; // アニメーションがない場合は何もしない
		}

		if (timer.isRunning) {
			animationRef.current.play();
		} else if (timer.mode === "ready") {
			// ready モードで、かつ isRunning が false になった場合
			resetWithEasing();
		} else {
			// ready 以外で isRunning が false になった場合 (pause)
			animationRef.current.pause();
		}
	}, [timer.isRunning, timer.mode, createOrUpdateAnimation, resetWithEasing]);

	return (
		<div className="w-full h-max max-w-full  flex justify-center items-center relative">
			<div
				ref={divRef}
				className={`${styles.progressCircle} ${styles.bgPttern}`}
			>
				<div className={styles.triangleUp} />
				<div className={styles.triangleDown} />
			</div>
		</div>
	);
};
