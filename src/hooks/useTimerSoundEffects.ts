import { useEffect, useRef } from "react";
import { MainTimerState } from "./useMainTimerState";
import { TimerState } from "./useSecondsTimer";
import { APP_CONFIG } from "../app_config";

export const useTimerSoundEffects = (timer: TimerState, mainTimerState: MainTimerState) => {
	const { remaining } = timer;
	const { isRunning, isFinished: _isFinished, isLastRound, isLastStep, isMuted } = mainTimerState;
	const isFinished = _isFinished || (remaining == 0 && isLastRound && isLastStep);

	const sfxCountdownRef = useRef(new Audio(APP_CONFIG.SFX_COUNTDOWN_BEEP));
	const sfxTimerFinishedRef = useRef(new Audio(APP_CONFIG.SFX_TIMER_FINISHED_BEEP));
	const sfxCountdownFinishedRef = useRef(new Audio(APP_CONFIG.SFX_COUNTDOWN_FINISHED_BEEP));

	useEffect(() => {
		if (isMuted || !isRunning) return;

		if ([1, 2, 3].includes(remaining)) {
			sfxCountdownRef.current.currentTime = 0;
			sfxCountdownRef.current.play();
			return;
		}

		if (isFinished) {
			sfxTimerFinishedRef.current.currentTime = 0;
			sfxTimerFinishedRef.current.play();
			let repeatFor = 1;

			const t = setInterval(() => {
				sfxTimerFinishedRef.current.currentTime = 0;
				sfxTimerFinishedRef.current.play();
				repeatFor--;

				if (repeatFor <= 0) {
					clearTimeout(t);
				}
			}, 1000);

			return () => clearInterval(t);
		}

		if (remaining == 0) {
			sfxCountdownFinishedRef.current.currentTime = 0;
			sfxCountdownFinishedRef.current.play();
			return;
		}
	}, [remaining, isFinished, isRunning, isMuted]);
};
