import { useCallback, useRef, useState } from "react";
import { TimerRunningState, useTimerRunningState } from "./useSecondsTimer";
import { ParsedRoundSettings } from "../modes/types";
import { SoundVolumeState, useSoundVolumeState } from "./useSoundVolumeState";

export type MainTimerState = {
	isStarted: boolean,
	showRounds: boolean,
	maxRounds: number,
	nextStep: () => void,
	reset: () => void,
} & RoundsState & TimerRunningState & SoundVolumeState;

type RoundsState = {
	executionUid: number,
	currentRound: number,
	currentStep: number,
	isLastRound: boolean,
	isLastStep: boolean,
	isFinished: boolean,
};

const initialState: RoundsState = {
	executionUid: Date.now(),
	currentRound: 1,
	currentStep: 1,
	isLastRound: false,
	isLastStep: false,
	isFinished: false,
};

export const useMainTimerState = (roundSettings: ParsedRoundSettings): MainTimerState => {
	const [roundsState, setRoundsState] = useState<RoundsState>({
		...initialState,
		isLastRound: roundSettings.rounds <= 1,
	});

	const timerRunningState = useTimerRunningState();
	const soundVolumeState = useSoundVolumeState();
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
			isLastRound: roundSettings.rounds <= 1,
			executionUid: Date.now(),
		});
	};

	const nextStep = useCallback(() => {
		setRoundsState(state => {
			const getNextStepIdx = (currentRound: number, currentStep: number) => roundSettings.roundSteps.findIndex((step, idx) => {
				const isLastRound = currentRound >= roundSettings.rounds;
				return idx >= currentStep && (!isLastRound || !step.hideLastRound);
			});

			const nextStepIdx = getNextStepIdx(state.currentRound, state.currentStep);

			if (nextStepIdx > 0) {
				const isLastStep = getNextStepIdx(state.currentRound, nextStepIdx + 1) <= 0;

				return {
					...state,
					currentStep: nextStepIdx + 1,
					isLastStep,
				};
			}

			if (state.currentRound < roundSettings.rounds) {
				const firstStepIdx = roundSettings.roundSteps.findIndex(step => !step.onlyFirstRound);
				const isLastStep = getNextStepIdx(state.currentRound + 1, firstStepIdx + 1) <= 0;

				return {
					...state,
					currentRound: state.currentRound + 1,
					currentStep: firstStepIdx + 1,
					isLastRound: state.currentRound + 1 >= roundSettings.rounds,
					isLastStep,
				};
			}

			return { ...state, isFinished: true };
		});
	}, [roundSettings]);

	return {
		...soundVolumeState,
		...timerRunningState,
		...roundsState,
		isStarted: runningUidRef.current === roundsState.executionUid,
		showRounds: roundSettings.rounds > 0,
		maxRounds: roundSettings.rounds,
		nextStep,
		resume,
		reset,
	};
};
