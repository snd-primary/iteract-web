import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			// disallow: '/private/', // Example: Disallow crawling specific paths
		},
		sitemap: `${BASE_URL}/sitemap.xml`,
	};
}
