import { ReactElement } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../Resizable";
import { PanelGroupStorage } from "react-resizable-panels";

const memoryStorage: PanelGroupStorage & { items: Record<string, string> } = {
    items: {},
    getItem: (name: string): string | null => memoryStorage.items[name] || null,
    setItem: (name: string, value: string): void => { memoryStorage.items[name] = value },
};

export const TimerWithExercises = ({ Exercises, Timer }: { Exercises: ReactElement, Timer: ReactElement }) => {
    return <ResizablePanelGroup direction="horizontal" autoSaveId="timer-with-exercises" storage={memoryStorage}>
        <ResizablePanel>
            {Exercises}
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={35}>
            <div className="flex items-center h-full w-full justify-center">
                {Timer}
            </div>
        </ResizablePanel>
    </ResizablePanelGroup>;
};
