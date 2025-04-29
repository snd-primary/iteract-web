export const ProgressCircle: React.FC = () => {
	// アニメーション状態を変更する関数
	return (
		<div
			style={{
				width: "100px",
				height: "100px",
				borderRadius: "50%",
				backgroundImage: `conic-gradient(
			#003681 0.1%,
			#003681 var(--angle, 100%),
			#d9d9d9 var(--angle, 100%) 100%
		)`,
			}}
		/>
	);
};
