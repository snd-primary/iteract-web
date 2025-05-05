import type React from "react";

interface ProgressCircleProps {
	progress: number; // 0 to 100
	size?: number;
	strokeWidth?: number;
	circleColor?: string;
	progressColor?: string;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
	progress,
	size = 100,
	strokeWidth = 10,
	circleColor = "lightgray",
	progressColor = "blue",
}) => {
	const radius = (size - strokeWidth) / 2;
	const circumference = radius * 2 * Math.PI;
	const offset = circumference - (progress / 100) * circumference;

	return (
		<svg
			width={size}
			height={size}
			viewBox={`0 0 ${size} ${size}`}
			style={{ transform: "rotate(-90deg)" }} // Start from the top
		>
			<title>Progress: {progress}%</title>
			<circle
				stroke={circleColor}
				fill="transparent"
				strokeWidth={strokeWidth}
				r={radius}
				cx={size / 2}
				cy={size / 2}
			/>
			<circle
				stroke={progressColor}
				fill="transparent"
				strokeWidth={strokeWidth}
				strokeDasharray={circumference}
				strokeDashoffset={offset}
				strokeLinecap="round" // Optional: for rounded ends
				r={radius}
				cx={size / 2}
				cy={size / 2}
				style={{ transition: "stroke-dashoffset 0.5s ease" }} // Optional: smooth transition
			/>
		</svg>
	);
};

export default ProgressCircle;
