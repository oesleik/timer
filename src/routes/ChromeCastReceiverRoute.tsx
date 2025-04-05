import { useEffect } from "react";
import { ChromeCastReceiverPage } from "../pages/ChromeCastReceiverPage";

export const ChromeCastReceiverRoute = () => {
	useEffect(() => {
		const script = document.createElement("script");
		script.src = "https://www.gstatic.com/cast/sdk/libs/cast_receiver.js";
		script.async = true;

		script.onload = () => {
			// @ts-expect-error undefined cast
			const context = cast.framework.CastReceiverContext.getInstance();
			context.start();
		};

		document.body.appendChild(script);
	}, []);

	return <ChromeCastReceiverPage />
}
