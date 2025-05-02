"use client";

import { useAtom } from "jotai";
import { timerAtom } from "@/store/timer";
import { settingsAtom } from "@/store/settings";
import { useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

export function Timer() {
	const [timer] = useAtom(timerAtom);
	const [settings] = useAtom(settingsAtom);

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
				return "FOCUS";
			case "shortBreak":
				return "SHORT BREAK";
			case "longBreak":
				return "LONG BREAK";
			default:
				return "READY";
		}
	}, [timer.mode]);

	const modeIdleTimer = useCallback(() => {
		switch (timer.pendingNextMode) {
			case "focus":
				return settings.workTime * 60;
			case "shortBreak":
				return settings.shortBreakTime * 60;
			case "longBreak":
				return settings.longBreakTime * 60;
			default:
				return settings.workTime * 60;
		}
	}, [settings, timer.pendingNextMode]);

	// Set page title with current timer state
	useEffect(() => {
		let title = "Pomodoro Timer";

		if (timer.mode !== "idle") {
			title = `${formatTime(timer.timeRemaining)} - ${modeText()}`;
		}

		document.title = title;

		return () => {
			document.title = "Pomodoro Timer";
		};
	}, [timer.mode, timer.timeRemaining, formatTime, modeText]);

	return (
		<div className="w-full h-min grid grid-rows-[30px_25px_1fr]  gap-2 text-center justify-items-center items-start relative">
			<motion.span
				className="tracking-[8px] leading-5 text-sm pl-2.5 border-double border-3 border-foreground/80 text-foreground/80 w-fit relative linear"
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
					{timer.pendingNextMode && timer.mode === "idle" && (
						<motion.span
							className="text-sm text-foreground/80 linear"
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

			<div className="CUSTOM_TIME_BORDER p-2 w-full grid gap-2 grid-rows-[1fr_20px] text-foreground/90">
				<div className="self-center w-full h-full text-7xl font-departure mb-0 font-bold ">
					{timer.mode === "idle"
						? formatTime(modeIdleTimer())
						: formatTime(timer.timeRemaining)}
				</div>
				<p className="mx-auto w-50 h-full text-sm text-muted-foreground ">
					{`Pomodoro #${
						timer.completedPomodoros + (timer.mode === "focus" ? 1 : 0)
					}`}
				</p>
			</div>
		</div>
	);
}
