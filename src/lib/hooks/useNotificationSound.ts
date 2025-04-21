import { useEffect, useRef } from "react";

export function useNotificationSound() {
	// Create audio element ref
	const audioRef = useRef<HTMLAudioElement | null>(null);

	// Initialize audio on component mount
	useEffect(() => {
		// Create audio element if it doesn't exist
		if (!audioRef.current) {
			audioRef.current = new Audio();
			// Simple bell sound (base64 encoded short audio)
			audioRef.current.src = "/emergency-siren-alert.mp3";
			audioRef.current.load();
		}

		// Clean up audio on component unmount
		return () => {
			if (audioRef.current) {
				audioRef.current = null;
			}
		};
	}, []);

	// Function to play notification sound
	const playSound = () => {
		if (audioRef.current) {
			// Reset to beginning if it's already playing
			audioRef.current.currentTime = 0;
			audioRef.current.play().catch((error) => {
				// Handle play() promise rejection (often due to user interaction requirements)
				console.warn("Error playing notification sound:", error);
			});
		}
	};

	return { playSound };
}
