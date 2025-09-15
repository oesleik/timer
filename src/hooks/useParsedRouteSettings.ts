import { CustomParamReplacement, ExerciseItem, ModeSettings, ParsedRoundSettings, TimeFormat, ValidColorSchemes, ValidTimerDirections } from "../modes/types";

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

export const useParsedRouteSettings = (mode: ModeSettings, params: FormData): ParsedRoundSettings => {
	Object.keys((mode.customParams || {})).forEach(ref => {
		if (params[ref] == null) {
			const paramConfig = (mode.customParams || {})[ref];
			params[ref] = String(paramConfig.defaultValue);
		}
	});

	return {
		rounds: Number(replaceConfigWithParam(mode.roundSettings.rounds, params, mode.customParams) || 0),
		roundSteps: mode.roundSettings.roundSteps.map((step): ParsedRoundSettings["roundSteps"][0] => {
			const duration = Number(replaceConfigWithParam(step.duration, params, mode.customParams) || 0);

			return {
				duration,
				direction: valueShouldBeOneOf(replaceConfigWithParam(step.direction, params, mode.customParams), ValidTimerDirections) || "DESC",
				description: replaceStringWithParam(step.description, params) || "",
				colorScheme: valueShouldBeOneOf(replaceConfigWithParam(step.colorScheme, params, mode.customParams), ValidColorSchemes) || "NORMAL",
				onlyFirstRound: step.onlyFirstRound === true,
				hideLastRound: step.hideLastRound === true,
				timeFormat: step.timeFormat || guessTimeFormat(duration),
			};
		}).filter(step => step.duration > 0),
		exercises: parseExercisesParam(params.exercises || ""),
	};
};

function parseExercisesParam(param: string): ExerciseItem[] {
	if (param === "") return [];

	return param.split("\n").map((line, idx): ExerciseItem => {
		return {
			type: idx === 0 ? "title" : (idx !== 1 || line === "" || /^\d/.test(line) ? "exercise" : "subtitle"),
			description: line,
		};
	});
}

const guessTimeFormat = (duration: ParsedRoundSettings["roundSteps"][0]["duration"]): TimeFormat => {
	if (typeof duration !== "number") {
		return "MM:SS";
	}

	if (duration >= 60 * 60) {
		return "H:MM:SS";
	}

	if (duration > 60) {
		return "MM:SS";
	}

	return "S";
}
