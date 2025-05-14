import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Iteract - Pomodoro Timer", // アプリケーションのフルネーム
		short_name: "Iteract", // ホーム画面に表示される短い名前
		description:
			"Boost your productivity with Iteract, a simple and interactive Pomodoro timer and task management app.", // アプリケーションの説明
		start_url: "/", // アプリケーションの開始URL
		display: "standalone", // アプリの表示モード (standalone, fullscreen, minimal-ui, browser)
		background_color: "#ffffff", // スプラッシュスクリーンの背景色
		theme_color: "#000000", // アプリケーションのテーマカラー（ツールバーの色など）
		icons: [
			{
				src: "/icon/icon-192.png", // アプリアイコンのパス
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/icon/icon-512.png",
				sizes: "512x512",
				type: "image/png",
			},
			{
				src: "/icon/apple-touch-icon.png", // Appleデバイス用アイコン
				sizes: "152x152",
				type: "image/png",
			},
			{
				src: "/icon/icon.svg", // SVGアイコン (any size)
				sizes: "any",
				type: "image/svg+xml",
				purpose: "maskable", // アイコンの目的 (maskableアイコンなど)
			},
		],
	};
}
