import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { useNavigate } from "react-router";
import { ModeSettings, ParsedRoundSettings } from "../modes/types";
import { MainTimer } from "../components/MainTimer";
import { MainTimerState, useMainTimerState } from "../hooks/useMainTimerState";

import { SoundVolumeState } from "../hooks/useSoundVolumeState";

export const TimerControlPage = ({ modeSettings, roundSettings }: {
	modeSettings: ModeSettings,
	roundSettings: ParsedRoundSettings
}) => {
	const navigate = useNavigate();
	const mainTimerState = useMainTimerState(roundSettings);

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

const TimerActions = (props: MainTimerState) => {
	return (
		<div className="flex gap-2.5">
			<TimerStateActions {...props} />
			<SoundStateActions {...props} />
		</div>
	);
}

const TimerStateActions = ({ isStarted, isRunning, isFinished, pause, resume, reset }: MainTimerState) => {
	if (isFinished) {
		return <Button onClick={() => reset()}>Reiniciar</Button>;
	}

	if (isRunning) {
		return <Button onClick={() => pause()}>Parar</Button>;
	}

	if (isStarted) {
		return <Button onClick={() => resume()}>Continuar</Button>;
	}

	return <Button onClick={() => resume()}>Iniciar</Button>;
}

const SoundStateActions = ({ isMuted, mute, unmute }: SoundVolumeState) => {
	if (isMuted) {
		return <Button onClick={() => unmute()}>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
				<path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
			</svg>
		</Button>;
	}

	return <Button onClick={() => mute()}>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
			<path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
		</svg>
	</Button>;
}
