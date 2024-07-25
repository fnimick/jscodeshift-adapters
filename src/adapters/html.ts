import { parse } from "node-html-parser";
import { zip } from "rambda";
import { Adapter } from "src/types/index.js";

export const adaptHTML: Adapter = async function adaptHTML(transform, ...args) {
	const [fileInfo, api, options] = args;
	const document = parse(fileInfo.source);
	const scripts = document.querySelectorAll("script");
	const newScripts = await Promise.all(
		scripts.map((script) =>
			transform(
				{
					...fileInfo,
					source: script.innerHTML,
				},
				api,
				options,
			),
		),
	);
	zip(scripts, newScripts).forEach(([script, newScript]) => {
		if (newScript) {
			script.innerHTML = newScript;
		}
	});
	return document.toString();
};
