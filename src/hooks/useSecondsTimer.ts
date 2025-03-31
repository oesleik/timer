import { useEffect, useState } from "react";

export type TimerState = {
	time: number,
	pause: () => void,
	resume: () => void,
	reset: () => void,
	isRunning: boolean,
	isFinished: boolean,
};

export const useSecondsTimer = ({
	maxDuration,
	autoStart = false,
}: {
	maxDuration?: number | null,
	autoStart?: boolean,
}): TimerState => {
	const [time, setTime] = useState(0);
	const [isRunning, setIsRunning] = useState(autoStart);
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
