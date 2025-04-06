import { useChromecastSender } from "use-chromecast-caf-sender";
import { APP_CONFIG } from "../app_config";
import { useCallback, useEffect } from "react";

export const useSender = () => {
	const { cast } = useChromecastSender();

	useEffect(() => {
		if (!cast) return;

		cast.framework.CastContext.getInstance().setOptions({
			receiverApplicationId: APP_CONFIG.CHROMECAST_APP_ID,
			autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
		});
	}, [cast]);

	const sendMessage = useCallback((action: string, data?: unknown) => {
		if (!cast) return;

		const session = cast.framework.CastContext.getInstance().getCurrentSession();
		if (!session) return;

		session.sendMessage(APP_CONFIG.TIMER_CHANNEL_NAMESPACE, JSON.stringify({ action, data }))
	}, [cast]);

	return { isLoaded: cast != null, sendMessage };
};
