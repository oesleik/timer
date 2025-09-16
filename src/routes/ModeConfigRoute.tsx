import { useParams } from "react-router";
import { useModeSettings } from "../hooks/useModeSettings";
import { ModeConfigPage } from "../pages/ModeConfigPage";

export const ModeConfigRoute = () => {
	const params = useParams();
	const modeSettings = useModeSettings(params.mode || "");
	return <ModeConfigPage modeSettings={modeSettings} ref={params.mode || ""} />
}
