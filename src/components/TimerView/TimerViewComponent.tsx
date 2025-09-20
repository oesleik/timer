import { RoundedTimer } from "./RoundedTimer";
import { ColorScheme, ExerciseItem, TimerDirection } from "../../modes/types";
import { TimerWithExercises } from "./TimerWithExercises";
import { Exercises } from "./Exercises";
import { TimerViewModeState } from "../../hooks/useTimerViewModeState";

export type TimerViewProps = {
    description: string,
    direction: TimerDirection,
    formatedTime: string,
    time: number,
    showRounds: boolean,
    currentRound: number,
    maxRounds: number,
    progress: number,
    isFinished: boolean,
    colorScheme: ColorScheme,
    exercises: ExerciseItem[],
    viewModeState: TimerViewModeState,
};

export const TimerViewComponent = (props: TimerViewProps) => {
    const viewMode = props.viewModeState.viewMode;
    const hasExercises = props.exercises.length > 0;

    const TimerView = <RoundedTimer {...props} />;
    const ExercisesView = <Exercises {...props} />

    if (hasExercises && viewMode === "TIMER_WITH_EXERCISES") {
        return <TimerWithExercises Exercises={ExercisesView} Timer={TimerView} />;
    }

    if (hasExercises && viewMode === "ONLY_EXERCISES") {
        return ExercisesView;
    }

    return TimerView;
};
