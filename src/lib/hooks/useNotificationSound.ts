"use client";
import { settingsAtom, type SoundType } from "@/store/settings";
import { useAtom } from "jotai";
import { useEffect, useRef } from "react";

export function useNotificationSound() {
	const [settings] = useAtom(settingsAtom);

	// Create audio element ref
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const getSoundPath = (soundType: SoundType): string => {
		switch (soundType) {
			case "digital":
				return "/sound/digital.mp3";
			case "bell1":
				return "/sound/bell1.mp3";
			case "bell2":
				return "/sound/bell2.mp3";
			case "beep":
				return "/sound/beep.mp3";
			default:
				return "/sound/digital.mp3";
		}
	};

	// Initialize audio on component mount
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		// Create audio element if it doesn't exist
		if (!audioRef.current) {
			audioRef.current = new Audio();
		}

		audioRef.current.src = getSoundPath(settings.soundType);
		audioRef.current.volume = settings.soundVolume / 100;
		audioRef.current.load();

		// Clean up audio on component unmount
		return () => {
			if (audioRef.current) {
				audioRef.current = null;
			}
		};
	}, [settings.soundType, settings.soundVolume]);

	// Function to play notification sound
	const playSound = () => {
		if (audioRef.current) {
			// 既に再生中なら最初に戻す
			audioRef.current.currentTime = 0;

			// 現在の音量設定を適用
			audioRef.current.volume = settings.soundVolume / 100;

			audioRef.current.play().catch((error) => {
				console.warn("Error playing notification sound:", error);
			});
		}
	};

	return { playSound, getSoundPath };
}
