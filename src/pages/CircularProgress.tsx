export const CircularProgress = ({ progress, direction = "DESC" }: {
	progress: number,
	direction: "ASC" | "DESC",
}) => {
	progress = progress / 100;

	if (direction == "DESC") {
		progress = 1 - progress;
	}

	const strokeWidth = 1.4;
	const radius = Math.floor(50 - strokeWidth);
	const circumference = 2 * Math.PI * radius;

	const offsetDirectionFactor = direction == "DESC" ? 1 : -1;
	const offset = circumference * (1 - progress) * offsetDirectionFactor;

	return (
		<svg viewBox={`0 0 100 100`} className="h-full w-full">
			<circle
				cx={50}
				cy={50}
				r={radius}
				fill="none"
				strokeDasharray={circumference}
				strokeWidth={strokeWidth}
				className="circle-progress-bar"
			/>
			<circle
				cx={50}
				cy={50}
				r={radius}
				fill="none"
				strokeWidth={strokeWidth}
				strokeDasharray={circumference}
				strokeDashoffset={offset}
				strokeLinecap="round"
				transform={`rotate(-90 50 50)`}
				className="circle-progress-bar-active"
				style={{
					transition: "stroke-dashoffset 1s linear",
				}}
			/>
		</svg>
	);
};
