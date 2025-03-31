import { useEffect, useState } from "react";
import { CustomParamReplacement, CustomParamSettings, ModeSettings, NO_LIMIT, ParsedRoundSettings, TimeFormat, ValidColorSchemes, ValidTimerDirections } from "../hooks/useModeSettings";

type FormData = Record<string, string>;

const isCustomParamReplacement = (value: unknown): value is CustomParamReplacement => {
	return typeof value === "string" && value.startsWith("__") && value.endsWith("__");
};

function replaceConfigWithParam<T>(config: T | CustomParamReplacement, params: FormData, paramsConfig: ModeSettings["customParams"]): T | string | number | null {
	if (isCustomParamReplacement(config)) {
		return getParamValueForConfigByRef(config, params, paramsConfig);
	}

	return config;
};

function replaceStringWithParam(config: string | null | undefined, params: FormData): string | null | undefined {
	if (!config) {
		return config;
	}

	for (const ref in params) {
		const fullRef = "__" + ref + "__";
		config = config.replace(fullRef, params[ref]);
	}

	return config;
};

const getParamValueForConfigByRef = (config: CustomParamReplacement, params: FormData, paramsConfig: ModeSettings["customParams"]): string | number | null => {
	for (const ref in params) {
		const fullRef = "__" + ref + "__";

		if (fullRef === config) {
			const paramConfig = (paramsConfig || {})[ref] || {};
			let value: string | number = params[ref];

			if (paramConfig.inputType === "number") {
				value = Number(value);

				if (paramConfig.parseValue) {
					value = paramConfig.parseValue(value);
				}
			}

			return value;
		}
	}

	return null;
};

function valueShouldBeOneOf<T>(config: T | unknown, validValues: readonly T[]): T | null {
	if (!validValues.includes(config as T)) {
		return null;
	}

	return config as T;
};

const parseRouteSettings = (mode: ModeSettings, params: FormData): ParsedRoundSettings => {
	return {
		rounds: Number(replaceConfigWithParam(mode.roundSettings.rounds, params, mode.customParams) || 0),
		roundSteps: mode.roundSettings.roundSteps.map((step): ParsedRoundSettings["roundSteps"][0] => {
			const duration = step.duration == NO_LIMIT ? NO_LIMIT : Number(replaceConfigWithParam(step.duration, params, mode.customParams) || 0);

			return {
				duration,
				direction: valueShouldBeOneOf(replaceConfigWithParam(step.direction, params, mode.customParams), ValidTimerDirections) || "DESC",
				description: replaceStringWithParam(step.description, params) || "",
				colorScheme: valueShouldBeOneOf(replaceConfigWithParam(step.direction, params, mode.customParams), ValidColorSchemes) || "NORMAL",
				onlyFirstRound: step.onlyFirstRound === true,
				hideLastRound: step.hideLastRound === true,
				timeFormat: step.timeFormat || guessTimeFormat(duration),
			};
		}),
	};
};

const guessTimeFormat = (duration: ParsedRoundSettings["roundSteps"][0]["duration"]): TimeFormat => {
	if (typeof duration !== "number") {
		return "H:MM:SS";
	}

	if (duration >= 60 * 60) {
		return "H:MM:SS";
	}

	if (duration >= 30) {
		return "MM:SS"
	}

	if (duration >= 10) {
		return "SS"
	}

	return "S";
}

export const ModeParamsForm = ({
	modeSettings,
	setParsedSettings,
}: {
	modeSettings: ModeSettings,
	setParsedSettings: (v: ParsedRoundSettings) => void,
}) => {
	const customParams = modeSettings.customParams || {};

	const [formData, setFormData] = useState<FormData>(() => {
		const formData: FormData = {};
		Object.entries(customParams).forEach(([ref, param]) => {
			formData[ref] = String(param.defaultValue);
		});
		return formData;
	});

	const setParamValue = (ref: string, value: string) => setFormData(formData => ({
		...formData,
		[ref]: value,
	}));

	useEffect(() => {
		if (!Object.keys(modeSettings.customParams || {}).length) {
			const parsedSettings = parseRouteSettings(modeSettings, {});
			setParsedSettings(parsedSettings);
		}
	}, [modeSettings, setParsedSettings]);

	const submitParams = () => {
		const parsedSettings = parseRouteSettings(modeSettings, formData);
		setParsedSettings(parsedSettings);
	};

	if (!Object.keys(customParams).length) {
		return null;
	}

	return <>
		<form onSubmit={() => { }} className="text-2xl">
			{Object.entries(customParams).map(([ref, param]) => (
				<CustomParamInput
					key={ref}
					param={param}
					value={formData[ref]}
					setValue={(value: string) => setParamValue(ref, value)}
				/>
			))}
			<button
				type="button"
				onClick={() => submitParams()}
				className="text-center w-full px-6 py-2 bg-echo-yellow-500 text-echo-black-500 font-medium rounded-lg mr-4 border-2 focus:border-echo-white-500 hover:border-echo-white-500 cursor-pointer"
			>
				Continuar
			</button>
		</form>
	</>;
};

const CustomParamInput = ({ param, value, setValue }: {
	param: CustomParamSettings,
	value: string | undefined,
	setValue: (value: string) => void
}) => {
	if (param.inputType === "number") {
		return <>
			<label className="block text-echo-white-500 text-sm font-bold mb-2">
				{param.description}
			</label>
			<input
				type="number"
				defaultValue={param.defaultValue}
				value={value}
				onChange={event => setValue(event.target.value)}
				className="shadow appearance-none border rounded w-full py-2 px-3 mb-6 text-echo-white-500 leading-tight focus:outline-none focus:shadow-outline"
			/>
		</>;
	}

	if (param.inputType === "options") {
		return <>
			<label className="block text-echo-white-500 text-sm font-bold mb-2">
				{param.description}
			</label>
			{param.options.map((option, idx) => (
				<label key={idx} className="flex items-center">
					<input
						type="radio"
						value={option.value}
						checked={value === option.value}
						onChange={event => setValue(event.target.value)}
						className="mr-2"
					/>
					{option.label}
				</label>
			))}
		</>;
	}

	return <></>;
};
