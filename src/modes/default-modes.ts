import { CustomOptionsParam, CustomParamSettings, ModeType, ModeSettings, RoundStepSettings, TimerDirection } from "./types";

const PREPARATION_STEP: RoundStepSettings = {
	duration: 10,
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
	timeFormat: "S"
} as const;

export const DEFAULT_MODES: Record<ModeType, ModeSettings> = {
	NOT_FOUND: {
		type: "NOT_FOUND",
		description: "Não encontrado",
		roundSettings: {
			rounds: 0,
			roundSteps: []
		}
	},
	AMRAP: {
		type: "AMRAP",
		description: "AMRAP",
		roundSettings: {
			rounds: 0,
			roundSteps: [
				PREPARATION_STEP,
				{ duration: "__duration__", description: "AMRAP __duration__'", direction: "__direction__", timeFormat: "MM:SS" }
			]
		},
		customParams: {
			"duration": {
				description: "Duration (minutes)",
				inputType: "number",
				defaultValue: 15,
				parseValue: value => value * 60,
			},
			"direction": {
				description: "Timer direction",
				inputType: "options",
				options: [
					{ value: "DESC", label: "Descending" },
					{ value: "ASC", label: "Ascending" },
				],
				defaultValue: "ASC",
			} satisfies CustomParamSettings & CustomOptionsParam<TimerDirection>,
		}
	},
	TABATA: {
		type: "TABATA",
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
		type: "EMOM",
		description: "EMOM",
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
				defaultValue: 60,
			},
			"rest_duration": {
				description: "Rest (seconds)",
				inputType: "number",
				defaultValue: 0,
			},
		}
	},
	FOR_TIME: {
		type: "FOR_TIME",
		description: "FOR TIME",
		roundSettings: {
			rounds: 0,
			roundSteps: [
				PREPARATION_STEP,
				{ duration: "__duration__", direction: "__direction__", timeFormat: "MM:SS" }
			]
		},
		customParams: {
			"duration": {
				description: "Duration (minutes)",
				inputType: "number",
				defaultValue: 120,
				parseValue: value => value * 60,
			},
			"direction": {
				description: "Timer direction",
				inputType: "options",
				options: [
					{ value: "DESC", label: "Descending" },
					{ value: "ASC", label: "Ascending" },
				],
				defaultValue: "ASC",
			} satisfies CustomParamSettings & CustomOptionsParam<TimerDirection>,
		}
	}
} as const;
