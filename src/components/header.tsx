"use client";
import { GearIcon } from "@radix-ui/react-icons";
import { ThemeToggle } from "./pomodoro";
import { Button } from "./ui/button";
import { useSettings } from "@/lib/hooks/useSettings";

const Header = () => {
	const { openSettings } = useSettings();
	return (
		<header className="sticky top-0 left-0 z-50 bg-background/20 backdrop-blur-lg flex items-center justify-between p-4">
			<Button
				variant="ghost"
				size="icon"
				onClick={openSettings}
				className="rounded-full"
			>
				<GearIcon className="h-5 w-5" />
				<span className="sr-only">Settings</span>
			</Button>
			<ThemeToggle />
		</header>
	);
};

export default Header;
