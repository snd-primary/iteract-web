import type { NextConfig } from "next";
import createNextIntPlugin from "next-intl/plugin";

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
if (process.env.NODE_ENV === "development") {
	initOpenNextCloudflareForDev();
}

// --- PWA Configuration ---

const withPWA = require("next-pwa")({
	dest: "public",
	register: true,
	skipWaiting: true,
	disable: process.env.NODE_ENV === "development", // 開発中はPWAを無効化するのが一般的
});

const nextConfig: NextConfig = {
	experimental: {
		viewTransition: true,
	},
	webpack: (config) => {
		config.module.rules.push({
			test: /\.svg$/,
			use: [
				{
					loader: "@svgr/webpack",
				},
			],
		});
		return config;
	},
	images: {
		disableStaticImages: true, // importした画像の型定義設定を無効にする
	},
};

const withNextIntl = createNextIntPlugin();

// 1. nextConfigをnext-intlでラップ
const configWithIntl = withNextIntl(nextConfig);
const finalConfig = withPWA(configWithIntl);

export default finalConfig;
