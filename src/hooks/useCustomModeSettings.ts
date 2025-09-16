import { DEFAULT_MODES } from "../modes/default-modes";
import { ModeSettings, ModeType } from "../modes/types";

const PREFIX = "CUSTOM_";
export type CustomRef = `${typeof PREFIX}${number}`;

export const isCustomRef = (ref: CustomRef | string | null): ref is CustomRef => {
	return !!ref && ref.startsWith(PREFIX);
};

export const getCustomModeFromStorage = (ref: CustomRef): ModeSettings | null => {
	const localItem = localStorage.getItem(ref);
	const parsedItem = localItem ? JSON.parse(localItem) : null;

	if (!parsedItem || !parsedItem.type || !parsedItem.params) return null;

	const baseModeSettings: ModeSettings = DEFAULT_MODES[parsedItem.type as ModeType];
	if (!baseModeSettings || baseModeSettings.type === "NOT_FOUND") return null;

	const customParams = { ...(baseModeSettings.customParams || {}) };

	Object.keys(customParams).forEach(key => {
		if (parsedItem.params[key]) {
			customParams[key] = {
				...customParams[key],
				defaultValue: parsedItem.params[key]
			};
		}
	});

	return {
		...baseModeSettings,
		description: parsedItem.params.description || ("Custom " + baseModeSettings.description),
		exercises: (parsedItem.params.exercises as string | undefined) || baseModeSettings.exercises,
		customParams: customParams,
	};
};

export const getAllCustomModesFromStorage = (): Record<CustomRef, ModeSettings> => {
	const customModes: Record<CustomRef, ModeSettings> = {};

	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (!isCustomRef(key)) continue;

		const customMode = getCustomModeFromStorage(key);

		if (customMode) {
			customModes[key] = customMode;
		}
	}

	return customModes;
};

export const saveCustomSettingsToStorage = (
	ref: CustomRef | string,
	type: ModeType,
	params: Record<string, string>
) => {
	if (!ref.startsWith(PREFIX)) {
		const existingCustomSettins = getAllCustomModesFromStorage();
		let refId = Object.keys(existingCustomSettins).length;

		while ((PREFIX + refId) in existingCustomSettins) {
			refId++;
		}

		ref = PREFIX + refId;
	}

	localStorage.setItem(ref, JSON.stringify({ type, params }));
};

export const removeCustomSettingsFromStorage = (ref: CustomRef) => {
	localStorage.removeItem(ref);
};
