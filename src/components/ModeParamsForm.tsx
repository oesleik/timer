import { useEffect, useState } from "react";
import { CustomParamSettings, ModeSettings, ModeType } from "../modes/types";
import { isCustomRef, saveCustomSettingsToStorage } from "../hooks/useCustomModeSettings";

type FormData = Record<string, string>;

export const ModeParamsForm = ({
	modeSettings,
	setCustomSettings,
	ref,
}: {
	modeSettings: ModeSettings,
	setCustomSettings: (v: FormData) => void,
	ref: ModeType | string,
}) => {
	const customParams = modeSettings.customParams || {};
	const autoFocusOn = Object.entries(customParams).find(([, param]) => param.inputType !== "options")?.[0];

	const [formData, setFormData] = useState<FormData>(() => {
		const formData: FormData = { exercises: modeSettings.exercises || "" };

		if (isCustomRef(ref)) {
			formData.description = modeSettings.description;
		}

		Object.entries(customParams).forEach(([ref, param]) => {
			formData[ref] = String(param.defaultValue || "");
		});

		return formData;
	});

	const setParamValue = (ref: string, value: string) => setFormData(formData => ({
		...formData,
		[ref]: value,
	}));

	useEffect(() => {
		if (!Object.keys(modeSettings.customParams || {}).length) {
			setCustomSettings(formData);
		}
	}, [modeSettings, setCustomSettings, formData]);

	const submitParams = () => {
		setCustomSettings(formData);
	};

	const saveConfig = () => {
		if (!formData.description) {
			const name = prompt("Custom settings name:") || `Custom setting: ${ref}`;
			if (name == null) return; // Usuário cancelou a operação
			formData.description = name;
		}

		saveCustomSettingsToStorage(ref, modeSettings.type, formData);
	};

	if (!Object.keys(customParams).length) {
		return null;
	}

	return <>
		<form onSubmit={() => { }} className="text-2xl w-full">
			{isCustomRef(ref) && !!formData.description && (
				<CustomParamInput
					param={{ inputType: "text", description: "Description", defaultValue: "" }}
					value={formData.description}
					setValue={(value: string) => setParamValue("description", value)}
				/>
			)}

			{Object.entries(customParams).map(([ref, param]) => (
				<CustomParamInput
					key={ref}
					param={param}
					value={formData[ref]}
					autoFocus={autoFocusOn === ref}
					setValue={(value: string) => setParamValue(ref, value)}
				/>
			))}

			<CustomParamInput
				param={{ inputType: "textarea", description: "Exercises", defaultValue: "" }}
				value={formData.exercises}
				setValue={(value: string) => setParamValue("exercises", value)}
			/>

			<div className="flex items-stretch w-full gap-2">
				<button
					type="button"
					onClick={() => submitParams()}
					className="text-center flex-3 px-6 py-2 bg-echo-yellow-500 text-echo-black-500 font-medium rounded-lg border-2 focus:border-echo-white-500 hover:border-echo-white-500 cursor-pointer"
				>
					Continuar
				</button>

				<button
					type="button"
					onClick={() => saveConfig()}
					className="text-center flex-1 px-6 py-2 bg-echo-yellow-500 text-echo-black-500 font-medium rounded-lg border-2 focus:border-echo-white-500 hover:border-echo-white-500 cursor-pointer"
				>
					Salvar
				</button>
			</div>
		</form>
	</>;
};

const CustomParamInput = ({ param, value, setValue, autoFocus }: {
	param: CustomParamSettings,
	value: string | undefined,
	setValue: (value: string) => void
	autoFocus?: boolean
}) => {
	if (param.inputType === "number") {
		return <>
			<label className="block text-echo-white-500 text-sm font-bold mb-2">
				{param.description}
			</label>
			<input
				type="number"
				value={value}
				autoFocus={autoFocus}
				onFocus={event => event.target.select()}
				onChange={event => setValue(event.target.value)}
				className="shadow appearance-none border rounded w-full py-2 px-3 mb-6 text-echo-white-500 leading-tight focus:outline-none focus:shadow-outline"
			/>
		</>;
	}

	if (param.inputType === "options") {
		return <>
			<div className="mb-6">
				<label className="block text-echo-white-500 text-sm font-bold mb-2">
					{param.description}
				</label>
				{param.options.map((option, idx) => (
					<label key={idx} className="flex items-center">
						<input
							type="radio"
							value={option.value}
							checked={value === option.value}
							onChange={event => setValue(event.target.value)}
							className="mr-2"
						/>
						{option.label}
					</label>
				))}
			</div>
		</>;
	}

	if (param.inputType === "text") {
		return <>
			<label className="block text-echo-white-500 text-sm font-bold mb-2">
				{param.description}
			</label>
			<input
				type="text"
				value={value}
				autoFocus={autoFocus}
				onFocus={event => event.target.select()}
				onChange={event => setValue(event.target.value)}
				className="shadow appearance-none border rounded w-full py-2 px-3 mb-6 text-echo-white-500 leading-tight focus:outline-none focus:shadow-outline"
			/>
		</>;
	}

	if (param.inputType === "textarea") {
		return <>
			<label className="block text-echo-white-500 text-sm font-bold mb-2">
				{param.description}
			</label>
			<textarea
				rows={4}
				value={value}
				autoFocus={autoFocus}
				onFocus={event => event.target.select()}
				onChange={event => setValue(event.target.value)}
				className="shadow appearance-none border rounded w-full py-2 px-3 mb-6 text-echo-white-500 leading-tight focus:outline-none focus:shadow-outline"
			/>
		</>;
	}

	return <></>;
};
