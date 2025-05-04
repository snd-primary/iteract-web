import { useAtom } from "jotai";
import { todayCompletedCountAtom } from "@/store/records";
import { useTranslations } from "next-intl";

export function CompletedCounter() {
	const [completedCount] = useAtom(todayCompletedCountAtom);

	const t = useTranslations("stats");

	return (
		<div className="flex flex-col items-center justify-center">
			<p className="text-sm text-muted-foreground">{t("todayCompleted")}</p>
			<p className="text-3xl font-bold">{completedCount}</p>
		</div>
	);
}
