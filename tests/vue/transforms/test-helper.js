import { runInlineTest } from "../jscodeshift-test-utils.js";

/**
 * Test a transform function.
 *
 * @param {Function} transform
 * @param {String} path    - (fake) file path of source passed to transform
 * @param {String} input   - Source code
 * @param {String} output  - Expected transform result
 * @param {Object} options - Options passed to transform, optional
 */
export function testTransform(transform, path, input, output, options = {}) {
	const fileInfo = {
		path,
		source: input,
	};

	it("transforms correctly", async () => {
		await runInlineTest(transform, options, fileInfo, output);
	});
}
