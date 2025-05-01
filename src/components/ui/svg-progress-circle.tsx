import type { PomodoroSettings } from "@/store/settings";
import type { TimerState } from "@/store/timer";
import { useMemo } from "react";

type Props = {
	timer: TimerState;
	settings: PomodoroSettings;
};

export const SVGProgressCircle: React.FC<Props> = ({ timer, settings }) => {
	// 現在のタイマーの最大時間を取得
	const maxTime = useMemo(() => {
		switch (timer.mode) {
			case "focus":
				return settings.workTime * 60;
			case "shortBreak":
				return settings.shortBreakTime * 60;
			case "longBreak":
				return settings.longBreakTime * 60;
			default:
				return settings.workTime * 60; // デフォルトは作業時間
		}
	}, [timer.mode, settings]);

	const progressRatio = useMemo(() => {
		if (timer.mode === "idle") return 1;
		return timer.timeRemaining / maxTime;
	}, [timer.mode, timer.timeRemaining, maxTime]);

	// 円弧のパスを計算
	const arcPath = useMemo(() => {
		// 円の中心座標
		const centerX = 50;
		const centerY = 50;
		const radius = 50;

		// 360度 * 残り時間の割合
		const angle = 360 * progressRatio;

		// 角度をラジアンに変換
		const endAngle = (90 - angle) * (Math.PI / 180);

		// 円弧の終点座標を計算
		const endX = centerX + radius * Math.cos(endAngle);
		const endY = centerY - radius * Math.sin(endAngle);

		// 大きい円弧かどうか（180度以上かどうか）
		const largeArcFlag = angle > 180 ? 1 : 0;

		// パスを作成
		if (angle >= 360) {
			// 完全な円の場合
			return `M${centerX},${centerY - radius} A${radius},${radius} 0 1,1 ${
				centerX - 0.001
			},${centerY - radius} A${radius},${radius} 0 1,1 ${centerX},${
				centerY - radius
			}`;
		}
		// 0%の場合は何も表示しない
		if (angle <= 0) {
			return "";
		}
		// 通常の円弧
		return `M${centerX},${centerY} L${centerX},${
			centerY - radius
		} A${radius},${radius} 0 ${largeArcFlag},1 ${endX},${endY} Z`;
	}, [progressRatio]);

	return (
		<svg
			width={120}
			height={120}
			viewBox="0 0 100 100"
			xmlns="http://www.w3.org/2000/svg"
			className="transition-all duration-300 ease-linear "
		>
			<title>Timer progress</title>

			{/* フィルター定義 */}
			<defs>
				<filter id="jagged-edge" x="0%" y="0%" width="110%" height="110%">
					{/* ↑ x, y, width, height でフィルター効果の適用範囲を少し広げておくと、
               エッジの歪みが途切れるのを防げることがあります */}

					{/* ノイズ生成 */}
					<feTurbulence
						type="fractalNoise"
						baseFrequency="1" // ガタガタの細かさ (値を調整)
						numOctaves="1" // ノイズの複雑さ (値を調整)
						result="noise"
						seed="0" // seed を指定すると毎回同じノイズパターンになる
					/>

					{/* ノイズによる変位 */}
					<feDisplacementMap
						in="SourceGraphic" // 元の図形に適用
						in2="noise" // 上で生成したノイズを使う
						scale="2" // ガタつきの強さ (値を調整)
						xChannelSelector="R"
						yChannelSelector="G"
					/>
				</filter>
			</defs>

			{/* 背景円 */}
			<circle
				cx="50"
				cy="50"
				r="50"
				fill="transparent"
				stroke="currentColor"
				strokeWidth="1"
				opacity="0.2"
			/>

			{/* プログレス表示 */}
			{arcPath && (
				<path
					d={arcPath}
					fill={"red"}
					opacity="0.8"
					className="transition-all duration-300 ease-linear CUSTOM_SVG "
					// filter="url(#jagged-edge)"
				/>
			)}

			{/* 内側の小さい円（オプション） */}
			<circle
				cx="50"
				cy="50"
				r="25"
				fill="transparent"
				stroke="currentColor"
				strokeWidth="1"
				opacity="0.1"
			/>
		</svg>
	);
};
