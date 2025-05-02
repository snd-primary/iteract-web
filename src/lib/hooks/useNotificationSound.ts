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
			case "beep":
				return "/sound/emergency-siren-alert.mp3";
			case "bell":
				return "/sound/retro-alarm-clock.mp3";
			case "chime":
				return "/sound/bing-bong-subway.mp3";
			default:
				return "/sound/emergency-siren-alert.mp3";
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
