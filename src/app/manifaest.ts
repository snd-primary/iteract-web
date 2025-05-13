import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Iteract PWA",
		short_name: "Iteract",
		description:
			"Boost your productivity with Iteract, a simple and interactive Pomodoro timer and task management app.",
		start_url: "/",
		display: "standalone",
		background_color: "#000000",
		theme_color: "#000000",
		icons: [
			{
				src: "/favicon.ico",
				sizes: "any",
				type: "image/x-icon",
			},
			{
				src: "/icon/icon.svg",
				sizes: "any",
				type: "image/svg+xml",
			},
			{
				src: "/icon/apple-touch-icon.png",
				sizes: "152x152",
				type: "image/png",
			},
		],
	};
}
