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
		template: "%s | Iteract",
	},
	description:
		"Iteract（イテラクト）は、シンプルで使いやすいポモドーロタイマーアプリです。集中力を高め、生産性を向上させるためのツールとして最適です。",
	colorScheme: "light dark", // lightとdarkの両方をサポートすることを示す
	viewport: "width=device-width, initial-scale=1",
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
	icons: {
		icon: [
			{ url: "/favicon.ico", type: "image/x-icon", sizes: "any" },
			{ url: "/icon/icon.svg", type: "svg+xml" },
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
