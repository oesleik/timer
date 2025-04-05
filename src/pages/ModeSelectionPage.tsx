import { Link } from "react-router";
import { getAvailableModes } from "../hooks/useModeSettings";

export const ModeSelectionPage = () => {
	return <>
		<div className="text-2xl flex flex-col items-center justify-center h-screen gap-3 py-5 px-5 max-w-xl mx-auto">
			{getAvailableModes().map(mode => (
				<Link
					key={mode.ref}
					to={"mode/" + mode.ref}
					className="text-center px-6 py-2 w-full bg-echo-yellow-500 text-echo-black-500 font-medium rounded-lg border-2 focus:border-echo-white-500 hover:border-echo-white-500 cursor-pointer"
				>
					{mode.description}
				</Link>
			))}
		</div>
	</>;
};
