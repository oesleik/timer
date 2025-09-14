import React, { useEffect } from "react";
import { useSecondsTimer } from "../hooks/useSecondsTimer";
import { ParsedRoundSettings, TimeFormat } from "../modes/types";
import { MainTimerState } from "../hooks/useMainTimerState";
import { useTimerSoundEffects } from "../hooks/useTimerSoundEffects";
import { RoundedTimer } from "./TimerView/RoundedTimer";
import { TimerViewProps } from "./TimerView/TimerViewType";

export const MainTimer = ({ roundSettings, mainTimerState, fullSize = false }: {
	roundSettings: ParsedRoundSettings,
	mainTimerState: MainTimerState,
	fullSize?: boolean,
}) => {
	const className = fullSize ? "full-size-timer" : "";

	return (
		<div className={`flex flex-col items-center h-full justify-center ${className}`}>
			{roundSettings.roundSteps.map((step, stepIdx) => {
				const currentStep = stepIdx + 1;

				if (currentStep !== mainTimerState.currentStep) {
					return null;
				}

				const stepId = mainTimerState.currentRound + "_" + currentStep;
				return <StepTimer key={stepId} step={step} mainTimerState={mainTimerState} />;
			})}
		</div>
	);
};

const StepTimer = ({ step, mainTimerState }: {
	step: ParsedRoundSettings["roundSteps"][0],
	mainTimerState: MainTimerState
}) => {
	const timer = useSecondsTimer({
		maxDuration: step.duration,
		direction: step.direction,
		isRunning: mainTimerState.isRunning,
	});

	useTimerSoundEffects(timer, mainTimerState);

	useEffect(() => {
		if (timer.isFinished) mainTimerState.nextStep();
	}, [timer.isFinished, mainTimerState.nextStep]);

	const timerViewProps: TimerViewProps = {
		description: step.description,
		direction: step.direction,
		formatedTime: formatTime(timer.time, step.timeFormat),
		time: timer.time,
		showRounds: mainTimerState.showRounds,
		currentRound: mainTimerState.currentRound,
		maxRounds: mainTimerState.maxRounds,
		progress: timer.progress,
		isFinished: mainTimerState.isFinished,
		colorScheme: step.colorScheme,
	};

	const TimerViewComponent: React.FC<TimerViewProps> = RoundedTimer;

	return <TimerViewComponent {...timerViewProps} />;
};

const formatTime = (time: number, timeFormat: TimeFormat): string => {
	const parts = [];
	const hours = Math.floor(time / 60 / 60);
	const minutes = Math.floor(time / 60 % 60);
	const seconds = Math.floor(time % 60);

	if (timeFormat.includes("H") || time >= 60 * 60) {
		parts.push(("0" + String(hours)).substr(-1));
	}

	if (timeFormat.includes("MM") || time > 60) {
		parts.push(("00" + String(minutes)).substr(-2));
	}

	if (!parts.length && time == 60) {
		return "60";
	} else if (timeFormat.includes("SS") || time >= 10) {
		parts.push(("00" + String(seconds)).substr(-2));
	} else {
		parts.push(("0" + String(seconds)).substr(-1));
	}

	return parts.join(":");
}
