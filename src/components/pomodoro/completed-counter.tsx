"use client";
import { useAtom } from "jotai";
import { todayCompletedCountAtom } from "@/store/records";
import { useTranslations } from "next-intl";

export function CompletedCounter() {
	const [completedCount] = useAtom(todayCompletedCountAtom);

	const t = useTranslations("stats");

	return (
		<div className="flex items-center justify-center select-none gap-4">
			<p className="text-sm text-muted-foreground">{t("todayCompleted")}</p>
			<p className="text-xl">{completedCount}</p>
		</div>
	);
}
