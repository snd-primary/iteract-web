"use client";

import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GlobeIcon } from "@radix-ui/react-icons";

export default function LocaleSwitcher() {
	const t = useTranslations("LocaleSwitcher");
	const locale = useLocale();
	const pathname = usePathname();
	const router = useRouter();

	const handleLocaleChange = (newLocale: string) => {
		router.replace(pathname, { locale: newLocale });
	};

	const getLocaleTitle = (locale: "en" | "ja" | "ko") => {
		switch (locale) {
			case "en":
				return "English";
			case "ja":
				return "日本語";
			case "ko":
				return "한국어";
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<GlobeIcon className="h-5 w-5" />
					<span className="sr-only">{t("label")}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{routing.locales.map((cur) => (
					<DropdownMenuItem
						key={cur}
						onClick={() => handleLocaleChange(cur)}
						disabled={locale === cur}
					>
						{getLocaleTitle(cur)}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
