declare module "vue-sfc-descriptor-to-string" {
	import { SFCDescriptor } from "@vue/compiler-sfc";
	type BlockType = "template" | "script" | "style";

	export default function toString(
		sfcDescriptor: SFCDescriptor,
		options?: Record<BlockType, number>,
	): string;
}
