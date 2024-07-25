// Test utils for jscodeshift supporting async transforms.
// Necessary due to https://github.com/facebook/jscodeshift/issues/454

import type { FileInfo, JSCodeshift, Options } from "jscodeshift";
import type { TestOptions } from "jscodeshift/src/testUtils.js";
import { createRequire } from "module";
import { TransformWithPromise } from "../src/types/index.js";

const require = createRequire(import.meta.url);

type TransformModule =
	| {
			default: TransformWithPromise;
			parser: TestOptions["parser"];
	  }
	| TransformWithPromise;

export async function applyTransform(
	module: TransformModule,
	options: Options,
	input: FileInfo,
	testOptions: TestOptions = {},
) {
	// Handle ES6 modules using default export for the transform
	const transform = typeof module === "function" ? module : module.default;

	// Jest resets the module registry after each test, so we need to always get
	// a fresh copy of jscodeshift on every test run.
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	let jscodeshift: JSCodeshift = require("jscodeshift");
	const parser =
		testOptions.parser ||
		(typeof module === "function" ? undefined : module.parser);
	if (parser) {
		jscodeshift = jscodeshift.withParser(parser);
	}

	const output = await transform(
		input,
		{
			jscodeshift,
			j: jscodeshift,
			stats: () => {},
			report: (msg) => {
				console.log(msg);
			},
		},
		options,
	);

	return (output || "").trim();
}

export async function runInlineTest(
	module: TransformModule,
	options: Options,
	input: FileInfo,
	expectedOutput: string,
	testOptions?: TestOptions,
) {
	const output = await applyTransform(module, options, input, testOptions);
	expect(output).toEqual(expectedOutput.trim());
	return output;
}
