"use client";

import { useAtom } from "jotai";
import { timerAtom } from "@/store/timer";
import { settingsAtom } from "@/store/settings";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";

import { cva } from "class-variance-authority";

export const statusBg = cva("", {
	variants: {
		mode: {
			focus: "bg-state-focus/3",
			shortBreak: "bg-state-break-short/3",
			longBreak: "bg-state-break-long/3",
			ready: "bg-background",
		},
	},
	defaultVariants: {
		mode: "ready",
	},
});

export const statusText = cva("", {
	variants: {
		mode: {
			focus: "text-state-focus text-shadow-state-focus border-state-focus/90",
			shortBreak:
				"text-state-break-short text-shadow-state-break-short/60 border-state-break-short/50",
			longBreak:
				"text-state-break-long text-shadow-state-break-long border-state-break-long/50",
			ready: "text-foreground border-foreground/50",
		},
		borderStyle: {
			double: "border-double",
			solid: "border-solid",
		},
		borderWidth: {
			initial: "border-3",
			thin: "border-1",
		},
	},
	defaultVariants: {
		mode: "ready",
		borderStyle: "double",
		borderWidth: "initial",
	},
});

export function Timer() {
	const [timer] = useAtom(timerAtom);
	const [settings] = useAtom(settingsAtom);

	const t = useTranslations("timer");

	const focusMode = t("mode.focus"); // "集中"
	const shortBreakMode = t("mode.shortBreak"); // "小休憩"
	const longBreakMode = t("mode.longBreak"); // "長休憩"
	const readyMode = t("mode.ready"); // "準備完了"

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
		let title = "Iteract Pomodoro Timer";

		if (timer.mode !== "ready") {
			title = `${formatTime(timer.timeRemaining)} - mode: ${modeText()}`;
		}

		document.title = title;

		return () => {
			document.title = "Iteract - Pomodoro Timer & Task Management";
		};
	}, [timer.mode, timer.timeRemaining, formatTime, modeText]);

	// Calculate total time for progress calculation
	const getTotalTime = useCallback(() => {
		switch (timer.mode) {
			case "focus":
				return settings.workTime * 60;
			case "shortBreak":
				return settings.shortBreakTime * 60;
			case "longBreak":
				return settings.longBreakTime * 60;
			default:
				// Return 1 for ready state to avoid division by zero
				return 1;
		}
	}, [timer.mode, settings]);

	const totalTime = getTotalTime();
	const progressPercentage =
		timer.mode === "ready" || totalTime <= 0
			? 0
			: ((totalTime - timer.timeRemaining) / totalTime) * 100;

	// Calculate how many cells should be filled (from right)
	const filledCellsCount = Math.floor(progressPercentage / 10);

	// Define background colors based on mode (assuming Tailwind classes exist)
	const modeBackgroundColor = {
		focus: "bg-state-focus/60",
		shortBreak: "bg-state-break-short/60",
		longBreak: "bg-state-break-long/60",
		ready: "", // No background when ready
	};
	const currentBgColor = modeBackgroundColor[timer.mode];

	// CSR専用にするためのステート
	const [displayedTime, setDisplayedTime] = useState("00:00"); // 初期値はプレースホルダー

	useEffect(() => {
		const timeValue =
			timer.mode === "ready"
				? formatTime(modereadyTimer())
				: formatTime(timer.timeRemaining);
		setDisplayedTime(timeValue);
	}, [timer.mode, timer.timeRemaining, modereadyTimer, formatTime]); // 依存配列に注意

	return (
		<div className="w-full h-min grid grid-cols-1 grid-rows-[70px_1fr_auto] gap-2 text-center justify-items-center  items-start relative select-none">
			<div className="grid grid-cols-1 items-start justify-center justify-items-center gap-2 ">
				<span
					className={`${statusText({
						mode: timer.mode,
					})} tracking-[8px] leading-5 text-sm pl-2.5 w-fit relative linear pt-0.5 pb-1 text-shadow-[0_0_3px] transition-colors duration-500 ease-in-out`}
					key={timer.mode}
				>
					{modeText()}
				</span>
				<AnimatePresence>
					{timer.pendingNextMode && timer.mode === "ready" && (
						<motion.span
							className="text-sm text-foreground/80 linear font-departure "
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

			<div className="w-full grid gap-2 grid-rows-[1fr_20px] text-foreground/90 border-l-1 border-r-1">
				<motion.div
					className={`${statusText({
						mode: timer.mode,
					})} self-center w-full h-full text-7xl font-departure mb-0 font-bold border-none`}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.1 }}
				>
					{displayedTime}
				</motion.div>
				<p className="font-departure mx-auto w-50 h-full text-sm text-muted-foreground ">
					{`settion #${timer.completedPomodoros + (timer.mode === "focus" ? 1 : 0)}`}
				</p>
			</div>
			<div className="w-full h-auto px-12 pt-4">
				{/* Progress Bar TableUI */}
				<table className="w-full h-8 border-collapse">
					<tbody>
						<tr>
							{Array.from({ length: 10 }).map((_, index) => {
								// Fill from right: cell index should be >= (10 - filledCellsCount)
								const isFilled =
									index >= 10 - filledCellsCount && timer.mode !== "ready";
								return (
									<td
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										key={index}
										className={`${statusText({
											mode: timer.mode,
											borderStyle: "solid",
											borderWidth: "thin",
										})} ${
											isFilled ? currentBgColor : ""
										} transition-colors duration-300 ease-in-out`}
									/>
								);
							})}
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}
