import { useReceiver } from "../hooks/useReceiver";
import { ChromeCastReceiverPage } from "../pages/ChromeCastReceiverPage";

export const ChromeCastReceiverRoute = () => {
	const props = useReceiver();
	if (!props.isLoaded) return null;
	return <ChromeCastReceiverPage {...props} />
}
