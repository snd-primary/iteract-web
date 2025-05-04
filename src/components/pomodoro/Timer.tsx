"use client";

import { useAtom } from "jotai";
import { timerAtom } from "@/store/timer";
import { settingsAtom } from "@/store/settings";
import { useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ProgressCircle } from "../ui/progress-circle/progress-circle";
import { useTranslations } from "next-intl";

import { cva } from "class-variance-authority";

const statusText = cva(
	"tracking-[8px] leading-5 text-sm pl-2.5 border-double border-3 w-fit relative linear pt-0.5 pb-1 text-shadow-[0_0_3px]",
	{
		variants: {
			mode: {
				focus: "text-state-focus text-shadow-state-focus border-state-focus/90",
				shortBreak:
					"text-state-break-short text-shadow-state-break-short/60 border-state-break-short/50",
				longBreak:
					"text-state-break-long text-shadow-state-break-long border-state-break-long/50",
				ready: "text-foreground border-foreground/50",
			},
		},
		defaultVariants: {
			mode: "ready",
		},
	},
);

export function Timer() {
	const [timer] = useAtom(timerAtom);
	const [settings] = useAtom(settingsAtom);

	const t = useTranslations("timer");

	const focusMode = t("mode.focus"); // "集中"
	const shortBreakMode = t("mode.shortBreak"); // "小休憩"
	const longBreakMode = t("mode.longBreak"); // "長休憩"
	const readyMode = t("mode.ready"); // "準備完了"
	const pomodoroText = t("pomodoro", { number: 1 }); // "ポモドーロ 1回目"

	// Format time as MM:SS
	const formatTime = useCallback((seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs
			.toString()
			.padStart(2, "0")}`;
	}, []);

	const modeText = useCallback(() => {
		switch (timer.mode) {
			case "focus":
				return focusMode;
			case "shortBreak":
				return shortBreakMode;
			case "longBreak":
				return longBreakMode;
			default:
				return readyMode;
		}
	}, [timer.mode, focusMode, shortBreakMode, longBreakMode, readyMode]);

	const modereadyTimer = useCallback(() => {
		switch (timer.pendingNextMode) {
			case "focus":
				return settings.workTime * 60;
			case "shortBreak":
				return settings.shortBreakTime * 60;
			case "longBreak":
				return settings.longBreakTime * 60;
			default:
				return settings.workTime * 60; // Default to work time
		}
	}, [settings, timer.pendingNextMode]);

	// Set page title with current timer state
	useEffect(() => {
		let title = "Pomodoro Timer";

		if (timer.mode !== "ready") {
			title = `${formatTime(timer.timeRemaining)} - ${modeText()}`;
		}

		document.title = title;

		return () => {
			document.title = "Pomodoro Timer";
		};
	}, [timer.mode, timer.timeRemaining, formatTime, modeText]);

	return (
		<div className="w-full h-min grid grid-rows-[30px_25px_1fr_180px]  gap-2 text-center justify-items-center  items-center relative">
			<motion.span
				className={statusText({ mode: timer.mode })}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.5 }}
				key={timer.mode}
			>
				{modeText()}
			</motion.span>
			<div>
				<AnimatePresence>
					{timer.pendingNextMode && timer.mode === "ready" && (
						<motion.span
							className="text-sm text-foreground/80 linear font-departure"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.5 }}
							key={timer.pendingNextMode}
						>
							NEXT MODE &gt;&gt; {timer.pendingNextMode}
						</motion.span>
					)}
				</AnimatePresence>
			</div>

			<div className="CUSTOM_TIME_BORDER p-2 w-full grid gap-2 grid-rows-[1fr_20px] text-foreground/90 pb-6">
				<div className="self-center w-full h-full text-7xl font-departure mb-0 font-bold ">
					{timer.mode === "ready"
						? formatTime(modereadyTimer())
						: formatTime(timer.timeRemaining)}
				</div>
				<p className="font-departure mx-auto w-50 h-full text-sm text-muted-foreground ">
					{`session #${timer.completedPomodoros + (timer.mode === "focus" ? 1 : 0)}`}
				</p>
			</div>

			<ProgressCircle />
		</div>
	);
}
