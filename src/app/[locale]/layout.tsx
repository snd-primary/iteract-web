import type { Metadata } from "next/dist/types";
import { DotGothic16, Orbit } from "next/font/google";
import localFont from "next/font/local";
import "../globals.css";
import Header from "@/components/header";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
// Import getTranslations for potential use in layout metadata (though static export is preferred)
// import { getTranslations } from "next-intl/server";

import { ThemeProvider } from "next-themes";
import { Footer } from "@/components/footer";
import { PWALoader } from "@/components/pwa-loader";
import { StructuredData } from "@/components/structured-data";

const dotGothic16 = DotGothic16({
	variable: "--font-dot-gothic-16",
	subsets: ["latin"],
	weight: "400",
	style: "normal",
	display: "swap",
});

const orbit = Orbit({
	variable: "--font-orbit",
	subsets: ["latin"],
	weight: "400",
	style: "normal",
	display: "swap",
});

const departureMono = localFont({
	src: "../../font/DepartureMono-Regular.woff2",
	variable: "--font-departure-mono",
});

// Define metadataBase for resolving relative paths
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const metadata: Metadata = {
	metadataBase: new URL(BASE_URL),
	title: {
		default: "シンプルなポモドーロタイマー | Iteract（イテラクト）",
		template: "%s | Iteract（イテラクト）",
	},
	description:
		"Iteract（イテラクト）は、シンプルで使いやすいポモドーロタイマーアプリです。集中力を高め、生産性を向上させるためのツールとして最適です。",

	applicationName: "Iteract",

	// 検索エンジンに推奨する挙動 (必須ではないが明示的に)
	robots: {
		index: true,
		follow: true,
		googleBot: {
			// GoogleBotに特化した設定
			index: true,
			follow: true,
		},
	},

	colorScheme: "light dark",
	viewport: "width=device-width, initial-scale=1",

	alternates: {
		canonical: "/ja",
		languages: {
			"en-US": "/en",
			"ja-JP": "/ja",
			"ko-KR": "/ko",
			"x-default": "/en", // いずれの言語にも一致しない場合のデフォルトページ
		},
	},

	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#ffffff" },
		{ media: "(prefers-color-scheme: dark)", color: "#000000" },
	],

	icons: {
		icon: [
			{ url: "/favicon.ico", type: "image/x-icon", sizes: "any" },
			{ url: "/icon/icon.svg", type: "image/svg+xml" },
			{ url: "/icon/icon-16x16.png", type: "image/png", sizes: "16x16" },
			{ url: "/icon/icon-32x32.png", type: "image/png", sizes: "32x32" },
		],
		apple: [
			// apple-touch-iconも良いです
			{
				url: "/icon/apple-touch-icon.png",
				sizes: "180x180",
				type: "image/png",
			}, // 推奨サイズは180x180
		],
	},

	// Open Graph (Facebook, LinkedInなどのSNS共有用)
	openGraph: {
		title: "シンプルなポモドーロタイマー | Iteract（イテラクト）",
		description:
			"Iteract（イテラクト）は、シンプルで使いやすいポモドーロタイマーアプリです。集中力を高め、生産性を向上させるためのツールとして最適です。",
		url: `${BASE_URL}/ja`, // 共有される際の正規URL
		siteName: "Iteract（イテラクト）",
		images: [
			{
				url: `${BASE_URL}/og-image.png`, // 推奨サイズ: 1200x630px
				width: 1200,
				height: 630,
				alt: "Iteract ポモドーロタイマーのイメージ",
			},
		],
		locale: "ja_JP",
		type: "website",
	},

	// Twitterカード (Twitter共有用)
	twitter: {
		card: "summary_large_image",
		title: "シンプルなポモドーロタイマー | Iteract（イテラクト）",
		description:
			"Iteract（イテラクト）は、シンプルで使いやすいポモドーロタイマーアプリです。集中力を高め、生産性を向上させるためのツールとして最適です。",
		// siteId: "@yourTwitterHandle",
		creator: "@trhr_core",
		images: [`${BASE_URL}/twitter-image.png`],
	},

	keywords:
		"ポモドーロタイマー, 集中, 生産性, Iteract, イテラクト, webアプリ, 勉強タイマー",
	authors: [{ name: "TRHR_CORE" }], // 作者情報
};

export default async function RootLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}>) {
	const { locale } = await params;
	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	// Fetch translations if needed for layout (e.g., for translated default title/description)
	// const t = await getTranslations({ locale, namespace: 'Metadata' });
	// If fetching translations, update metadata object accordingly here or make it dynamic

	const fontFamilyClass = () => {
		switch (locale) {
			case "ja":
				return "font-ja";
			case "en":
				return "font-en";
			case "ko":
				return "font-ko";
		}
	};

	return (
		<html
			lang={locale}
			suppressHydrationWarning // Required when using next-themes
			className={`${departureMono.variable} ${dotGothic16.variable} ${orbit.variable}`}
		>
			<head>
				<StructuredData />
			</head>
			<body className={`${fontFamilyClass()} antialiased`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange // Recommended to disable theme transition during navigation
				>
					<NextIntlClientProvider locale={locale}>
						<div className="max-w-7xl h-lvh mx-auto grid grid-cols-1 items-start border-r-1 border-l-1 gap-8 sm:gap-0">
							<Header />
							<div className="w-full h-fit grid grid-cols-[minmax(280px,450px)] place-content-center place-items-center self-center ">
								{children}
							</div>
							<Footer />
						</div>
						<PWALoader />
					</NextIntlClientProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
