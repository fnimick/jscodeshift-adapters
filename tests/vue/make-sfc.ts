export default function makeSFC({
	template,
	script,
	scriptSetup,
	style,
}: {
	template?: string;
	script?: string;
	scriptSetup?: string;
	style?: string;
}) {
	const source = [
		template ? `<template>${template}</template>` : "",
		script ? `<script>${script}</script>` : "",
		scriptSetup ? `<script setup>${scriptSetup}</script>` : "",
		style ? `<style>${style}</style>` : "",
	]
		.filter((content) => content)
		.join("\n\n");

	return "\n" + source + "\n";
}
