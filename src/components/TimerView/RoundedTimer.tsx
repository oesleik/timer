import { CircularProgress } from "../../pages/CircularProgress";
import { TimerViewProps } from "./TimerViewType";

export const RoundedTimer = ({
    description,
    direction,
    formatedTime,
    showRounds,
    currentRound,
    maxRounds,
    progress,
    isFinished,
    colorScheme,
}: TimerViewProps) => {
    const fontSizeVariationClass = formatedTime.length > 5 ? "time-with-hour-format" : "";
    const timerColorScheme = "timer-color-scheme-" + (isFinished ? "finished" : colorScheme.toLowerCase());

    return <div className={`${timerColorScheme} relative timer-circle h-full`}>
        <div className="absolute h-full w-full mx-auto pointer-events-none">
            <CircularProgress progress={progress} direction={direction} />
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
    </div>;
};
