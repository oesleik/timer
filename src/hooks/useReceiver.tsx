import { useChromecastReceiver } from "use-chromecast-caf-receiver";
import type * as castNs from "chromecast-caf-receiver/index.d.ts";
import { useCustomEventBus } from "./useEventBus";
import { useEffect } from "react";
import { APP_CONFIG } from "../app_config";

export type Receiver = ReturnType<typeof useReceiver>;

export const useReceiver = () => {
	const { on, trigger } = useCustomEventBus("cast_receiver");
	const { cast: _cast } = useChromecastReceiver();

	// O ts acha que o cast é do tipo sender, não receiver
	const cast = _cast as unknown as typeof castNs | null;

	useEffect(() => {
		if (!cast) return;

		const context = cast.framework.CastReceiverContext.getInstance();
		context.start();

		context.addCustomMessageListener(APP_CONFIG.TIMER_CHANNEL_NAMESPACE, (event) => {
			trigger(event.type, event.data);
		});
	}, [cast]);

	return { isLoaded: cast != null, onMessage: on };
};
