import React from "react";
import { TimerViewProps } from "../../hooks/useTimerViewComponent";
import { ExerciseItem } from "../../modes/types";
import { RoundedTimer } from "./RoundedTimer";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../Resizable";
import { PanelGroupStorage } from "react-resizable-panels";

type ExerciseFrag = {
    type: "reps" | "weight" | "description",
    content: string,
};

const memoryStorage: PanelGroupStorage & { items: Record<string, string> } = {
    items: {},
    getItem: (name: string): string | null => memoryStorage.items[name] || null,
    setItem: (name: string, value: string): void => { memoryStorage.items[name] = value },
};

export const RoundedTimerWithExercises = (props: TimerViewProps) => {
    return <ResizablePanelGroup direction="horizontal" autoSaveId="rounded-timer-with-exercises" storage={memoryStorage}>
        <ResizablePanel>
            <div className="grid place-items-center h-full overflow-y-auto overflow-x-hidden max-content-height custom-scrollbar">
                <ul>
                    {props.exercises.map((item, idx) => (
                        <ViewExerciseItem key={idx} item={item} />
                    ))}
                </ul>
            </div>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={35}>
            <div className="flex items-center h-full w-full justify-center">
                <RoundedTimer {...props} />
            </div>
        </ResizablePanel>
    </ResizablePanelGroup>;
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
