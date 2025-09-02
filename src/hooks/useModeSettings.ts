import { DEFAULT_MODES } from "../modes/default-modes";
import { ModeSettings, ModeType } from "../modes/types";
import { getCustomModeFromStorage, getCustomModesFromStorage } from "./useCustomModeSettings";

export const getAvailableModes = () => {
	return Object.entries({
		...DEFAULT_MODES,
		...getCustomModesFromStorage(),
	}).filter(([key]) => key != "NOT_FOUND").map(([key, mode]) => ({
		ref: key,
		description: mode.description,
	}));
};

export const useModeSettings = (ref: ModeType | string): ModeSettings => {
	if (ref in DEFAULT_MODES) {
		return DEFAULT_MODES[ref as ModeType];
	}

	const customModeSettings = getCustomModeFromStorage(ref);
	if (customModeSettings != null) return customModeSettings;

	return DEFAULT_MODES.NOT_FOUND;
};
