import { useEffect } from "react";
import { useSecondsTimer } from "../hooks/useSecondsTimer";
import { ParsedRoundSettings, TimeFormat } from "../modes/types";
import { CircularProgress } from "../pages/CircularProgress";
import { MainTimerState } from "../hooks/useMainTimerState";
import { useTimerSoundEffects } from "../hooks/useTimerSoundEffects";

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
	const {
		duration,
		direction,
		timeFormat,
		colorScheme,
		description,
	} = step;

	const {
		isRunning,
		isFinished,
		currentRound,
		showRounds,
		maxRounds,
		nextStep,
	} = mainTimerState;

	const timer = useSecondsTimer({ maxDuration: duration, direction: direction, isRunning });
	useTimerSoundEffects(timer, mainTimerState);

	useEffect(() => {
		if (timer.isFinished) nextStep();
	}, [timer.isFinished, nextStep]);

	const formatedTime = formatTime(timer.time, timeFormat);
	const fontSizeVariationClass = formatedTime.length > 5 ? "time-with-hour-format" : "";
	const timerColorScheme = "timer-color-scheme-" + (isFinished ? "finished" : colorScheme.toLowerCase());

	return <>
		<div className={`${timerColorScheme} relative timer-circle h-full`}>
			<div className="absolute h-full w-full mx-auto pointer-events-none">
				<CircularProgress progress={timer.progress} direction={direction} />
			</div>

			<div className="flex flex-col items-center justify-center h-full text-center">
				<div className="grow basis-0.5 flex flex-col justify-end">
					{!description && showRounds ? (
						<div className="timer-step-rounds">
							<div className="timer-round-number font-light">
								{currentRound}/{maxRounds}
							</div>
							<div className="timer-round-desc uppercase tracking-widest font-semibold">
								Rounds
							</div>
						</div>
					) : (
						<div className="timer-step-description timer-step-description">
							{description}
						</div>
					)}
				</div>

				<strong className={`timer-clock font-normal timer-step-time ${fontSizeVariationClass}`}>
					{formatedTime}
				</strong>

				{/* Apenas para ocupar espaço e centralizar o timer */}
				<div className="grow basis-0.5 w-full"></div>
			</div>
		</div>
	</>;
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
