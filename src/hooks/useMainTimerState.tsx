import { useCallback, useRef, useState } from "react";
import { TimerRunningState, useTimerRunningState } from "./useSecondsTimer";
import { ParsedRoundSettings } from "./useModeSettings";

export type MainTimerState = {
	isStarted: boolean,
	showRounds: boolean,
	maxRounds: number,
	nextStep: () => void,
	reset: () => void,
} & RoundsState & TimerRunningState;

type RoundsState = {
	executionUid: number,
	currentRound: number,
	currentStep: number,
	isFinished: boolean,
};

const initialState: RoundsState = {
	executionUid: Date.now(),
	currentRound: 1,
	currentStep: 1,
	isFinished: false,
};

export const useMainTimerState = (roundSettings: ParsedRoundSettings): MainTimerState => {
	const [roundsState, setRoundsState] = useState<RoundsState>(initialState);
	const timerRunningState = useTimerRunningState();
	const runningUidRef = useRef(0);

	const resume = () => {
		runningUidRef.current = roundsState.executionUid;
		timerRunningState.resume();
	};

	const reset = () => {
		runningUidRef.current = 0;
		timerRunningState.pause();

		setRoundsState({
			...initialState,
			executionUid: Date.now(),
		});
	};

	const nextStep = useCallback(() => {
		setRoundsState(state => {
			const isLastRound = state.currentRound >= roundSettings.rounds;

			const nextStepIdx = roundSettings.roundSteps.findIndex((step, idx) => {
				return idx >= state.currentStep && (!isLastRound || !step.hideLastRound);
			});

			if (nextStepIdx > 0) {
				return { ...state, currentStep: nextStepIdx + 1 };
			}

			if (state.currentRound < roundSettings.rounds) {
				const firstStepIdx = roundSettings.roundSteps.findIndex(step => !step.onlyFirstRound);
				return { ...state, currentRound: state.currentRound + 1, currentStep: firstStepIdx + 1 };
			}

			return { ...state, isFinished: true };
		});
	}, [roundSettings]);

	return {
		isStarted: runningUidRef.current === roundsState.currentRound,
		...timerRunningState,
		...roundsState,
		showRounds: roundSettings.rounds > 0,
		maxRounds: roundSettings.rounds,
		nextStep,
		resume,
		reset,
	};
};
