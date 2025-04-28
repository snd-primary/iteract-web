import { useAtom } from "jotai";
import { timerAtom } from "@/store/timer";
import { settingsAtom } from "@/store/settings";
import { useCallback, useEffect } from "react";

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
			case "work":
				return "FOCUS";
			case "shortBreak":
				return "SHORT BREAK";
			case "longBreak":
				return "LONG BREAK";
			default:
				return "READY";
		}
	}, [timer.mode]);

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

	useEffect(() => {
		console.log(timer.mode);
	}, [timer.mode]);

	return (
		<div className="grid grid-cols-1 gap-6 items-start place-items-center w-full h-full">
			<div className="w-full h-min grid grid-rows-[30px_1fr]  gap-6 text-center justify-items-center items-start">
				<span className="tracking-[8px] leading-5 text-sm pl-2.5 border-double border-3 border-foreground/80 text-foreground/80 w-fit relative ">
					{modeText()}
				</span>

				<div className="CUSTOM_TIME_BORDER p-2 w-full   grid gap-2 grid-rows-[1fr_20px] text-foreground/90">
					<div className="self-center w-full h-full text-7xl font-departure mb-0 font-bold ">
						{timer.mode === "idle"
							? formatTime(settings.workTime * 60)
							: formatTime(timer.timeRemaining)}
					</div>
					<p className="mx-auto w-50 h-full text-sm text-muted-foreground ">
						{timer.mode !== "idle"
							? `Pomodoro #${
									timer.completedPomodoros + (timer.mode === "work" ? 1 : 0)
								}`
							: "|"}
					</p>
				</div>
			</div>

			{/* <div className="w-22 h-22 rounded-full border border-amber-300" /> */}
			<svg
				width={100}
				height={100}
				viewBox="0 0 100 100"
				xmlns="http://www.w3.org/2000/svg"
			>
				<title>remaining indicator circle</title>
				<circle
					fill="currentColor"
					cx="50"
					cy="50"
					r="50"
					/* 					strokeDasharray={1}
					strokeDashoffset={0}
					strokeWidth={20}
					stroke="red" */
				/>
				<defs>
					<clipPath id="progress-clip">
						<path d="M50,50 L50,0 A50,50 0 0,1 85.36,14.64 Z" />
					</clipPath>
				</defs>
				<circle
					cx="50"
					cy="50"
					r="50"
					fill="#4CAF50"
					clip-path="url(#progress-clip)"
				/>
			</svg>
		</div>
	);
}
