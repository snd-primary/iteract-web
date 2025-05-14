import type { NextConfig } from "next";
import createNextIntPlugin from "next-intl/plugin";

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
if (process.env.NODE_ENV === "development") {
	initOpenNextCloudflareForDev();
}

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
const finalConfig = configWithIntl;

export default finalConfig;
