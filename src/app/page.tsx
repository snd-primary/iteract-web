import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

export default function RootPage() {
	// ルートアクセス時はデフォルトロケールにリダイレクト
	redirect(`/${routing.defaultLocale}`);
}
