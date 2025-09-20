import { useState } from "react";
import { ParsedRoundSettings } from "../modes/types";

const TIMER_VIEW_MODE = {
	ONLY_EXERCISES: "Only exercises",
	TIMER_WITH_EXERCISES: "Timer with exercises",
	ONLY_TIMER: "Only timer",
} as const;

export type TimerViewModeState = {
	viewMode: keyof typeof TIMER_VIEW_MODE,
	setViewMode: (mode: keyof typeof TIMER_VIEW_MODE) => void,
}

export const useTimerViewModeState = (roundSettings: ParsedRoundSettings): TimerViewModeState => {
	const [viewMode, setViewMode] = useState<TimerViewModeState["viewMode"]>(
		roundSettings.exercises.length ? "ONLY_EXERCISES" : "ONLY_TIMER"
	);

	return {
		viewMode: viewMode,
		setViewMode: (viewMode) => setViewMode(viewMode),
	};
};

export const findNextTimerViewMode = (currentViewMode: keyof typeof TIMER_VIEW_MODE, hasExercises: boolean): keyof typeof TIMER_VIEW_MODE => {
	let nextViewMode: typeof currentViewMode | null = null;
	let foundViewMode = false;

	if (!hasExercises) {
		// todo improve no exersices view handling
		return "ONLY_TIMER";
	}

	for (nextViewMode of Object.keys(TIMER_VIEW_MODE) as typeof currentViewMode[]) {
		if (foundViewMode) {
			break;
		}

		if (nextViewMode == currentViewMode) {
			foundViewMode = true;
		}
	}

	if (!nextViewMode || !foundViewMode || nextViewMode == currentViewMode) {
		return (Object.keys(TIMER_VIEW_MODE) as typeof currentViewMode[])[0];
	}

	return nextViewMode;
};
