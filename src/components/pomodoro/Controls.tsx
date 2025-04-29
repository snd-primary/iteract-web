import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
// import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import {
	PlayIcon,
	PauseIcon,
	ReloadIcon,
	ResumeIcon,
} from "@radix-ui/react-icons";

import { timerAtom } from "@/store/timer";
import { useTimer } from "@/lib/hooks/useTimer";
export function Controls() {
	const [timer] = useAtom(timerAtom);
	const { startTimer, pauseTimer, resumeTimer, resetTimer, skipToNext } =
		useTimer();

	// Start or resume the timer
	const handleStartOrResume = () => {
		if (timer.mode === "idle") {
			// タイマーがまだ始まっていない場合は新規開始
			startTimer("work");
			return;
		}
		if (!timer.isRunning) {
			// タイマーはセットされているが実行中でない場合は新規開始
			resumeTimer();
			return;
		}
	};

	return (
		<div className="grid place-items-center gap-4">
			<div className="text-xs relative tracking-[6px] CUSTOM_CONTROLS_BORDER opacity-40">
				CONTROLS
			</div>
			<div className="grid grid-cols-3 gap-4 w-full h-auto">
				{!timer.isRunning ? (
					<Button onClick={handleStartOrResume} size="lg" className="">
						<PlayIcon className=" h-4 w-4" />
						<span>{timer.mode === "idle" ? "Start" : "Resume"}</span>
					</Button>
				) : (
					<Button onClick={pauseTimer} variant="outline" size="lg" className="">
						<PauseIcon className="h-4 w-4" />
						<span>Pause</span>
					</Button>
				)}
				<Button onClick={resetTimer} variant="ghost" size="lg">
					<ReloadIcon className="h-4 w-4" />
					Reset
				</Button>

				<Button
					onClick={skipToNext}
					variant="ghost"
					size="lg"
					disabled={timer.mode === "idle"}
				>
					<ResumeIcon className="h-4 w-4" />
					Skip
				</Button>
			</div>
		</div>
	);
}
