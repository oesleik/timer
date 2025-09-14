import { ColorScheme, TimerDirection } from "../../modes/types";

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
};
