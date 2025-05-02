"use client";

import { Timer, Controls, CompletedCounter } from "@/components/pomodoro";
import { ProgressCircle } from "@/components/ui/progress-circle/progress-circle";
import { useInitializeApp } from "@/lib/hooks/useInitializeApp";
import { usePersistState } from "@/lib/hooks/usePersistState";
import { settingsAtom } from "@/store/settings";
import { timerAtom } from "@/store/timer";
import { useAtom } from "jotai";

export default function Home() {
	// Initialize app state from localStorage
	useInitializeApp();

	// Persist state to localStorage
	usePersistState();

	const [settings] = useAtom(settingsAtom);
	const [timer] = useAtom(timerAtom);

	const circleDuration = (): number => {
		switch (timer.mode) {
			case "focus":
				return settings.workTime;

			default:
				return 0; // デフォルト値を返す
		}
	};

	return (
		<main className="max-w-full w-full h-fit grid grid-cols-1 grid-rows-[1fr_70px] gap-12 items-center justify-center bg-background text-foreground px-4 relative">
			<div className="w-full grid grid-cols-1 gap-16 justify-center justify-self-center md:border-1 md:p-8  relative">
				<Timer />
				<ProgressCircle duration={circleDuration()} />
				<Controls />
			</div>
			<CompletedCounter />
		</main>
	);
}
