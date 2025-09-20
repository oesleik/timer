import { Link } from "react-router";
import { getAvailableModes } from "../hooks/useModeSettings";
import { CustomRef, isCustomRef, removeCustomSettingsFromStorage } from "../hooks/useCustomModeSettings";
import { useState } from "react";

export const ModeSelectionPage = () => {
	const [_, forceUpdate] = useState(0);

	return <>
		<div className="text-2xl grid place-items-center h-screen py-5 px-5 max-w-xl mx-auto">
			<div className="flex flex-col w-full gap-3 pb-4">
				{getAvailableModes().map(mode => (
					<div className="flex w-full" key={mode.ref}>
						<Link
							to={"mode/" + mode.ref}
							className="text-center px-6 py-2 w-full bg-echo-yellow-500 text-echo-black-500 font-medium rounded-lg border-2 focus:border-echo-white-500 hover:border-echo-white-500 cursor-pointer"
						>
							{mode.description}
						</Link>

						{isCustomRef(mode.ref) && <RemoveButton ref={mode.ref} refresh={() => forceUpdate(v => v + 1)} />}
					</div>
				))}
			</div>
		</div>
	</>;
};

function RemoveButton({ ref, refresh }: { ref: CustomRef, refresh: () => void }) {
	const handleClick = () => {
		if (confirm("Deseja mesmo remover esta configuração?")) {
			removeCustomSettingsFromStorage(ref);
			refresh();
		}
	};

	return <button type="button" onClick={handleClick} className="px-4 py-2 bg-echo-muted-500 text-echo-black-500 font-medium rounded-lg border-2 focus:border-echo-white-500 hover:border-echo-white-500 cursor-pointer">
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
			<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"></path>
			<path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"></path>
		</svg>
	</button>
}
