"use client";

import { Settings } from "./setting";
import { Timer } from "./timer";
import { Controls } from "./controls";
import { CompletedCounter } from "./completed-counter";
import dynamic from "next/dynamic";

// HydrationError対策.settingsAtom (localStorage) を使用しているため
const PomodoroTimerWithNoSSR = dynamic(
	() => import("./timer").then((mod) => mod.Timer),
	{ ssr: false }, // サーバーサイドレンダリングを無効にする
);

export const PomodoroApp = () => {
	return (
		<main className="max-w-full w-full h-fit grid grid-cols-1 grid-rows-[1fr_70px] gap-6 items-center justify-center bg-background text-foreground px-4 relative">
			<Settings />
			<div className="w-full grid grid-cols-1 gap-16 md:gap-8 justify-center justify-self-center sm:border-1 sm:p-6 rounded-sm relative">
				<PomodoroTimerWithNoSSR />
				<Controls />
			</div>
			<CompletedCounter />
		</main>
	);
};
