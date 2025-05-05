"use client";
import { GearIcon } from "@radix-ui/react-icons";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import { useSettings } from "@/lib/hooks/useSettings";
import LocaleSwitcher from "./locale-switcher";

const Header = () => {
	const { openSettings } = useSettings();
	return (
		<header className="sticky top-0 left-0 z-50 bg-background/10 backdrop-blur-md flex items-center justify-between p-4">
			<Button variant="ghost" size="icon" onClick={openSettings}>
				<GearIcon className="h-5 w-5" />
				<span className="sr-only">Settings</span>
			</Button>
			<div className="flex items-center gap-2">
				<LocaleSwitcher />
				<ThemeToggle />
			</div>
		</header>
	);
};

export default Header;
