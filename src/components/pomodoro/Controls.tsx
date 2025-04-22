import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import { timerAtom } from "@/store/timer";
import { useTimer } from "@/lib/hooks/useTimer";

export function Controls() {
	const [timer] = useAtom(timerAtom);
	const { startTimer, pauseTimer, resumeTimer, resetTimer, skipToNext } =
		useTimer();

	// Start or resume the timer
	// Start or resume the timer
	const handleStartOrResume = () => {
		if (timer.mode === "idle") {
			// タイマーがまだ始まっていない場合は新規開始
			startTimer("work");
		} else if (!timer.isRunning) {
			// タイマーはセットされているが実行中でない場合は新規開始
			startTimer(timer.mode);
		} else {
			// 実行中の場合は再開
			resumeTimer();
		}
	};

	return (
		<div className="grid grid-cols-3 gap-4 w-full h-auto">
			{!timer.isRunning ? (
				<Button onClick={handleStartOrResume} size="lg" className="rounded-sm">
					<Play className=" h-4 w-4" />
					{timer.mode === "idle" ? "Start" : "Resume"}
				</Button>
			) : (
				<Button
					onClick={pauseTimer}
					variant="outline"
					size="lg"
					className="rounded-sm"
				>
					<Pause className="h-4 w-4" />
					Pause
				</Button>
			)}
			<Button
				onClick={resetTimer}
				variant="ghost"
				size="lg"
				className="roundes-sm"
			>
				<RotateCcw className="h-4 w-4" />
				Reset
			</Button>

			<Button
				onClick={skipToNext}
				variant="ghost"
				size="lg"
				disabled={timer.mode === "idle"}
			>
				<SkipForward className="h-4 w-4" />
				Skip
			</Button>
		</div>
	);
}
