import type { Metadata } from "next/dist/types";
import { DotGothic16, Orbit } from "next/font/google";
import localFont from "next/font/local";
import "../globals.css";
import Header from "@/components/header";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

import { ThemeProvider } from "next-themes";
import { Footer } from "@/components/footer";

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
		default: "Iteract - Pomodoro Timer & Task Management", // Default title
		template: "%s | Iteract", // Template for page titles
	},
	description:
		"Boost your productivity with Iteract, a simple and interactive Pomodoro timer and task management app.",
	colorScheme: "light dark", // lightとdarkの両方をサポートすることを示す
	manifest: "/manifest.json", // Web Manifestへのパス
	viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
		{ media: "(prefers-color-scheme: dark)", color: "#000000" },
	],
	appleWebApp: {
		capable: true,
		statusBarStyle: "default",
		title: "Iteract",
	},
	applicationName: "Iteract",
	formatDetection: {
		telephone: false,
	},
	icons: {
		icon: [
			{ url: "/icon/icon-192x192.png", sizes: "192x192", type: "image/png" },
			{ url: "/icon/icon-512x512.png", sizes: "512x512", type: "image/png" },
		],
		apple: [{ url: "/icon/apple-touch-icon.png", sizes: "152x152" }],
	},
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
				{/* iOS用のフルスクリーン対応用メタタグを追加 */}
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
				<link rel="apple-touch-icon" href="/icon/apple-touch-icon.png" />
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
					</NextIntlClientProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}