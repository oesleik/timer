import { ModeSettings, ModeType } from "../modes/types";

const PREFIX = "CUSTOM_";
type CustomRef = `${typeof PREFIX}${number}`

export const getCustomModeFromStorage = (ref: CustomRef | string): ModeSettings | null => {
	if (!ref.startsWith(PREFIX)) return null;

	const localItem = localStorage.getItem(ref);
	const parsedItem = localItem ? JSON.parse(localItem) : null;

	if (!parsedItem) return null;
	return parsedItem as ModeSettings;
};

export const getCustomModesFromStorage = (): Record<CustomRef, ModeSettings> => {
	const customModes: Record<CustomRef, ModeSettings> = {};

	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		const customMode = getCustomModeFromStorage(key || "");

		if (customMode) {
			customModes[key as CustomRef] = customMode;
		}
	}

	return customModes;
};

export const saveCustomModeToStorage = (ref: CustomRef | string, customMode: ModeSettings) => {
	if (!ref.startsWith(PREFIX)) {
		const existingModes = getCustomModesFromStorage();
		let refId = Object.keys(existingModes).length;

		while (!((PREFIX + refId) in existingModes)) {
			refId++;
		}

		ref = PREFIX + refId;
	}

	localStorage.setItem(ref, JSON.stringify(customMode));
};
