"use client";

import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { usePathname, Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils"; // Assuming shadcn/ui utils for class merging

export default function LocaleSwitcher() {
	const t = useTranslations("LocaleSwitcher");
	const locale = useLocale();
	const pathname = usePathname();

	return (
		<div className="flex items-center gap-2">
			{/* <p className="text-sm text-muted-foreground">{t('label')}</p> */}
			<div className="flex gap-1">
				{routing.locales.map((cur) => (
					<Link
						key={cur}
						href={pathname}
						locale={cur}
						className={cn(
							"px-3 py-1 rounded-md text-sm font-medium transition-colors",
							locale === cur
								? "bg-primary text-primary-foreground pointer-events-none"
								: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
						)}
						aria-current={locale === cur ? "page" : undefined}
					>
						{t("locale", { locale: cur }).substring(0, 2).toUpperCase()}
					</Link>
				))}
			</div>
		</div>
	);
}
