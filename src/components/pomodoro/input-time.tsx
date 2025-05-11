"use client";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type Props = {
	label: string;
	id: string;
	name: string;
	min: string;
	max: string;
	value: number;
	annotation?: string;
	isMinutes?: boolean;
	className?: string;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const InputTime: React.FC<Props> = ({ isMinutes = true, ...props }) => {
	const t = useTranslations("settings.unit");
	return (
		<div className={cn("", props.className)}>
			<label htmlFor={props.name} className="text-sm pl-1">
				{props.label}
			</label>
			<div className="flex items-center gap-2 mt-0.5">
				<Input
					type="number"
					id={props.id}
					name={props.name}
					min={props.min}
					max={props.max}
					value={props.value}
					onChange={props.onChange}
					className="max-w-16 border border-input outline py-2 text-sm"
				/>
				{isMinutes ? (
					<span>{t("unitMinutes")}</span>
				) : (
					<span>{t("unitCount")}</span>
				)}
			</div>
			{props.annotation && (
				<p className="text-xs text-muted-foreground mt-1 pl-1">
					{props.annotation}
				</p>
			)}
		</div>
	);
};
