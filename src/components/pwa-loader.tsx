"use client"; // このディレクティブが重要です

import { useEffect } from "react";

export function PWALoader() {
	// PWALoader.tsx や useServiceWorker.ts の例
	// useEffect(() => {
	// 開発中でもテストする場合はこの条件を調整
	// if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
	/* 		if ("serviceWorker" in navigator) {
			// 開発中もテストする場合はこのように変更
			window.addEventListener("load", () => {
				navigator.serviceWorker
					.register("/sw.js", { scope: "/" })
					.then((registration) => {
						console.log(
							"DEV: Service Worker registered with scope:",
							registration.scope
						);
					})
					.catch((error) => {
						console.error("DEV: Service Worker registration failed:", error);
					});
			});
		}
	}, []); */
	useEffect(() => {
		if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
			window.addEventListener("load", () => {
				navigator.serviceWorker
					.register("/sw.js", { scope: "/" }) // public/sw.js を登録
					.then((registration) => {
						console.log(
							"Service Worker registered with scope:",
							registration.scope,
						);
					})
					.catch((error) => {
						console.error("Service Worker registration failed:", error);
					});
			});
		}
	}, []);

	return null; // このコンポーネント自体は何もレンダリングしません
}
