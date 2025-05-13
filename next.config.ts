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
	disable: process.env.NODE_ENV === "development", // 開発中はPWAを無効化
	// PWA改善のための追加設定
	runtimeCaching: [
		{
			urlPattern: /^https:\/\/fonts\.(?:gstatic|googleapis)\.com\/.*/i,
			handler: 'CacheFirst',
			options: {
				cacheName: 'google-fonts',
				expiration: {
					maxEntries: 20,
					maxAgeSeconds: 60 * 60 * 24 * 365 // 1年間キャッシュ
				}
			}
		},
		{
			urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
			handler: 'CacheFirst',
			options: {
				cacheName: 'static-font-assets',
				expiration: {
					maxEntries: 20,
					maxAgeSeconds: 60 * 60 * 24 * 365
				}
			}
		},
		{
			urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
			handler: 'CacheFirst',
			options: {
				cacheName: 'static-image-assets',
				expiration: {
					maxEntries: 64,
					maxAgeSeconds: 60 * 60 * 24 * 30
				}
			}
		},
		{
			urlPattern: /\/_next\/image\?url=.+$/i,
			handler: 'CacheFirst',
			options: {
				cacheName: 'next-image',
				expiration: {
					maxEntries: 64,
					maxAgeSeconds: 60 * 60 * 24 * 30
				}
			}
		},
		{
			urlPattern: /\.(?:mp3|wav|ogg)$/i,
			handler: 'CacheFirst',
			options: {
				cacheName: 'static-audio-assets',
				expiration: {
					maxEntries: 32,
					maxAgeSeconds: 60 * 60 * 24 * 30
				}
			}
		},
		{
			urlPattern: /\.(?:js)$/i,
			handler: 'StaleWhileRevalidate',
			options: {
				cacheName: 'static-js-assets',
				expiration: {
					maxEntries: 32,
					maxAgeSeconds: 60 * 60 * 24 * 7
				}
			}
		},
		{
			urlPattern: /\.(?:css)$/i,
			handler: 'StaleWhileRevalidate',
			options: {
				cacheName: 'static-style-assets',
				expiration: {
					maxEntries: 32,
					maxAgeSeconds: 60 * 60 * 24 * 7
				}
			}
		},
		{
			urlPattern: /\/_next\/data\/.+\/.+\.json$/i,
			handler: 'StaleWhileRevalidate',
			options: {
				cacheName: 'next-data',
				expiration: {
					maxEntries: 32,
					maxAgeSeconds: 60 * 60 * 24
				}
			}
		},
		{
			urlPattern: /\/api\/.*$/i,
			handler: 'NetworkFirst',
			options: {
				cacheName: 'apis',
				expiration: {
					maxEntries: 16,
					maxAgeSeconds: 60 * 60 * 24
				},
				networkTimeoutSeconds: 10
			}
		},
		{
			urlPattern: /.*/i,
			handler: 'NetworkFirst',
			options: {
				cacheName: 'others',
				expiration: {
					maxEntries: 32,
					maxAgeSeconds: 60 * 60 * 24
				},
				networkTimeoutSeconds: 10
			}
		}
	]
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