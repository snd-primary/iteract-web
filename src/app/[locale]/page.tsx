"use client";

import { Timer, Controls, CompletedCounter } from "@/components/pomodoro";
import { Settings } from "@/components/pomodoro/setting";
import { useInitializeApp } from "@/lib/hooks/useInitializeApp";
import { usePersistState } from "@/lib/hooks/usePersistState";
import { useTranslations } from "next-intl";

export default function Home() {
	// Initialize app state from localStorage
	useInitializeApp();

	// Persist state to localStorage
	usePersistState();

	return (
		<main className="max-w-full w-full h-fit grid grid-cols-1 grid-rows-[1fr_70px] gap-12 items-center justify-center bg-background text-foreground px-4 relative">
			<Settings />
			<div className="w-full grid grid-cols-1 gap-16 justify-center justify-self-center md:border-1 md:p-8 relative">
				<Timer />
				<Controls />
			</div>
			<CompletedCounter />
		</main>
	);
}
