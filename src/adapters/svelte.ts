import { Adapter } from "src/types/index.js";
import { preprocess } from "svelte/compiler";

export const adaptSvelte: Adapter = async function adaptSvelte(
	transform,
	...args
) {
	const [fileInfo, api, options] = args;
	const { code } = await preprocess(fileInfo.source, {
		script: async ({ content }) => {
			const newScript = await transform(
				{
					...fileInfo,
					source: content,
				},
				api,
				options,
			);
			if (newScript) {
				return { code: newScript };
			}
		},
	});
	if (code !== fileInfo.source) {
		return code;
	}
	return undefined;
};
