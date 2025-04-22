"use client";

import { Container } from "@/components/layout/Container";
import {
	Timer,
	Controls,
	CompletedCounter,
	ThemeToggle,
} from "@/components/pomodoro";
import { Settings } from "@/components/pomodoro/Settings";
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

				<div className="w-full grid grid-rows-[150px_1fr] gap-8 bg-card rounded-sm  shadow-sm border border-border p-8">
					<Timer />
					<Controls />
				</div>

				<CompletedCounter />
			</Container>
		</main>
	);
}
