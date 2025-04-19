import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import { timerAtom } from "@/store/timer";
import { useTimer } from "@/lib/hooks/useTimer";

export function Controls() {
  const [timer] = useAtom(timerAtom);
  const { startTimer, pauseTimer, resumeTimer, resetTimer, skipToNext } = useTimer();

  // Start or resume the timer
  const handleStartOrResume = () => {
    if (timer.mode === "idle") {
      startTimer("work");
    } else {
      resumeTimer();
    }
  };

  return (
    <div className="flex items-center justify-center space-x-4 mt-6">
      {!timer.isRunning ? (
        <Button onClick={handleStartOrResume} size="lg">
          <Play className="mr-2 h-4 w-4" />
          {timer.mode === "idle" ? "Start" : "Resume"}
        </Button>
      ) : (
        <Button onClick={pauseTimer} variant="outline" size="lg">
          <Pause className="mr-2 h-4 w-4" />
          Pause
        </Button>
      )}
      <Button onClick={resetTimer} variant="ghost" size="lg">
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset
      </Button>
      
      {timer.mode !== "idle" && (
        <Button onClick={skipToNext} variant="ghost" size="lg">
          <SkipForward className="mr-2 h-4 w-4" />
          Skip
        </Button>
      )}
    </div>
  );
}
