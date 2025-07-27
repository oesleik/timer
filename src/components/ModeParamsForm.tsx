import { useEffect, useState } from "react";
import { CustomParamSettings, ModeSettings } from "../modes/types";

type FormData = Record<string, string>;

export const ModeParamsForm = ({
	modeSettings,
	setCustomSettings,
}: {
	modeSettings: ModeSettings,
	setCustomSettings: (v: FormData) => void,
}) => {
	const customParams = modeSettings.customParams || {};
	const autoFocusOn = Object.entries(customParams).find(([, param]) => param.inputType !== "options")?.[0];

	const [formData, setFormData] = useState<FormData>(() => {
		const formData: FormData = {};
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

	if (!Object.keys(customParams).length) {
		return null;
	}

	return <>
		<form onSubmit={() => { }} className="text-2xl">
			{Object.entries(customParams).map(([ref, param]) => (
				<CustomParamInput
					key={ref}
					param={param}
					value={formData[ref]}
					autoFocus={autoFocusOn === ref}
					setValue={(value: string) => setParamValue(ref, value)}
				/>
			))}
			<button
				type="button"
				onClick={() => submitParams()}
				className="text-center w-full px-6 py-2 bg-echo-yellow-500 text-echo-black-500 font-medium rounded-lg mr-4 border-2 focus:border-echo-white-500 hover:border-echo-white-500 cursor-pointer"
			>
				Continuar
			</button>
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

	return <></>;
};
