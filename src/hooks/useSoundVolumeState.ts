import { useState } from "react";

export type SoundVolumeState = {
	isMuted: boolean,
	mute: () => void,
	unmute: () => void,
}

export const useSoundVolumeState = (): SoundVolumeState => {
	const [isMuted, setIsMuted] = useState(false);

	return {
		isMuted,
		mute: () => setIsMuted(true),
		unmute: () => setIsMuted(false),
	};
};
