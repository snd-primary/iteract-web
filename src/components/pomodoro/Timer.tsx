import { useAtom } from "jotai";
import { timerAtom } from "@/store/timer";
import { settingsAtom } from "@/store/settings";
import { useEffect } from "react";

export function Timer() {
  const [timer] = useAtom(timerAtom);
  const [settings] = useAtom(settingsAtom);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Display appropriate mode text
  const modeText = () => {
    switch (timer.mode) {
      case 'work':
        return 'Focus';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return 'Ready';
    }
  };

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
  }, [timer.mode, timer.timeRemaining]);

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-semibold text-primary">{modeText()}</h2>
      <div className="text-7xl font-mono font-bold">
        {timer.mode === "idle" 
          ? "--:--" 
          : formatTime(timer.timeRemaining)}
      </div>
      {timer.mode !== "idle" && (
        <p className="text-sm text-muted-foreground">
          Pomodoro #{timer.completedPomodoros + (timer.mode === "work" ? 1 : 0)}
        </p>
      )}
    </div>
  );
}
