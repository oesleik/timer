import { expect, test } from "vitest";
import { parseExerciseItemString } from "./parseExerciseItem";

test("Parse exercise item", () => {
	assertParseExercise("{{01}} rounds of: ({{0}} - {{5}}) ({{5'}})");
	assertParseExercise("dynamic shoulder stretch (rack)");
	assertParseExercise("back triangle extension");
	assertParseExercise("seated cross over stretch");
	assertParseExercise("{{03}} rounds of (CAP {{5'}}):");
	assertParseExercise("airplane - {{10}} ({{5}} each side)");
	assertParseExercise("squat hold (on the wall) - {{30\"}}");
	assertParseExercise("{{03}} rounds of (CAP {{5'}}):");
	assertParseExercise("airplane - {{10}} ({{5}} each side)");
	assertParseExercise("squat hold (on the wall) - {{30\"}}");
	assertParseExercise("scapular protraction and retraction (floor) - {{10}}");
	assertParseExercise("{{11}} chest to bar");
	assertParseExercise("{{2}} deadlift [[142/93]]");
	assertParseExercise("{{10}} handstand push-up");
	assertParseExercise("- {{2}} rounds of:");
	assertParseExercise("- hand release push-up - {{8}}");
	assertParseExercise("{{00}}:{{00}} - {{16}}:{{00}}:");
	assertParseExercise("{{03}} rounds of:");
	assertParseExercise("{{12}} single arm dumbbell overhead lunge");
	assertParseExercise("{{10}} plate overhead squat");
	assertParseExercise("{{12}} single arm dumbbell overhead squat");
	assertParseExercise("{{12}} dumbbell overhead squat");
	assertParseExercise("PRÉ-WOD:");
	assertParseExercise("{{6'}}");
	assertParseExercise("{{3}} rope climb");
	assertParseExercise("{{17}} dumbbell squat [[22,5/15 (17,5/15) (15/10)]]");
	assertParseExercise("{{15}} hang dumbbell snatch [[22,5/15 (17,5/15) (15/10)]]");
	assertParseExercise("{{12}}/{{9}} cal. row - {{15}}/{{12}} cal. air bike");
	assertParseExercise("run - {{50m}}");
	assertParseExercise("burpee - {{5}}");
	assertParseExercise("- practice - {{20'}}");
	assertParseExercise("feed and knees togheter squat (dumbbell) - {{12}}");
	assertParseExercise("single leg squat to box - {{12}} ({{6}} each side)");
	assertParseExercise("single leg squat to box (lower) - {{12}} ({{6}} each side)");
	assertParseExercise("pistol squat - practice");
	assertParseExercise("EMOM {{12'}}/{{50\"}}:");
});

function assertParseExercise(expected: string, input?: string): void {
	input = input || expected.replace(/(\{\{|\}\}|\[\[|\]\])/g, "");
	const result = parseExerciseItemString(input);

	const resultString = Object.values(result).map(({ type, content }) => {
		if (type == "reps") {
			return `{{${content}}}`;
		}

		if (type == "weight") {
			return `[[${content}]]`;
		}

		return content;
	}).join("").replace(/(\{\{|\[\[)(\s+)/g, "$2$1").replace(/(\s+)(\}\}|\]\])/g, "$2$1");

	expect(resultString).toBe(expected);
}
