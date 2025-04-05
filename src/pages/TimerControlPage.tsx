import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { useNavigate } from "react-router";
import { ModeSettings, ParsedRoundSettings } from "../hooks/useModeSettings";
// import { useChromecastSender } from "use-chromecast-caf-sender";
// import { APP_CONFIG } from "../app_config";
import { MainTimer } from "../components/MainTimer";
import { MainTimerState, useMainTimerState } from "../hooks/useMainTimerState";

// const useSetChromeCastConfig = () => {
// 	const { cast } = useChromecastSender();

// 	useEffect(() => {
// 		if (!cast) return;
// 		cast.framework.CastContext.getInstance().setOptions({
// 			receiverApplicationId: APP_CONFIG.CHROMECAST_APP_ID,
// 			autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
// 		});
// 	}, [cast]);
// };

// const useSendMessage = () => {
// 	const { cast } = useChromecastSender();

// 	return (action: string, data: unknown) => {
// 		if (!cast) return;
// 		cast.framework.CastContext.getInstance().setOptions({
// 			receiverApplicationId: APP_CONFIG.CHROMECAST_APP_ID,
// 			autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
// 		});
// 		const session = cast.framework.CastContext.getInstance().getCurrentSession();
// 		if (!session) return;
// 		session.sendMessage("urn:x-cast:timer-app.timer", JSON.stringify({ action, data }));
// 	};
// };

export const TimerControlPage = ({ modeSettings, roundSettings }: {
	modeSettings: ModeSettings,
	roundSettings: ParsedRoundSettings
}) => {
	// useSetChromeCastConfig();
	const navigate = useNavigate();
	const mainTimerState = useMainTimerState(roundSettings);
	// const castSession = useRef(null);

	// useEffect(() => {
	// 	const session = cast.framework.CastContext.getInstance().getCurrentSession();
	// 	castSession.current = session;
	// }, []);

	// const castMessage = (action: string, data: unknown) => {
	// 	if (castSession) {
	// 		castSession.castMessage("urn:x-cast:com.example.custom", message);
	// 	}
	// };

	// {/* @ts-expect-error undefined tag */}
	// <google-cast-launcher></google-cast-launcher>

	return <div className="flex flex-col h-full px-5">
		<div className="flex justify-between gap-5 pt-5">
			<div>
				<Button onClick={() => navigate("/")}>Voltar</Button>
				<h1 className="inline-block ml-5">{modeSettings.description}</h1>
			</div>
		</div>

		<div className="flex flex-col h-full justify-center">
			<MainTimer key={mainTimerState.executionUid} roundSettings={roundSettings} mainTimerState={mainTimerState} />
		</div>

		<div className="max-w-xl mx-auto pb-5 pt-2">
			<TimerActions {...mainTimerState} />
		</div>
	</div>;
};

const Button = ({ className, children, ...props }: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) => {
	return <>
		<button
			type="button"
			className={["bg-echo-gray-500 px-6 py-2 cursor-pointer rounded-lg text-echo-white-500 border-echo-gray-500 border-2 focus:border-echo-white-500 hover:border-echo-white-500", className].join(" ")}
			{...props}
		>
			{children}
		</button>
	</>;
};

const TimerActions = ({ isStarted, isRunning, isFinished, pause, resume, reset }: MainTimerState) => {
	if (isFinished) {
		return <Button onClick={() => reset()}>Reiniciar</Button>;
	}

	if (isRunning) {
		return isRunning ? <Button onClick={() => pause()}>Parar</Button> : null;
	}

	if (isStarted) {
		return <Button onClick={() => resume()}>Continuar</Button>;
	}

	return <Button onClick={() => resume()}>Iniciar</Button>;
}
