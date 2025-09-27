import { useState } from "react";
import { ParsedRoundSettings } from "../modes/types";

export const TIMER_VIEW_MODE = {
	TIMER_WITH_EXERCISES: "Timer with exercises",
	ONLY_EXERCISES: "Only exercises",
	ONLY_TIMER: "Only timer",
} as const;

type TimerViewOptions = {
	showTitle: boolean,
	showWeights: boolean,
};

export type TimerViewModeState = {
	viewMode: keyof typeof TIMER_VIEW_MODE,
	setViewMode: (mode: keyof typeof TIMER_VIEW_MODE) => void,
	viewOptions: TimerViewOptions,
	setViewOptions: (options: Partial<TimerViewOptions>) => void,
}

export const useTimerViewModeState = (roundSettings: ParsedRoundSettings): TimerViewModeState => {
	const [viewMode, setViewMode] = useState<TimerViewModeState["viewMode"]>(
		roundSettings.exercises.length ? "TIMER_WITH_EXERCISES" : "ONLY_TIMER"
	);

	const [viewOptions, setViewOptions] = useState<TimerViewOptions>({
		showTitle: true,
		showWeights: true,
	});

	return {
		viewMode: viewMode,
		setViewMode: (viewMode) => setViewMode(viewMode),
		viewOptions: viewOptions,
		setViewOptions: (newOptions) => setViewOptions(curOptions => ({ ...curOptions, ...newOptions })),
	};
};
