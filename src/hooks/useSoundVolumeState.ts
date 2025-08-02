import { useState } from "react";

export type SoundVolumeState = {
	volume: number,
	sfxVolume: number,
	setVolume: (volume: number) => void,
	persistCurrentVolume: () => void,
}

export const useSoundVolumeState = (): SoundVolumeState => {
	const [volume, setVolume] = useState(() => {
		const volume = localStorage.getItem("volume");
		return volume === null ? 100 : constraintVolume(parseFloat(volume));
	});

	return {
		volume,
		sfxVolume: volume > 0 ? volume / 100 : 0,
		setVolume: (volume) => setVolume(constraintVolume(volume)),
		persistCurrentVolume: () => localStorage.setItem("volume", volume.toString()),
	};
};

function constraintVolume(volume: number): number {
	return Math.max(0, Math.min(100, volume));
}
