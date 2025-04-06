import { ButtonHTMLAttributes, PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router";
import { ModeSettings, ParsedRoundSettings } from "../hooks/useModeSettings";
import { MainTimer } from "../components/MainTimer";
import { MainTimerState, useMainTimerState } from "../hooks/useMainTimerState";
import { useSender } from "../hooks/useSender";

export const TimerControlPage = ({ modeSettings, roundSettings }: {
	modeSettings: ModeSettings,
	roundSettings: ParsedRoundSettings
}) => {
	const { sendMessage } = useSender();
	const navigate = useNavigate();
	const mainTimerState = useMainTimerState(roundSettings);

	useEffect(() => {
		sendMessage("setIsRunning", { isRunning: mainTimerState.isRunning });
	}, [mainTimerState.isRunning, sendMessage]);

	return <div className="flex flex-col h-full px-5">
		<div className="flex justify-between gap-5 pt-5">
			<div>
				<Button onClick={() => navigate("/")}>Voltar</Button>
				<h1 className="inline-block ml-5">{modeSettings.description}</h1>
			</div>

			<div className="h-8 cursor-pointer ml-5 mt-2 mr-2">
				{/* @ts-expect-error undefined tag */}
				<google-cast-launcher></google-cast-launcher>
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
