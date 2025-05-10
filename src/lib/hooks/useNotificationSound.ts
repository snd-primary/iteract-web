"use client";
import { settingsAtom, type SoundType } from "@/store/settings";
import { useAtom } from "jotai";
import { useEffect, useRef } from "react";

// 音量を0.0～1.0の範囲に正規化し、不正な値の場合はデフォルト値を返すヘルパー関数
const normalizeAndValidateVolume = (
	volumePercent: number | undefined, // 0-100の範囲を期待
	defaultVolumeNormalized = 0.5, // 0.0-1.0の範囲のデフォルト値
): number => {
	if (typeof volumePercent !== "number" || !Number.isFinite(volumePercent)) {
		// settings.soundVolume が undefined、NaN、Infinity などの場合
		console.warn(
			`Invalid or non-finite soundVolume received: ${volumePercent}. Using default volume: ${defaultVolumeNormalized}`,
		);
		return defaultVolumeNormalized;
	}

	const normalized = volumePercent / 100; // 0-100 を 0.0-1.0 に変換

	if (normalized < 0) return 0;
	if (normalized > 1) return 1;
	return normalized;
};

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

		const audioElement = audioRef.current;

		const currentVolumeSetting = settings.soundVolume;
		const newVoolumeNromalized =
			normalizeAndValidateVolume(currentVolumeSetting);
		audioElement.volume = newVoolumeNromalized;

		if (currentVolumeSetting === undefined) {
			console.error("settings.soundVolume is undefined");
		}

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
			const audioElement = audioRef.current;

			const currentVolumeSetting = settings.soundVolume;
			const newVolumeNormalized =
				normalizeAndValidateVolume(currentVolumeSetting);
			audioElement.volume = newVolumeNormalized;

			if (currentVolumeSetting === undefined) {
				console.error("settings.soundVolume is undefined");
			}

			audioElement.currentTime = 0; // Reset to start
			audioElement.play().catch((error) => {
				console.warn("Failed to play sound:", error);
			});
		} else {
			console.warn("Audio element is not initialized");
		}
	};

	return { playSound, getSoundPath };
}
