"use client";

import { Settings } from "./setting";
import { Controls } from "./controls";
import { CompletedCounter } from "./completed-counter";
import { Timer } from "./timer";

export const PomodoroApp = () => {
	return (
		<main className="mx-auto max-w-full w-full h-fit grid grid-cols-1 grid-rows-[1fr_70px] gap-6 items-center justify-center bg-background text-foreground px-4 relative">
			<Settings />
			<div className="w-full grid grid-cols-1 h-96 gap-16 md:gap-8 items-end justify-center justify-self-center sm:border-1 sm:p-6 rounded-sm relative">
				<Timer />
				<Controls />
			</div>
			<CompletedCounter />
		</main>
	);
};
