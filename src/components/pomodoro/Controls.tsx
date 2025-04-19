import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { timerAtom } from "@/store/timer";

export function Controls() {
  const [timer, setTimer] = useAtom(timerAtom);

  // These are placeholder functions for now
  const handleStart = () => {
    console.log('Start timer');
  };

  const handlePause = () => {
    console.log('Pause timer');
  };

  const handleReset = () => {
    console.log('Reset timer');
  };

  return (
    <div className="flex items-center justify-center space-x-4 mt-6">
      {!timer.isRunning ? (
        <Button onClick={handleStart} size="lg">
          <Play className="mr-2 h-4 w-4" />
          Start
        </Button>
      ) : (
        <Button onClick={handlePause} variant="outline" size="lg">
          <Pause className="mr-2 h-4 w-4" />
          Pause
        </Button>
      )}
      <Button onClick={handleReset} variant="ghost" size="lg">
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset
      </Button>
    </div>
  );
}
