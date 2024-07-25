import { Options } from "jscodeshift";
import { adaptHTML, adaptSvelte, adaptVue } from "./adapters/index.js";
import { TransformWithPromise } from "./types/index.js";

export function adapt<TransformOptions extends Options>(
	transform: TransformWithPromise<TransformOptions>,
): TransformWithPromise<TransformOptions> {
	return function (
		...args: Parameters<TransformWithPromise<TransformOptions>>
	) {
		const [fileInfo] = args;
		if (fileInfo.path.endsWith(".vue")) {
			// return adaptVueBase(transform)(...args);
			return adaptVue(transform, ...args);
		}
		if (fileInfo.path.endsWith(".svelte")) {
			return adaptSvelte(transform, ...args);
		}
		if (fileInfo.path.endsWith(".html")) {
			return adaptHTML(transform, ...args);
		}
		return transform(...args);
	};
}

export default adapt;
