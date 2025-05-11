"use client";

import { Button } from "./ui/button";
import { GearIcon } from "@radix-ui/react-icons";
import { useSettings } from "@/lib/hooks/useSettings";

import LocaleSwitcher from "./locale-switcher";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import { useTranslations } from "next-intl";

export const Footer = () => {
	const t = useTranslations("footer");
	const keys = ["privacyPolicy", "feedback"] as const;
	const currentYear = new Date().getFullYear();

	return (
		<footer className="w-full h-auto bg-background grid grid-cols-1 items-center justify-center text-center gap-4 self-end pb-4">
			<div className="flex justify-center items-center gap-4">
				{keys.map((key) => (
					<Dialog key={key}>
						<DialogTrigger asChild>
							<button
								type="button"
								className="text-xs text-muted-foreground opacity-50 hover:opacity-90 pointer-events-auto cursor-pointer ease-in-out transition-all duration-200"
							>
								{t(`${key}.title`)}
							</button>
						</DialogTrigger>

						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>{t(`${key}.title`)}</DialogTitle>
							</DialogHeader>
							<DialogDescription className="whitespace-pre-line leading-6">
								{t.rich(`${key}.content`, {
									link: (chunks) => (
										<a
											href="https://policies.google.com/technologies/partner-sites"
											rel="noreferrer noopener"
											target="_blank"
											className="text-blue-500 hover:text-blue-600 focus:ring-1 focus:ring-blue-500 focus:outline-none"
										>
											{chunks}
										</a>
									),
								})}
							</DialogDescription>
							{key === "feedback" && (
								<div className="overflow-hidden flex items-center gap-4 pt-8 ">
									<div className="h-fit block bg-linear-to-r from-cyan-500 to-blue-500 bg-clip-text">
										<span className="text-sm text-transparent font-departure leading-8">
											Follow @trhr_core &gt;&gt;
										</span>
									</div>

									<a
										href={"https://x.com/trhr_core"}
										className="p-3 rounded-full border-1 focus:ring-1 hover:ring-1 grid w-fit h-fit ease-in-out transition-all duration-200 "
										target="_blank"
										rel="noreferrer noopener"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											version="1.1"
											id="Layer_1"
											width="20"
											height="20"
											viewBox="0 0 24 24"
										>
											<title>XIcon</title>
											<path
												d="M14.095479,10.316482L22.286354,1h-1.940718l-7.115352,8.087682L7.551414,1H1l8.589488,12.231093L1,23h1.940717  l7.509372-8.542861L16.448587,23H23L14.095479,10.316482z M11.436522,13.338465l-0.871624-1.218704l-6.924311-9.68815h2.981339  l5.58978,7.82155l0.867949,1.218704l7.26506,10.166271h-2.981339L11.436522,13.338465z"
												fill="currentColor"
											/>
										</svg>
									</a>
								</div>
							)}
						</DialogContent>
					</Dialog>
				))}
			</div>
			<p className="text-xs text-muted-foreground opacity-50 select-none">
				© {currentYear} trhr-core
			</p>
			<div className="flex items-center justify-center">
				<LocaleSwitcher />
			</div>
		</footer>
	);
};
