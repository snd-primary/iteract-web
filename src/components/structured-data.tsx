// Create src/components/structured-data.tsx
export function StructuredData() {
	const structuredData = {
		"@context": "https://schema.org",
		"@type": "WebApplication",
		name: "Iteract",
		applicationCategory: "ProductivityApplication",
		operatingSystem: "Any",
		description:
			"A simple and interactive Pomodoro timer and task management app to boost productivity.",
		url: "https://iteract.trhr-core.com",
		author: {
			"@type": "Person",
			name: "trhr-core",
		},
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "USD",
		},
	};

	return (
		<script
			type="application/ld+json"
			// biome-ignore lint/security/noDangerouslySetInnerHtml: Safe use for structured data with static content
			dangerouslySetInnerHTML={{
				__html: JSON.stringify(structuredData),
			}}
		/>
	);
}

// Then add this to your layout.tsx in the <head> section
