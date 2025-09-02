import { useParams } from "react-router";
import { useModeSettings } from "../hooks/useModeSettings";
import { ModeSelectConfigPage } from "../pages/ModeSelectConfigPage";

export const ModeSelectConfigRoute = () => {
	const params = useParams();
	const modeSettings = useModeSettings(params.mode || "");
	return <ModeSelectConfigPage modeSettings={modeSettings} ref={params.mode || ""} />
}
