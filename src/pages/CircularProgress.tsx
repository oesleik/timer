export const CircularProgress = ({ progress, size = 100, direction = "DESC" }: { progress: number; size?: number, direction?: "ASC" | "DESC" }) => {
	if (direction == "DESC") {
		progress = 1 - progress;
	}

	const offsetDirectionFactor = direction == "DESC" ? 1 : -1;
	const radius = size / 2 - 5; // Ajusta o raio para o tamanho do SVG
	const circumference = 2 * Math.PI * radius;
	const offset = circumference * (1 - progress) * offsetDirectionFactor;

	return (
		<svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full">
			<circle
				cx={size / 2}
				cy={size / 2}
				r={radius}
				fill="none"
				stroke="#333"
				strokeDasharray={circumference}
				strokeWidth="1.4"
				opacity="0.2"
				className="circle-progress-bar"
			/>
			<circle
				cx={size / 2}
				cy={size / 2}
				r={radius}
				fill="none"
				stroke="limegreen"
				strokeWidth="1.4"
				strokeDasharray={circumference}
				strokeDashoffset={offset}
				strokeLinecap="round"
				transform={`rotate(-90 ${size / 2} ${size / 2})`}
				className="circle-progress-bar-active"
				style={{
					transition: "stroke-dashoffset 1s linear",
				}}
			/>
		</svg>
	);
};
