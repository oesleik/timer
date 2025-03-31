import React, { useState, useEffect } from "react";

const useSecondsTimer = ({
	autoStart = false,
	startFrom,
	maxDuration,
}: {
	autoStart?: boolean,
	maxDuration?: number,
	startFrom?: number,
}) => {
	const [isRunning, setIsRunning] = useState(autoStart);
	const [time, setTime] = useState(startFrom || 0);
	const isFinished = maxDuration != null && time >= maxDuration;

	useEffect(() => {
		if (!isRunning) return;

		const timer = setInterval(() => {
			setTime(previousTime => previousTime + 1);
		}, 1000);

		return () => clearTimeout(timer);
	}, [isRunning]);

	useEffect(() => {
		if (isFinished) {
			setIsRunning(false);
		}
	}, [isFinished]);

	return {
		time,
		pause: () => setIsRunning(false),
		resume: () => setIsRunning(true),
		reset: () => {
			setIsRunning(false);
			setTime(0);
		},
		isRunning,
		isFinished
	};
};

export const Timer: React.FC = () => {
	const [mode, setMode] = useState("AMRAP");
	const timer = useSecondsTimer({ autoStart: true, maxDuration: 3 });

	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h1 className="text-6xl font-bold">{timer.time}s</h1>
			<p className="text-xl mt-2">Mode: {mode}</p>
			<div className="mt-4">
				<TimerActions timer={timer} />
			</div>
			<div className="mt-6">
				<label className="text-lg mr-2">Mode:</label>
				<select
					className="p-2 bg-gray-700 text-white rounded-lg"
					value={mode}
					onChange={(e) => setMode(e.target.value)}
				>
					<option value="AMRAP">AMRAP</option>
					<option value="EMOM">EMOM</option>
					<option value="Tabata">Tabata</option>
				</select>
			</div>
		</div>
	);
};

const TimerActions = ({ timer }: { timer: ReturnType<typeof useSecondsTimer> }) => {
	if (timer.isFinished) {
		return <>
			<button
				className="px-6 py-2 bg-green-500 rounded-lg mr-4"
				onClick={() => {
					timer.reset();
					timer.resume();
				}}
			>
				Reiniciar
			</button>
		</>;
	}

	if (timer.isRunning) {
		return <>
			{timer.isRunning && (
				<button
					className="px-6 py-2 bg-red-500 rounded-lg mr-4"
					onClick={() => timer.pause()}
				>
					Parar
				</button>
			)}
		</>;
	}

	if (!timer.time) {
		return <>
			<button
				className="px-6 py-2 bg-green-500 rounded-lg mr-4"
				onClick={() => timer.resume()}
			>
				Iniciar
			</button>
		</>;
	}

	return <>
		<button
			className="px-6 py-2 bg-green-500 rounded-lg mr-4"
			onClick={() => timer.resume()}
		>
			Continuar
		</button>
		<button
			className="px-6 py-2 bg-blue-500 rounded-lg"
			onClick={() => timer.reset()}
		>
			Zerar
		</button>
	</>;
}
