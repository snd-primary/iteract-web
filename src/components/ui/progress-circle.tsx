"use client";
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

	//Animationの初期化 マウント時に1度実行される
	useEffect(() => {
		if (animationRef.current) {
			animationRef.current.cancel();
		}
		const element = divRef.current;
		if (!element) return;

		const animation = element.animate(
			[{ "--angle": "100%" }, { "--angle": "0%" }],
			{
				duration: Number(duration * 60 * 1000),
				easing: "linear",
				fill: "forwards",
			},
		);
		animation.pause();

		animationRef.current = animation;

		return () => {
			if (animationRef.current) {
				animationRef.current.cancel();
			}
		};
	}, [duration]);

	useEffect(() => {
		if (!animationRef.current) return;
		if (timer.isRunning) {
			animationRef.current.play();
		} else if (timer.mode === "idle") {
			animationRef.current.cancel();
		} else {
			animationRef.current.pause();
		}
	}, [timer.isRunning, timer.mode]);
	return (
		<div
			ref={divRef}
			style={{
				width: "100px",
				height: "100px",
				borderRadius: "50%",
				backgroundImage: `conic-gradient(
            #003681 0.1%,
            #003681 var(--angle, 100%),
            #d9d9d9 var(--angle, 100%) 100%
          )`,
			}}
		/>
	);
};

// React DevTools での表示名を指定（デバッグに役立つ）
ProgressCircle.displayName = "ProgressCircle";
