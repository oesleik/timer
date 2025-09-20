import React from "react";
import { TimerViewProps } from "./TimerViewComponent";
import { ExerciseItem } from "../../modes/types";
import { parseExerciseItemString } from "../../utils/parseExerciseItem";

export const Exercises = (props: TimerViewProps) => {
    return (
        <div className="grid place-items-center h-full w-full overflow-y-auto overflow-x-hidden max-content-height custom-scrollbar">
            <ul>
                {props.exercises.map((item, idx) => (
                    <ViewExerciseItem key={idx} item={item} />
                ))}
            </ul>
        </div>
    );
};

function ViewExerciseItem({ item }: { item: ExerciseItem }) {
    if (item.type === "title") {
        return <li className="text-7xl font-bold pb-2">{item.description}</li>
    }

    if (item.type === "subtitle") {
        return <li className="text-6xl font-semibold pb-3 text-echo-muted-500">{item.description}</li>
    }

    const frags = parseExerciseItemString(item.description);

    return <li className="text-7xl/16 tracking-wide py-3 min-h-[1em]">
        {frags.map((frag, idx) => {
            if (frag.type === "reps") {
                return <span key={idx} className="text-echo-yellow-500">{frag.content}</span>;
            }

            if (frag.type === "weight") {
                return <span key={idx} className="text-echo-muted-500 text-6xl">{frag.content}</span>;
            }

            return <React.Fragment key={idx}>{frag.content}</React.Fragment>;
        })}
    </li>
}
