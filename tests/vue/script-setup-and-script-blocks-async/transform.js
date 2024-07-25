import { resolve } from "path";
import adapt from "../../../src/index.js";

export default adapt((fileInfo, api, options) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(
				api
					.jscodeshift(fileInfo.source)
					.findVariableDeclarators("foo")
					.renameTo("bar")
					.toSource(),
			);
		}, 100);
	});
});
