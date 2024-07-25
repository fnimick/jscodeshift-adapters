import {
	parse,
	SFCBlock,
	type SFCDescriptor,
	type SFCScriptBlock,
} from "@vue/compiler-sfc";
import { Adapter } from "src/types/index.js";
import { BaseElementNode } from "@vue/compiler-core";

// This is adapted from vue-sfc-descriptor-to-string, which is published as an esmodule and cannot
// be used in CJS contexts.

function descriptorToString(sfcDescriptor: SFCDescriptor) {
	const { template, script, scriptSetup, styles, customBlocks } = sfcDescriptor;

	return (
		[template, script, scriptSetup, ...styles, ...customBlocks]
			// discard blocks that don't exist
			.filter((block) => block != null)
			// sort blocks by source position
			.sort((a, b) => a.loc.start.offset - b.loc.start.offset)
			// figure out exact source positions of blocks
			.map((block) => {
				const openTag = makeOpenTag(block);
				const closeTag = makeCloseTag(block);
				// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
				const ast = (block as any).ast as BaseElementNode | undefined;
				const isSelfClosing = ast?.isSelfClosing;

				return Object.assign({}, block, {
					openTag,
					closeTag,
					isSelfClosing,

					...(isSelfClosing
						? {
								startOfOpenTag: ast.loc.start.offset,
								endOfOpenTag: ast.loc.end.offset,

								startOfCloseTag: ast.loc.start.offset,
								endOfCloseTag: ast.loc.end.offset,
							}
						: {
								startOfOpenTag: block.loc.start.offset - openTag.length,
								endOfOpenTag: block.loc.start.offset,

								startOfCloseTag: block.loc.end.offset,
								endOfCloseTag: block.loc.end.offset + closeTag.length,
							}),
				});
			})
			// generate sfc source
			.reduce((sfcCode, block, index, array) => {
				const first = index === 0;

				let newlinesBefore = 0;

				if (first) {
					newlinesBefore = block.startOfOpenTag;
				} else {
					const prevBlock = array[index - 1];
					newlinesBefore = block.startOfOpenTag - prevBlock.endOfCloseTag;
				}

				return (
					sfcCode +
					"\n".repeat(newlinesBefore) +
					(block.isSelfClosing
						? // eslint-disable-next-line
							`${(block as any).ast.loc.source}\n`
						: block.openTag + block.content + block.closeTag)
				);
			}, "")
	);
}

function makeOpenTag(block: SFCBlock) {
	let source = "<" + block.type;

	source += Object.keys(block.attrs)
		.map((name) => {
			const value = block.attrs[name];

			if (value === true) {
				return name;
			} else {
				return `${name}="${value}"`;
			}
		})
		.map((attr) => " " + attr)
		.join("");

	return source + ">";
}

function makeCloseTag(block: SFCBlock) {
	return `</${block.type}>\n`;
}

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
