import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
	const entries: MetadataRoute.Sitemap = [];

	// Add entries for each locale
	for (const locale of routing.locales) {
		// Default locale should not have locale prefix in URL
		const url =
			locale === routing.defaultLocale
				? `${BASE_URL}/`
				: `${BASE_URL}/${locale}/`;

		entries.push({
			url,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: locale === routing.defaultLocale ? 1.0 : 0.9, // Give default locale higher priority
		});
	}

	return entries;
}
