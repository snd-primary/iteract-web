import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-md px-4 py-8 flex flex-col items-center justify-center",
        className
      )}
    >
      {children}
    </div>
  );
}
