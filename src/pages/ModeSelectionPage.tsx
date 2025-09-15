import { Link } from "react-router";
import { getAvailableModes } from "../hooks/useModeSettings";

export const ModeSelectionPage = () => {
	return <>
		<div className="text-2xl grid place-items-center h-screen py-5 px-5 max-w-xl mx-auto">
			<div className="flex flex-col w-full gap-3">
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
		</div>
	</>;
};
