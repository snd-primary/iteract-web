import type { NextConfig } from "next";
import createNextIntPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
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
export default withNextIntl(nextConfig);
