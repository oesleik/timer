import { useEffect, useState } from "react";
import { MainTimer } from "../components/MainTimer";
import { useMainTimerState } from "../hooks/useMainTimerState";
import { useModeSettings } from "../hooks/useModeSettings";
import { useParsedRouteSettings } from "../hooks/useParsedRouteSettings";
import { Receiver } from "../hooks/useReceiver";

export const ChromeCastReceiverPage = ({ onMessage }: Receiver) => {
	const modeSettings = useModeSettings("AMRAP");
	const roundSettings = useParsedRouteSettings(modeSettings, {});
	const mainTimerState = useMainTimerState(roundSettings);
	const [eventosRecebidos, setEventosRecebidos] = useState<unknown[]>([]);

	useEffect(() => {
		mainTimerState.resume();

		const removeListener = onMessage("teste", ({ data }) => {
			setEventosRecebidos(state => [...state, data]);
		});

		return () => removeListener();
	}, []);

	return <div className="flex flex-col h-full justify-center">
		<pre>{JSON.stringify(eventosRecebidos)}</pre>
		<MainTimer key={mainTimerState.executionUid} roundSettings={roundSettings} mainTimerState={mainTimerState} fullSize />
	</div>;
};
