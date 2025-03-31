import { ButtonHTMLAttributes, PropsWithChildren, useEffect, useState } from "react";
import { TimerState, useSecondsTimer } from "../hooks/useSecondsTimer";
import { useNavigate } from "react-router";
import { ModeSettings, ParsedRoundSettings, TimeFormat } from "../hooks/useModeSettings";
import { ModeParamsForm } from "../components/ModeParamsForm";

type RoundsState = {
	currentRound: number,
	currentStep: number,
	isFinished: boolean,
	showRounds: boolean,
	maxRounds: number,
};

export const TimerPage = ({ modeSettings }: { modeSettings: ModeSettings }) => {
	const [parsedRoundSettings, setParsedRoundSettings] = useState<ParsedRoundSettings | null>(null);
	const navigate = useNavigate();

	return <div className="flex flex-col h-screen">
		<div>
			<Button
				className={"ml-10 mt-5 mr-5"}
				onClick={() => navigate(-1)}
			>
				Voltar
			</Button>

			<h1 className="inline-block">{modeSettings.description}</h1>
		</div>

		{!parsedRoundSettings && (
			<div className="flex flex-col items-center justify-center h-full">
				<ModeParamsForm modeSettings={modeSettings} setParsedSettings={setParsedRoundSettings} />
			</div>
		)}

		{!!parsedRoundSettings && (
			<div className="flex flex-col items-center h-full">
				<RoundsTimer roundSettings={parsedRoundSettings} />
			</div>
		)}
	</div>;
};

const RoundsTimer = ({ roundSettings }: { roundSettings: ParsedRoundSettings }) => {
	const [roundsState, setRoundsState] = useState<RoundsState>({
		currentRound: 1,
		currentStep: 1,
		isFinished: false,
		showRounds: roundSettings.rounds > 0,
		maxRounds: roundSettings.rounds,
	});

	const nextStep = () => {
		setRoundsState(state => {
			const isLastRound = state.currentRound >= roundSettings.rounds;

			const nextStepIdx = roundSettings.roundSteps.findIndex((step, idx) => {
				return idx >= state.currentStep && (!isLastRound || !step.hideLastRound);
			});

			if (nextStepIdx > 0) {
				return { ...state, currentStep: nextStepIdx + 1 };
			}

			if (state.currentRound < roundSettings.rounds) {
				const firstStepIdx = roundSettings.roundSteps.findIndex(step => !step.onlyFirstRound);
				return { ...state, currentRound: state.currentRound + 1, currentStep: firstStepIdx + 1 };
			}

			return { ...state, isFinished: true };
		});
	};

	return <>
		{roundSettings.roundSteps.map((step, stepIdx) => {
			const currentStep = stepIdx + 1;

			if (currentStep !== roundsState.currentStep) {
				return null;
			}

			const stepId = roundsState.currentRound + "_" + currentStep;
			return <StepTimer key={stepId} step={step} onFinished={nextStep} roundsState={roundsState} />;
		})}
	</>;
};

const StepTimer = ({ step, onFinished, roundsState }: {
	step: ParsedRoundSettings["roundSteps"][0],
	onFinished: () => void,
	roundsState: RoundsState,
}) => {
	const autoStart = roundsState.currentRound > 1 || roundsState.currentStep > 1;
	let maxDuration = step.duration === "NO_LIMIT" ? null : step.duration;

	if (step.direction === "DESC" && maxDuration === null) {
		// Se direction DESC e limite não setado, usamos 1h como fallback
		maxDuration = 60 * 60;
	}

	const timer = useSecondsTimer({ maxDuration, autoStart });
	const parsedTime = step.direction === "DESC" ? Math.max(0, Number(maxDuration) - timer.time) : timer.time;

	useEffect(() => {
		if (timer.isFinished) {
			onFinished();
		}
	}, [timer.isFinished, onFinished]);

	const formatedTime = formatTime(parsedTime, step.timeFormat);
	const timerFontSizeClass = formatedTime.length > 5 ? "text-15xl" : "text-18xl";
	const timerColorScheme = "timer-color-scheme-" + (roundsState.isFinished ? "finished" : step.colorScheme.toLowerCase());

	return <>
		<div className={`${timerColorScheme} border-6 rounded-full timer-circle flex flex-col items-center justify-center h-full`}>
			{!step.description && roundsState.showRounds ? (
				<div className="timer-step-rounds">
					<div className="text-7xl text-center font-light">
						{roundsState.currentRound}/{roundsState.maxRounds}
					</div>
					<div className="text-2xl text-center uppercase tracking-widest font-semibold">
						Rounds
					</div>
				</div>
			) : (
				<div className="text-8xl text-center mb-2 timer-step-description">
					{step.description}
				</div>
			)}
			<strong className={`${timerFontSizeClass} font-normal mb-18 timer-step-time`}>
				{formatedTime}
			</strong>
			<div>
				<TimerActions timer={timer} />
			</div>
		</div>
	</>;
};

const Button = ({ className, children, ...props }: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) => {
	return <>
		<button
			type="button"
			className={["bg-echo-gray-500 px-6 py-2 cursor-pointer rounded-lg text-echo-white-500", className].join(" ")}
			{...props}
		>
			{children}
		</button>
	</>;
};

const TimerActions = ({ timer }: { timer: TimerState }) => {
	if (timer.isFinished) {
		return <>
			{/* <Button
				onClick={() => {
					timer.reset();
					timer.resume();
				}}
			>
				Reiniciar
			</Button> */}
		</>;
	}

	if (timer.isRunning) {
		return <>
			{timer.isRunning && (
				<Button
					onClick={() => timer.pause()}
				>
					Parar
				</Button>
			)}
		</>;
	}

	if (!timer.time) {
		return <>
			<Button
				onClick={() => timer.resume()}
			>
				Iniciar
			</Button>
		</>;
	}

	return <>
		<Button
			onClick={() => timer.resume()}
		>
			Continuar
		</Button>
	</>;
}

const formatTime = (time: number, timeFormat: TimeFormat): string => {
	const parts = [];
	const hours = Math.floor(time / 60 / 60);
	const minutes = Math.floor(time / 60);
	const seconds = Math.floor(time % 60);

	if (timeFormat.includes("H") || time >= 60 * 60) {
		parts.push(("0" + String(hours)).substr(-1));
	}

	if (timeFormat.includes("MM") || time > 60) {
		parts.push(("00" + String(minutes)).substr(-2));
	}

	if (timeFormat == "SS" && time == 60) {
		return "60";
	} else if (timeFormat.includes("SS") || time >= 10) {
		parts.push(("00" + String(seconds)).substr(-2));
	} else {
		parts.push(("0" + String(seconds)).substr(-1));
	}

	return parts.join(":");
}
