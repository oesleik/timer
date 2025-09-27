type ExerciseFrag = {
	type: "reps" | "weight" | "description",
	content: string,
};

export function parseExerciseItemString(desc: string): ExerciseFrag[] {
	const frags: ExerciseFrag[] = [];
	let limit = 500; // Por precaução

	while (desc.length && limit > 0) {
		limit--;

		if (/\d/.test(desc) && /\//.test(desc) && /^\s*[\(\d][^a-zA-Z:]+$/.test(desc)) {
			frags.push({
				type: "weight",
				content: desc,
			});

			desc = "";
			continue;
		}

		const repsRes = desc.match(/^\s*\d+(m\b|x\b|'|")?\s*/);

		if (repsRes && repsRes[0]) {
			frags.push({
				type: "reps",
				content: repsRes[0],
			});

			desc = desc.substring(repsRes[0].length);
			continue;
		}

		const descRes = desc.match(/^.[^\d\/\(\)]*/);
		const descFrag = descRes && descRes[0] ? descRes[0] : desc;

		frags.push({
			type: "description",
			content: descFrag,
		});

		desc = desc.substring(descFrag.length);
	}

	return frags;
}
