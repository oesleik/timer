import { useCallback, useEffect } from "react";

export function useClickOutside(ref: React.RefObject<HTMLElement | null> | React.RefObject<HTMLElement | null>[], callback: () => void) {
    const callbackRef = useCallback(callback, [callback]);
    const refs = Array.isArray(ref) ? ref : [ref];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (!refs.some(r => r.current && r.current.contains(event.target as Node))) {
                callbackRef();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [callbackRef]);
}
