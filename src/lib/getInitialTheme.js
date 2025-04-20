export const getInitialTheme = (() => {
	try {
		const storedTheme = localStorage.getItem("theme");
		if (storedTheme === "light" || storedTheme === "dark") {
			return storedTheme;
		}
		return window.matchMedia("(prefers-color-schema: dark)").matches
			? "dark"
			: "light";
	} catch (error) {
		return "light";
	}
})();
