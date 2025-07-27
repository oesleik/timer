import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { useNavigate } from "react-router";
import { ModeSettings } from "../modes/types";
import { ModeParamsForm } from "../components/ModeParamsForm";

export const ModeSelectConfigPage = ({ modeSettings }: { modeSettings: ModeSettings }) => {
	const navigate = useNavigate();

	const setCustomSettings = (customSettings: Record<string, string>) => {
		const queryParams = new URLSearchParams(customSettings);
		navigate("/timer/" + modeSettings.ref + "?" + queryParams.toString());
	};

	return <div className="flex flex-col h-screen py-5 px-5">
		<div className="mb-5">
			<Button onClick={() => navigate("/")}>Voltar</Button>
			<h1 className="inline-block ml-5">{modeSettings.description}</h1>
		</div>

		<div className="text-2xl flex flex-col items-center justify-center h-full max-w-xl mx-auto">
			<ModeParamsForm modeSettings={modeSettings} setCustomSettings={setCustomSettings} />
		</div>
	</div>;
};

const Button = ({ className, children, ...props }: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) => {
	return <>
		<button
			type="button"
			className={["bg-echo-gray-500 px-6 py-2 cursor-pointer rounded-lg text-echo-white-500 border-echo-gray-500 border-2 focus:border-echo-white-500 hover:border-echo-white-500", className].join(" ")}
			{...props}
		>
			{children}
		</button>
	</>;
};
