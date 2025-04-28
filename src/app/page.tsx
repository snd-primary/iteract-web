"use client";

import { Container } from "@/components/layout/container";
import {
	Timer,
	Controls,
	CompletedCounter,
	ThemeToggle,
} from "@/components/pomodoro";
import { Settings } from "@/components/pomodoro/setting";
import { useInitializeApp } from "@/lib/hooks/useInitializeApp";
import { usePersistState } from "@/lib/hooks/usePersistState";

export default function Home() {
	// Initialize app state from localStorage
	useInitializeApp();

	// Persist state to localStorage
	usePersistState();

	return (
		<main className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
			<ThemeToggle />
			<Settings />

			<Container>
				<h1 className="text-3xl font-bold mb-8">Pomodoro Timer</h1>

				<div className="w-full grid grid-rows-[1fr_min-content] gap-8 bg-card  border-2 px-6 py-8 relative">
					<Timer />
					<Controls />
				</div>

				<CompletedCounter />
			</Container>
		</main>
	);
}
