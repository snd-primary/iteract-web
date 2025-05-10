import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// ウェブサイトにアクセスしてきたユーザーがどの言語を希望しているかを特定するためのミドルウェアを作成。
export default createMiddleware(routing);

export const config = {
	matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
