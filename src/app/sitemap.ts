import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing"; // Assuming routing config is here

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
	const entries: MetadataRoute.Sitemap = [];

	// Add entries for each locale
	for (const locale of routing.locales) {
		entries.push({
			url: `${BASE_URL}/${locale}`,
			lastModified: new Date(), // Or a more specific date if available
			changeFrequency: "weekly", // Adjust as needed ('always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never')
			priority: 1, // Priority for the homepage (adjust for other pages)
		});
	}

	// Add other static pages here if any, for each locale
	// Example:
	// for (const locale of routing.locales) {
	//     entries.push({
	//         url: `${BASE_URL}/${locale}/about`,
	//         lastModified: new Date(),
	//         changeFrequency: 'monthly',
	//         priority: 0.8,
	//     });
	// }

	return entries;
}
