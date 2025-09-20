import { ButtonHTMLAttributes, forwardRef, PropsWithChildren, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { ModeSettings, ParsedRoundSettings } from "../modes/types";
import { MainTimer } from "../components/MainTimer";
import { MainTimerState, useMainTimerState } from "../hooks/useMainTimerState";

import { SoundVolumeState } from "../hooks/useSoundVolumeState";
import { Slider } from "../components/Slider";
import { useClickOutside } from "../hooks/useClickOutside";
import { TIMER_VIEW_MODE } from "../hooks/useTimerViewModeState";
import { SettingsIcon, Volume2, VolumeOff } from "lucide-react";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../components/DropdownMenu";

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

const Button = forwardRef<HTMLButtonElement, PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }>>(({ className, children, active, ...props }, ref) => {
	const activeClassName = active ? "border-echo-white-500" : "";

	return <>
		<button
			ref={ref}
			type="button"
			className={["bg-echo-gray-500 px-6 py-2 cursor-pointer rounded-lg text-echo-white-500 border-echo-gray-500 border-2 focus:border-echo-white-500 hover:border-echo-white-500 h-11", activeClassName, className].join(" ")}
			{...props}
		>
			{children}
		</button>
	</>;
});

const TimerActions = (props: MainTimerState) => {
	return (
		<div className="flex gap-2.5">
			<TimerStateActions {...props} />
			<SoundStateActions {...props} />
			<TimerViewActions {...props} />
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

const SoundStateActions = ({ volume, setVolume, persistCurrentVolume }: SoundVolumeState) => {
	const [isVisible, setIsVisible] = useState(false);
	const toggle = () => setIsVisible(!isVisible);
	const btnRef = useRef<HTMLButtonElement>(null);
	const sliderRef = useRef<HTMLDivElement>(null);

	useClickOutside([btnRef, sliderRef], () => setIsVisible(false));
	useEffect(() => btnRef.current?.blur(), [isVisible]);

	return <div className="relative">
		<SoundToggleButton ref={btnRef} isMuted={volume === 0} active={isVisible} onClick={toggle} />
		{isVisible && (
			<div className="absolute bottom-14 left-2/9 w-10 p-4 bg-echo-gray-500 rounded-lg" ref={sliderRef}>
				<Slider orientation="vertical" value={[volume]} onValueChange={([value]) => setVolume(value)} onValueCommit={() => persistCurrentVolume()} step={10} />
			</div>
		)}
	</div>;
}

const TimerViewActions = ({ viewMode, setViewMode, viewOptions, setViewOptions, hasExercises }: MainTimerState) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button><SettingsIcon /></Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuRadioGroup value={viewMode} onValueChange={v => setViewMode(v as typeof viewMode)}>
					{Object.entries(TIMER_VIEW_MODE).map(([value, desc]) => (
						<DropdownMenuRadioItem key={value} value={value} disabled={!hasExercises && value != "ONLY_TIMER"}>{desc}</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>

				<DropdownMenuSeparator />

				<DropdownMenuCheckboxItem checked={viewOptions.showTitle} onCheckedChange={ckd => setViewOptions({ showTitle: ckd })}>
					Show title
				</DropdownMenuCheckboxItem>

				<DropdownMenuCheckboxItem checked={viewOptions.showWeights} onCheckedChange={ckd => setViewOptions({ showWeights: ckd })}>
					Show weights
				</DropdownMenuCheckboxItem>
			</DropdownMenuContent >
		</DropdownMenu >
	);
}

const SoundToggleButton = forwardRef<HTMLButtonElement, { isMuted: boolean, active: boolean, onClick: () => void }>(({ isMuted, active, onClick }, ref) => {
	if (isMuted) {
		return <Button ref={ref} active={active} onClick={onClick}>
			<VolumeOff />
		</Button>;
	}

	return <Button ref={ref} active={active} onClick={onClick}>
		<Volume2 />
	</Button>;
});
