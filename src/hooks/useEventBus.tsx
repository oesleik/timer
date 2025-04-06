import { useCallback } from "react";

type Event<T = unknown> = {
	data: T
}

type Handler = <T = unknown>(event: Event<T>) => void;

const listeners: Record<string, Record<string, Handler[]>> = {};

export const useCustomEventBus = (uid: string) => {
	listeners[uid] = listeners[uid] || {};

	const off = useCallback((eventName: string, handler: Handler) => {
		if (!listeners[uid][eventName]) return;
		listeners[uid][eventName] = listeners[uid][eventName].filter(h => h !== handler);
	}, [uid]);

	const on = useCallback((eventName: string, handler: Handler): () => void => {
		listeners[uid][eventName] = listeners[uid][eventName] || [];
		listeners[uid][eventName].push(handler);
		return () => off(eventName, handler);
	}, [uid, off]);

	const trigger = useCallback((eventName: string, event: Event) => {
		if (!listeners[uid][eventName]) return;
		listeners[uid][eventName].forEach(h => h(event));
	}, [uid]);

	return { on, off, trigger };
};

