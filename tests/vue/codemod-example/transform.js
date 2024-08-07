/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import adapt from "../../../src/index.js";

export default adapt((fileInfo, api, options) => {
	const j = api.jscodeshift;
	const root = j(fileInfo.source);

	root
		.find(j.ExportDefaultDeclaration)
		.find(j.ObjectExpression)
		.find(j.ObjectProperty, (p) => p.key.name === "props")
		.find(j.ObjectExpression)
		.find(j.ObjectProperty)
		.find(j.ObjectExpression)
		.forEach((o) => {
			const requiredFlag = o.node.properties.find((p) => {
				return p.key.name === "required";
			});

			if (requiredFlag) {
				if (requiredFlag.value.value === false) {
					requiredFlag.value = j.literal(true);
				}
			} else {
				o.node.properties.push(
					j.property("init", j.identifier("required"), j.literal(true)),
				);
			}
		});

	return root.toSource();
});
