"use client";
import { ThemeToggle } from "./pomodoro";
import { Settings } from "./pomodoro/setting";

const Header = () => {
	return (
		<header className="sticky top-0 left-0 z-50 bg-background/20 backdrop-blur-lg flex items-center justify-between">
			<Settings />
			<ThemeToggle />
		</header>
	);
};

export default Header;
