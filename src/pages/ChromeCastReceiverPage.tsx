import { useEffect } from "react";
import { MainTimer } from "../components/MainTimer";
import { useMainTimerState } from "../hooks/useMainTimerState";
import { useModeSettings } from "../hooks/useModeSettings";
import { useParsedRouteSettings } from "../hooks/useParsedRouteSettings";

export const ChromeCastReceiverPage = () => {
	const modeSettings = useModeSettings("AMRAP");
	const roundSettings = useParsedRouteSettings(modeSettings, {});
	const mainTimerState = useMainTimerState(roundSettings);

	useEffect(() => {
		mainTimerState.resume();
	}, []);

	return <div className="flex flex-col h-full justify-center">
		<MainTimer key={mainTimerState.executionUid} roundSettings={roundSettings} mainTimerState={mainTimerState} fullSize />
	</div>;
};
