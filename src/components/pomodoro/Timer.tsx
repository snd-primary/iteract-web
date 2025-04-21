import { useAtom } from "jotai";
import { timerAtom } from "@/store/timer";
// import { settingsAtom } from "@/store/settings";
import { useCallback, useEffect } from "react";

export function Timer() {
	const [timer] = useAtom(timerAtom);
	// const [settings] = useAtom(settingsAtom);

	// Format time as MM:SS
	const formatTime = useCallback((seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	}, []);

	// Display appropriate mode text
	const modeText = useCallback(() => {
		switch (timer.mode) {
			case "work":
				return "Focus";
			case "shortBreak":
				return "Short Break";
			case "longBreak":
				return "Long Break";
			default:
				return "Ready";
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

	return (
		<div className="w-full h-full grid grid-rows-[50px_80px_1fr] place-items-center text-center  justify-items-center space-y-4">
			<h2 className="w-full h-full text-2xl text-primary mb-0">{modeText()}</h2>
			<div className="self-center w-full h-full text-7xl font-departure mb-0 font-bold">
				{timer.mode === "idle" ? "––:––" : formatTime(timer.timeRemaining)}
			</div>
			{timer.mode !== "idle" && (
				<p className="w-full h-full text-sm text-muted-foreground ">
					Pomodoro #{timer.completedPomodoros + (timer.mode === "work" ? 1 : 0)}
				</p>
			)}
		</div>
	);
}
