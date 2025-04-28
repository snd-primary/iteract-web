interface TimerIndicatorProps {
	/** 現在の残り時間（秒など、maxTimeと同じ単位） */
	currentTime: number;
	/** タイマーの最大時間（秒など、currentTimeと同じ単位） */
	maxTime: number;
	/** ゲージの高さ（Tailwindのクラス名、例: 'h-4'）*/
	height?: string;
	/** ゲージの背景色（Tailwindのクラス名、例: 'bg-gray-200'）*/
	bgColor?: string;
	/** 残り時間が多い時の色（Tailwindのクラス名、例: 'bg-green-500'）*/
	highColor?: string;
	/** 残り時間が中程度の時の色（Tailwindのクラス名、例: 'bg-yellow-500'）*/
	mediumColor?: string;
	/** 残り時間が少ない時の色（Tailwindのクラス名、例: 'bg-red-500'）*/
	lowColor?: string;
}

const TimerIndicator: React.FC<TimerIndicatorProps> = ({
	currentTime,
	maxTime,
	height = "h-4", // デフォルトの高さ
	bgColor = "bg-gray-200 dark:bg-gray-700", // デフォルトの背景色
	highColor = "bg-green-500", // デフォルトの色（高）
	mediumColor = "bg-yellow-500", // デフォルトの色（中）
	lowColor = "bg-red-500", // デフォルトの色（低）
}) => {
	// 0除算を防ぎ、currentTimeがマイナスにならないようにする
	const validCurrentTime = Math.max(0, currentTime);
	const validMaxTime = Math.max(1, maxTime); // maxTimeが0以下にならないように保証

	// 残り時間の割合を計算 (0% ~ 100%)
	const percentage = (validCurrentTime / validMaxTime) * 100;

	// 残り時間の割合に応じてバーの色を決定
	let barColor = highColor;
	if (percentage < 50) {
		barColor = mediumColor;
	}
	if (percentage < 20) {
		barColor = lowColor;
	}

	return (
		<div className={`w-full ${bgColor} rounded-full ${height} overflow-hidden`}>
			{/* 残量を示すバー */}
			<div
				className={`${barColor} ${height} rounded-full transition-all duration-300 ease-linear`}
				style={{ width: `${percentage}%` }}
				aria-valuenow={percentage}
				aria-valuemin={0}
				aria-valuemax={100}
				aria-label="残り時間インジケーター"
			/>
		</div>
	);
};

export default TimerIndicator;
