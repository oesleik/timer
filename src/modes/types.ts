import { ValuesOfArray } from "../utils/TypeUtils";

export const ValidColorSchemes = ["NORMAL", "PREPARATION", "REST", "FINISHED"] as const;
export const ValidTimerDirections = ["ASC", "DESC"] as const;

export const COLOR_SCHEME_MAP: Record<ColorScheme, string> = {
	PREPARATION: "#FFD130",
	NORMAL: "#D32F2F",
	REST: "#00BCD4",
	FINISHED: "#D32F2F",
} as const;

export type ColorScheme = ValuesOfArray<typeof ValidColorSchemes>;
export type TimerDirection = ValuesOfArray<typeof ValidTimerDirections>;
export type TimeFormat = "H:MM:SS" | "MM:SS" | "SS" | "S";

export type ModeType = "NOT_FOUND" | "AMRAP" | "TABATA" | "EMOM" | "FOR_TIME";

export type ExerciseItem = {
	type: "title" | "subtitle" | "exercise",
	description: string,
};

export type ModeSettings = {
	type: ModeType,
	description: string,
	roundSettings: RoundSettings,
	customParams?: Record<string, CustomParamSettings>,
	exercises?: string,
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
	exercises: ExerciseItem[],
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
type CustomTypeParam = CustomNumberParam | CustomOptionsParam | CustomTextParam | CustomTextareaParam;

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

type CustomTextParam = {
	inputType: "text",
	defaultValue: string,
};

type CustomTextareaParam = {
	inputType: "textarea",
	defaultValue: string,
};

export type CustomParamReplacement = `__${string}__`;
