import { DEFAULT_MODES } from "../modes/default-modes";
import { ModeSettings } from "../modes/types";

export const getAvailableModes = () => {
	return Object.keys(DEFAULT_MODES).filter(key => key != "NOT_FOUND").map(key => {
		const mode = DEFAULT_MODES[key];

		return {
			ref: mode.ref,
			description: mode.description,
		};
	});
};

export const useModeSettings = (ref: string): ModeSettings => {
	if (DEFAULT_MODES[ref]) {
		return DEFAULT_MODES[ref];
	}

	if (ref.startsWith("CUSTOM_")) {
		const customModeSettings = getLocalSavedSettings(ref);
		if (customModeSettings != null) return customModeSettings;
	}

	return DEFAULT_MODES.NOT_FOUND;
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
