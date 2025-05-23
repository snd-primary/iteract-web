import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Create the middleware with proper configuration
export default createMiddleware({
	...routing,
	// Always redirect to have the locale in the pathname for non-default locales
	// but allow the default locale to be accessed without prefix
	localePrefix: "as-needed",
});

export const config = {
	// Match all pathnames except for
	// - API routes
	// - Next.js internals
	// - Static files
	matcher: [
		"/((?!api|_next|_vercel|.*\\..*).*)",
		// However, match all pathnames within `/users`, optionally with a locale prefix
		"/([\\w-]+)?/users/(.+)",
	],
};
