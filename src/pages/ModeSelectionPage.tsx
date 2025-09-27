import { Link } from "react-router";
import { getAvailableModes } from "../hooks/useModeSettings";
import { CustomRef, isCustomRef, removeCustomSettingsFromStorage } from "../hooks/useCustomModeSettings";
import { useState } from "react";
import { Trash2Icon } from "lucide-react";

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

	return <button type="button" onClick={handleClick} className="px-3 py-2 bg-echo-muted-500 text-echo-black-500 font-medium rounded-lg border-2 focus:border-echo-white-500 hover:border-echo-white-500 cursor-pointer">
		<Trash2Icon />
	</button>
}
