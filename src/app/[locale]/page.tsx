// Import necessary types and functions for metadata
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { PomodoroApp } from "@/components/pomodoro/pomodoro-app";

// Define metadataBase again or import from layout (ensure consistency)
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// 型定義を Next.js の標準的な Props 形式に合わせる
type Props = {
	params: Promise<{ locale: string }>;
	// searchParams: { [key: string]: string | string[] | undefined }; // 必要なら追加
};

// Generate dynamic metadata for the page
export async function generateMetadata(
	{ params }: Props, // ここで Props 型を使用
): // parent: ResolvingMetadata // 必要であれば parent 引数も型定義に追加
Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "Metadata" });
	const title = t("homeTitle");
	const description = t("homeDescription");
	const canonicalUrl = `${BASE_URL}/${locale}`;

	// Generate hreflang links
	const languages: { [key: string]: string } = {};
	for (const loc of routing.locales) {
		languages[loc] = `${BASE_URL}/${loc}`;
	}

	return {
		title,
		description,
		alternates: {
			canonical: canonicalUrl,
			languages,
		},
		openGraph: {
			title,
			description,
			url: canonicalUrl,
			siteName: "Iteract", // Consider making this translatable or use defaultTitle
			images: [
				{
					url: "/og-image.png", // Must be an absolute URL or start with /
					width: 1200,
					height: 630,
					alt: "Iteract Pomodoro Timer",
				},
			],
			locale: locale,
			type: "website", // Or 'application'
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: ["/og-image.png"], // Must be an absolute URL or start with /
			// creator: '@your_twitter_handle', // Optional: Add Twitter handle
		},
		// Add other metadata like robots if needed
		// robots: { index: true, follow: true },
	};
}

// generateStaticParams も定義しておく (静的ビルドのため)
export function generateStaticParams(): { locale: string }[] {
	return routing.locales.map((locale) => ({
		locale: locale,
	}));
}

export default function Home() {
	return <PomodoroApp />;
}
