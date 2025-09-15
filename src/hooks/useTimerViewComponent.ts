import React from "react";
import { RoundedTimer } from "../components/TimerView/RoundedTimer";
import { ColorScheme, ExerciseItem, TimerDirection } from "../modes/types";
import { RoundedTimerWithExercises } from "../components/TimerView/RoundedTimerWithExercises";

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
};

export const useTimerViewComponent = (props: TimerViewProps): React.FC<TimerViewProps> => {
    if (props.exercises.length) {
        return RoundedTimerWithExercises;
    }

    return RoundedTimer;
};
