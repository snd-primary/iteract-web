import type React from "react";

type Props = {
	title: string;
	children: React.ReactNode;
};

export const SettingBlock: React.FC<Props> = ({ ...props }) => {
	return (
		<div className="w-full h-full max-w-full max-h-full grid-cols-1 grid gap-4  border p-3">
			<h3 className="text-md font-medium border-b pb-1">{props.title}</h3>
			{props.children}
		</div>
	);
};
