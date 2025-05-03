/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useTimer } from "@/lib/hooks";
import styles from "./progress-circle.module.css";
import { timerAtom, type TimerMode } from "@/store/timer";
import { useAtom } from "jotai";
import { useEffect, useRef } from "react";
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

	// 現在のモードに基づいた時間を取得
	const duration = calculateDuration(timer.mode, settings);

	// アニメーションを作成・更新する関数
	const createOrUpdateAnimation = () => {
		const element = divRef.current;
		if (!element) return;

		// 既存のアニメーションをクリア
		if (animationRef.current) {
			animationRef.current.cancel();
		}

		// 新しいアニメーションを作成
		const animation = element.animate(
			[{ "--angle": "0deg" }, { "--angle": "360deg" }],
			{
				duration: Number(duration * 1000),
				easing: "linear",
			},
		);

		// タイマーの状態に応じてアニメーションを制御
		if (timer.isRunning) {
			animation.play();
		} else {
			animation.pause();
		}

		animationRef.current = animation;
	};

	// モードまたは設定が変わった時にアニメーションを更新
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		createOrUpdateAnimation();

		return () => {
			if (animationRef.current) {
				animationRef.current.cancel();
			}
		};
	}, [duration, timer.mode, settings]);

	// リセット時にイージングを付与する関数
	const resetWithEasing = () => {
		const element = divRef.current;
		if (!element || !animationRef.current) return;

		// 現在のアニメーションを一時停止
		animationRef.current.pause();

		// 現在の角度を取得
		const computedStyle = getComputedStyle(element);
		const currentAngle = computedStyle.getPropertyValue("--angle") || "0deg";

		// 現在の角度から360degに戻るアニメーションを作成
		const resetAnimation = element.animate(
			[{ "--angle": currentAngle }, { "--angle": "0deg" }],
			{
				duration: 220,
				easing: "ease-in-out",
			},
		);

		// リセットアニメーション完了後に元のアニメーションをキャンセル
		resetAnimation.onfinish = () => {
			createOrUpdateAnimation();
		};
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!animationRef.current) return;

		if (timer.isRunning) {
			animationRef.current.play();
		} else if (timer.mode === "idle") {
			// cancel()の代わりにイージング付きのリセットを呼び出す
			resetWithEasing();
		} else {
			animationRef.current.pause();
		}
	}, [timer.isRunning, timer.mode]);

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
