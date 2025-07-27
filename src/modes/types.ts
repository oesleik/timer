import { KeysOfObject, ValuesOfArray } from "../utils/TypeUtils";
import { DEFAULT_MODES } from "./default-modes";

export const ValidColorSchemes = ["NORMAL", "PREPARATION", "REST", "FINISHED"] as const;
export const ValidTimerDirections = ["ASC", "DESC"] as const;

export const COLOR_SCHEME_MAP: Record<ColorScheme, string> = {
	PREPARATION: "#FFFFFF",
	NORMAL: "#FFFFFF",
	REST: "#FFFFFF",
	FINISHED: "#FFFFFF",
} as const;

type ColorScheme = ValuesOfArray<typeof ValidColorSchemes>;
export type TimerDirection = ValuesOfArray<typeof ValidTimerDirections>;
export type TimeFormat = "H:MM:SS" | "MM:SS" | "SS" | "S";

export type ModeSettings = {
	ref: KeysOfObject<typeof DEFAULT_MODES> | `CUSTOM_${string}`,
	description: string,
	roundSettings: RoundSettings,
	customParams?: Record<string, CustomParamSettings>,
};

type RoundSettings = {
	rounds: number | CustomParamReplacement, // set to 0 to not show rounds
	roundSteps: RoundStepSettings[],
};

export type RoundStepSettings = {
	duration: number | CustomParamReplacement,
	direction?: TimerDirection | CustomParamReplacement,
	description?: string,
	colorScheme?: ColorScheme,
	onlyFirstRound?: boolean,
	hideLastRound?: boolean,
	timeFormat?: TimeFormat,
};

export type ParsedRoundSettings = {
	rounds: number,
	roundSteps: ParsedRoundStepSettings[],
};

type ParsedRoundStepSettings = {
	duration: number,
	direction: TimerDirection,
	description: string,
	colorScheme: ColorScheme,
	onlyFirstRound: boolean,
	hideLastRound: boolean,
	timeFormat: TimeFormat,
};

export type CustomParamSettings = { description: string } & CustomTypeParam;
type CustomTypeParam = CustomNumberParam | CustomOptionsParam;

type CustomNumberParam = {
	inputType: "number",
	defaultValue: number,
	parseValue?: (value: number) => number,
};

export type CustomOptionsParam<T extends string = string> = {
	inputType: "options",
	options: { value: T, label: string }[],
	defaultValue: T,
};

export type CustomParamReplacement = `__${string}__`;
