/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import styles from "./progress-circle.module.css";
import { timerAtom } from "@/store/timer";
import { useAtom } from "jotai";
import { useEffect, useRef } from "react";

type Props = {
	duration: number; // duration in minutes
};

export const ProgressCircle: React.FC<Props> = ({ duration }) => {
	const animationRef = useRef<Animation | null>(null);
	const divRef = useRef<HTMLDivElement | null>(null);

	const [timer] = useAtom(timerAtom);

	// Animationの初期化 マウント時に1度実行される
	useEffect(() => {
		if (animationRef.current) {
			// 既存のアニメーションをクリア
			resetWithEasing();
		}
		console.log("デュレーションの値", duration);

		const element = divRef.current;
		if (!element) return;

		const animation = element.animate(
			[{ "--angle": "0deg" }, { "--angle": "360deg" }],
			{
				duration: Number(duration * 60 * 1000),
				easing: "linear",
			},
		);
		animation.pause();

		animationRef.current = animation;

		return () => {
			if (animationRef.current) {
				resetWithEasing();
			}
		};
	}, [duration]);

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
			if (animationRef.current) {
				animationRef.current.cancel();

				// 新しいアニメーションを作成
				const newAnimation = element.animate(
					[{ "--angle": "0deg" }, { "--angle": "360deg" }],
					{
						duration: Number(duration * 60 * 1000),
						easing: "linear",
					},
				);
				newAnimation.pause();
				animationRef.current = newAnimation;
			}
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
