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
import { GlobalHooks } from "@/components/global-hooks";
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
		default: "Iteract - Pomodoro Timer & Task Management", // Default title (can be translated if layout becomes async)
		template: "%s | Iteract", // Template for page titles
	},
	description:
		"Boost your productivity with Iteract, a simple and interactive Pomodoro timer and task management app.", // Default description (can be translated)
	colorScheme: "light dark", // lightとdarkの両方をサポートすることを示す
	viewport: "width=device-width, initial-scale=1",
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
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
			<body className={`${fontFamilyClass()} antialiased  `}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange // Recommended to disable theme transition during navigation
				>
					<NextIntlClientProvider locale={locale}>
						<GlobalHooks />
						<div className="max-w-7xl h-lvh mx-auto  grid grid-cols-1 items-start">
							<Header />
							<div className="w-full h-fit grid grid-cols-[minmax(280px,450px)] place-content-center place-items-center">
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
