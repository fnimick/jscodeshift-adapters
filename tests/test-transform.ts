import { TestOptions } from "jscodeshift/src/testUtils.js";
import { TransformWithPromise } from "../src/types/index.js";
import { runInlineTest } from "./jscodeshift-test-utils.js";
import { Options } from "jscodeshift";

export function testTransform(
	transform: TransformWithPromise,
	path: string,
	input: string,
	output: string,
	options: Options = {},
) {
	const fileInfo = {
		path,
		source: input,
	};

	it("transforms correctly", async () => {
		await runInlineTest(transform, options, fileInfo, output);
	});
}
