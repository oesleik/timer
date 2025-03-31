import { KeysOfObject, ValuesOfArray } from "../utils/TypeUtils";

export const ValidColorSchemes = ["NORMAL", "PREPARATION", "REST", "FINISHED"] as const;
export const ValidTimerDirections = ["ASC", "DESC"] as const;

type ColorScheme = ValuesOfArray<typeof ValidColorSchemes>;
type TimerDirection = ValuesOfArray<typeof ValidTimerDirections>;
export type TimeFormat = "H:MM:SS" | "MM:SS" | "SS" | "S";

export type ModeSettings = {
	ref: KeysOfObject<typeof DEFAULT_SETTINGS> | `CUSTOM_${string}`,
	description: string,
	roundSettings: RoundSettings,
	customParams?: Record<string, CustomParamSettings>,
};

type RoundSettings = {
	rounds: number | CustomParamReplacement, // set to 0 to not show rounds
	roundSteps: RoundStepSettings[],
};

type RoundStepSettings = {
	duration: number | typeof NO_LIMIT | CustomParamReplacement,
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
	duration: number | typeof NO_LIMIT,
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

type CustomOptionsParam = {
	inputType: "options",
	options: string[],
	defaultValue: string,
};

export type CustomParamReplacement = `__${string}__`;

export const NO_LIMIT = "NO_LIMIT";

export const COLOR_SCHEME_MAP: Record<ColorScheme, string> = {
	PREPARATION: "#FFFFFF",
	NORMAL: "#FFFFFF",
	REST: "#FFFFFF",
	FINISHED: "#FFFFFF",
} as const;

const PREPARATION_STEP: RoundStepSettings = {
	duration: 5,
	direction: "DESC",
	description: "Preparation",
	colorScheme: "PREPARATION",
	onlyFirstRound: true,
	timeFormat: "S"
} as const;

const REST_STEP: Partial<RoundStepSettings> = {
	description: "Rest",
	colorScheme: "REST",
	hideLastRound: true,
} as const;

const DEFAULT_SETTINGS: Record<string, ModeSettings> = {
	NOT_FOUND: {
		ref: "NOT_FOUND",
		description: "Não encontrado",
		roundSettings: {
			rounds: 0,
			roundSteps: []
		}
	},
	AMRAP: {
		ref: "AMRAP",
		description: "AMRAP",
		roundSettings: {
			rounds: 0,
			roundSteps: [
				PREPARATION_STEP,
				{ duration: "__duration__", description: "AMRAP __duration__'" }
			]
		},
		customParams: {
			"duration": {
				description: "Duration (minutes)",
				inputType: "number",
				defaultValue: 15,
				parseValue: value => value * 60,
			},
		}
	},
	TABATA: {
		ref: "TABATA",
		description: "TABATA",
		roundSettings: {
			rounds: "__rounds__",
			roundSteps: [
				PREPARATION_STEP,
				{ duration: "__duration__" },
				{ ...REST_STEP, duration: "__rest_duration__" }
			]
		},
		customParams: {
			"rounds": {
				description: "Rounds",
				inputType: "number",
				defaultValue: 8,
			},
			"duration": {
				description: "Duration (seconds)",
				inputType: "number",
				defaultValue: 20,
			},
			"rest_duration": {
				description: "Rest (seconds)",
				inputType: "number",
				defaultValue: 10,
			},
		}
	},
	EMOM: {
		ref: "EMOM",
		description: "EMOM",
		roundSettings: {
			rounds: "__rounds__",
			roundSteps: [
				PREPARATION_STEP,
				{ duration: 60, timeFormat: "SS" }
			]
		},
		customParams: {
			"rounds": {
				description: "Rounds",
				inputType: "number",
				defaultValue: 8,
			},
		}
	},
	FOR_TIME: {
		ref: "FOR_TIME",
		description: "FOR TIME",
		roundSettings: {
			rounds: 0,
			roundSteps: [
				PREPARATION_STEP,
				{ duration: "__duration__", direction: "ASC" }
			]
		},
		customParams: {
			"duration": {
				description: "Duration (minutes)",
				inputType: "number",
				defaultValue: 120,
				parseValue: value => value * 60,
			},
		}
	}
} as const;

export const getAvailableModes = () => {
	return Object.keys(DEFAULT_SETTINGS).filter(key => key != "NOT_FOUND").map(key => {
		const mode = DEFAULT_SETTINGS[key];

		return {
			ref: mode.ref,
			description: mode.description,
		};
	});
};

export const useModeSettings = (ref: string): ModeSettings => {
	if (DEFAULT_SETTINGS[ref]) {
		return DEFAULT_SETTINGS[ref];
	}

	if (ref.startsWith("CUSTOM_")) {
		const customModeSettings = getLocalSavedSettings(ref);
		if (customModeSettings != null) return customModeSettings;
	}

	return DEFAULT_SETTINGS.NOT_FOUND;
};

const getLocalSavedSettings = (ref: string) => {
	const localItem = localStorage.getItem(ref);
	const parsedItem = localItem ? JSON.parse(localItem) : null;

	if (parsedItem != null) {
		// todo
		// return parsedItem as ModeSettings;
	}

	return null;
};
