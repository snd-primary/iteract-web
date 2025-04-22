import { useAtom } from "jotai";
import { todayCompletedCountAtom } from "@/store/records";

export function CompletedCounter() {
	const [completedCount] = useAtom(todayCompletedCountAtom);

	return (
		<div className="flex flex-col items-center justify-center mt-8">
			<p className="text-sm text-muted-foreground">
				Today&apos;s completed sessions
			</p>
			<p className="text-3xl font-bold">{completedCount}</p>
		</div>
	);
}
