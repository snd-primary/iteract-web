import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type ContainerProps = {
	children: ReactNode;
	className?: string;
};

export function Container({ children, className }: ContainerProps) {
	return (
		<div
			className={cn(
				"mx-auto w-full max-w-md px-4 py-8 flex flex-col items-center justify-center font-departure",
				className,
			)}
		>
			{children}
		</div>
	);
}
