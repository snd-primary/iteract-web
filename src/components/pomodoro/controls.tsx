"use client";
import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { PauseIcon } from "@radix-ui/react-icons";
import { timerAtom } from "@/store/timer";
import { useTimer } from "@/lib/hooks/useTimer";

export function Controls() {
	const [timer] = useAtom(timerAtom);
	const { startTimer, pauseTimer, resumeTimer, resetTimer, skipToNext } =
		useTimer();

	// Start or resume the timer
	const handleStartOrResume = () => {
		if (timer.mode === "ready") {
			//  pendingNextMode があればそれを、なければ 'work' を開始
			const modeToStart = timer.pendingNextMode ?? "focus";
			startTimer(modeToStart);
			return;
		}
		if (!timer.isRunning) {
			// タイマーはセットされているが実行中でない場合は新規開始
			resumeTimer();
			return;
		}
	};

	return (
		<div className="grid place-items-center gap-6">
			<div className="w-full text-center text-xs relative tracking-[6px] font-departure opacity-30 before:w-full before:h-full  before:absolute before:top-2 before:left-0 before:-z-10 before:border-t-1 before:border-l-1 before:border-r-1 before:border-foreground/50 select-none">
				<span className="inline-block bg-background pl-1">controls</span>
			</div>
			<div className="grid grid-cols-3 gap-2 w-full h-auto">
				{!timer.isRunning ? (
					<Button onClick={handleStartOrResume} size="lg" className="lg">
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className="size-4"
						>
							<title>play</title>
							<path
								d="M18 11V10H17V9H15V7H13V5H11V3H5V21H11V20V19H13V17H15V15H17V14H18V13H19V11H18ZM13 13V15H11V17H9V19H7V5H9V7H11V9H13V11H15V13H13Z"
								fill="currentColor"
							/>
						</svg>
						{/* <span>{timer.mode === "ready" ? t("start") : t("resume")}</span> */}
						<span className="font-departure">
							{timer.mode === "ready" ? "Start" : "Resume"}
						</span>
					</Button>
				) : (
					<Button onClick={pauseTimer} variant="outline" size="lg">
						<PauseIcon className="size-4" />
						<span className="font-departure">Pause</span>
						{/* <span>{t("pause")}</span> */}
					</Button>
				)}
				<Button onClick={resetTimer} variant="ghost" size="lg">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="size-4"
					>
						<title>reset</title>
						<path
							d="M4 6V5H5V4H6V3H16V4H17V5H18V6H19V5V4H21V10H15V8H17V7H16V6H15V5H8V6H7V7H6V8H5V16H6V17H7V18H8V19H15V18H16V17H17V16H18V15H20V18H19V19H18V20H17V21H6V20H5V19H4V18H3V6H4Z"
							fill="currentColor"
						/>
					</svg>
					<span className="font-departure">Reset</span>
					{/* <span className="">{t("reset")}</span> */}
				</Button>

				<Button
					onClick={skipToNext}
					variant="ghost"
					size="lg"
					disabled={timer.mode === "ready"}
				>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						className="size-4"
					>
						<title>skip</title>
						<path
							d="M10 3H4V21H10V19H12V17H14V15H16V14H17V10H16V9H14V7H12V5H10V3ZM12 13V15H10V17H8V19H6V5H8V7H10V9H12V11H14V13H12Z"
							fill="currentColor"
						/>
						<path d="M20 3H18V21H20V3Z" fill="currentColor" />
					</svg>
					{/* <span className="">{t("skip")}</span> */}
					<span className="font-departure">Skip</span>
				</Button>
			</div>
		</div>
	);
}
