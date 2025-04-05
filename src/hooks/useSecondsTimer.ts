import { useEffect, useState } from "react";

export type TimerState = {
	time: number,
	elapsed: number,
	remaining: number,
	isFinished: boolean,
	progress: number,
};

export type TimerRunningState = {
	isRunning: boolean,
	pause: () => void,
	resume: () => void,
}

export const useTimerRunningState = (): TimerRunningState => {
	const [isRunning, setIsRunning] = useState(false);

	return {
		isRunning,
		pause: () => setIsRunning(false),
		resume: () => setIsRunning(true),
	};
};

export const useSecondsTimer = ({
	maxDuration,
	direction,
	isRunning,
}: {
	maxDuration: number,
	direction: "ASC" | "DESC",
	isRunning: boolean,
}): TimerState => {
	const [elapsed, setElapsed] = useState(0);
	const remaining = Math.max(0, maxDuration - elapsed)
	const isFinished = remaining == 0;

	useEffect(() => {
		if (!isRunning || isFinished) return;

		const timer = setInterval(() => {
			setElapsed(previousTime => previousTime + 1);
		}, 1000);

		return () => clearTimeout(timer);
	}, [isRunning, isFinished]);

	return {
		time: direction === "DESC" ? remaining : elapsed,
		elapsed,
		remaining,
		isFinished,
		progress: isFinished ? 100 : elapsed * 100 / (maxDuration - 1),
	};
};
