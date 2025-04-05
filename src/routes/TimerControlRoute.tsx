import { useLocation, useParams } from "react-router";
import { useModeSettings } from "../hooks/useModeSettings";
import { TimerControlPage } from "../pages/TimerControlPage";
import { useParsedRouteSettings } from "../hooks/useParsedRouteSettings";

export const TimerControlRoute = () => {
	const params = useParams();
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);

	const customSettings: Record<string, string> = {};
	queryParams.forEach((value, name) => {
		customSettings[name] = value;
	});

	const modeSettings = useModeSettings(params.mode || "");
	const parsedRoundSettings = useParsedRouteSettings(modeSettings, customSettings);
	return <TimerControlPage modeSettings={modeSettings} roundSettings={parsedRoundSettings} />;
}
