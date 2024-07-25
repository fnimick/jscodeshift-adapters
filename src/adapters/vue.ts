import descriptorToString from "vue-sfc-descriptor-to-string";
import { parse, type SFCScriptBlock } from "@vue/compiler-sfc";
import { Adapter } from "src/types/index.js";

// This is adapted from the original implementation in vue-jscodeshift-adapter,
// with changes for typescript and asynchronous transform function support.

export const adaptVue: Adapter = async function adaptVue(transform, ...args) {
	const [fileInfo, api, options] = args;

	const { descriptor: sfcDescriptor } = parse(fileInfo.source);
	if (!sfcDescriptor.script && !sfcDescriptor.scriptSetup) {
		return undefined;
	}

	const transformScriptBlock = async (
		scriptBlock: SFCScriptBlock | null,
	): Promise<SFCScriptBlock | null> => {
		if (scriptBlock) {
			const newContent = await transform(
				{
					...fileInfo,
					source: scriptBlock.content,
				},
				api,
				options,
			);

			return newContent ? { ...scriptBlock, content: newContent } : scriptBlock;
		} else {
			return scriptBlock;
		}
	};

	let hasChanges = false;

	const newScript = await transformScriptBlock(sfcDescriptor.script);
	if (newScript !== sfcDescriptor.script) {
		hasChanges = true;
		sfcDescriptor.script = newScript;
	}

	const newScriptSetup = await transformScriptBlock(sfcDescriptor.scriptSetup);
	if (newScriptSetup !== sfcDescriptor.scriptSetup) {
		hasChanges = true;
		sfcDescriptor.scriptSetup = newScriptSetup;
	}

	return hasChanges ? descriptorToString(sfcDescriptor) : undefined;
};
