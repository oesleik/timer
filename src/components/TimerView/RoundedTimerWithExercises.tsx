import React from "react";
import { TimerViewProps } from "../../hooks/useTimerViewComponent";
import { ExerciseItem } from "../../modes/types";
import { RoundedTimer } from "./RoundedTimer";

type ExerciseFrag = {
    type: "reps" | "weight" | "description",
    content: string,
};

export const RoundedTimerWithExercises = (props: TimerViewProps) => {
    return <div className="flex items-center h-full w-full justify-center">
        <ul className="flex-[1_0_50%] resize-x">
            {props.exercises.map((item, idx) => (
                <ViewExerciseItem key={idx} item={item} />
            ))}
        </ul>
        <RoundedTimer {...props} />
    </div>;
};

function ViewExerciseItem({ item }: { item: ExerciseItem }) {
    if (item.type === "title") {
        return <li className="text-7xl font-bold pb-2">{item.description}</li>
    }

    if (item.type === "subtitle") {
        return <li className="text-6xl font-semibold pb-3 text-echo-muted-500">{item.description}</li>
    }

    const frags = parseExerciseItemString(item.description);

    return <li className="text-7xl/16 tracking-wide py-3">
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

function parseExerciseItemString(desc: string): ExerciseFrag[] {
    const frags: ExerciseFrag[] = [];
    let limit = 500; // Por precaução

    while (desc.length && limit > 0) {
        limit--;

        if (/^[^a-zA-Z]+$/.test(desc)) {
            frags.push({
                type: "weight",
                content: desc,
            });

            desc = "";
            continue;
        }

        const repsRes = desc.match(/^\s*\d+(m|x)?\b\s*/);

        if (repsRes && repsRes[0]) {
            frags.push({
                type: "reps",
                content: repsRes[0],
            });

            desc = desc.substring(repsRes[0].length);
            continue;
        }

        const descRes = desc.match(/^.[^\d\/\(\)]*/);
        const descFrag = descRes && descRes[0] ? descRes[0] : desc;

        frags.push({
            type: "description",
            content: descFrag,
        });

        desc = desc.substring(descFrag.length);
    }

    return frags;
}
