import { useParams } from "react-router";
import { TimerPage } from "../pages/TimerPage";
import { useModeSettings } from "../hooks/useModeSettings";

export const TimerRoute = () => {
	const params = useParams();
	const modeSettings = useModeSettings(params.mode || "");
	return <TimerPage modeSettings={modeSettings} />
}
