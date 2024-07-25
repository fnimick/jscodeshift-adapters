import type { API, FileInfo, Options } from "jscodeshift";
import adapter from "../src/index.js";

const markup = `
<div class="widget">{{name}}</div>

<span>Extra</span>
`;

const script = `
export default {
  props: {
    name: String
  }
};
`;

const style = `
.widget {
  color: red;
}
`;

const FAKE_API = {} as unknown as API;

function sfc({
	markup,
	script,
	scriptSetup,
	style,
}: {
	markup?: string;
	script?: string;
	scriptSetup?: string;
	style?: string;
}) {
	const source = [
		markup ? `<template>${markup}</template>` : "",
		script ? `<script>${script}</script>` : "",
		scriptSetup ? `<script setup>${scriptSetup}</script>` : "",
		style ? `<style>${style}</style>` : "",
	]
		.filter((content) => content)
		.join("\n\n");

	return "\n" + source + "\n";
}

function svelte({
	markup,
	script,
	scriptModule,
	style,
}: {
	markup?: string;
	script?: string;
	scriptModule?: string;
	style?: string;
}) {
	const source = [
		scriptModule ? `<script module>${scriptModule}</script>` : "",
		script ? `<script>${script}</script>` : "",
		markup ?? "",
		style ? `<style>${style}</style>` : "",
	]
		.filter((content) => content)
		.join("\n\n");

	return "\n" + source + "\n";
}

function commonAdapterTests(fileInfo: FileInfo) {
	test("passes source path as fileInfo.path", async () => {
		const { source, path } = fileInfo;
		let pathSeen: string | null = null;
		const adapted = adapter(function transform(fileInfo, api, options) {
			pathSeen = fileInfo.path;
		});

		await adapted(
			{
				path: `/the/path/${path}`,
				source,
			},
			FAKE_API,
			{},
		);

		expect(pathSeen).toBe(`/the/path/${path}`);
	});

	test("passes api to transform", async () => {
		const apiPassed = {
			jscodeshift: () => {},
			stats: () => {},
		} as unknown as API;
		let apiSeen = null as unknown as API;
		const adapted = adapter(function transform(fileInfo, api, options) {
			apiSeen = api;
		});

		await adapted(fileInfo, apiPassed, {});

		expect(apiSeen.jscodeshift).toBe(apiPassed.jscodeshift);
		expect(apiSeen.stats).toBe(apiPassed.stats);
	});

	test("passes options to transform", async () => {
		const optionsPassed = {
			blah: 1,
		};
		let optionsSeen = null as unknown as Options;
		const adapted = adapter(function transform(fileInfo, api, options) {
			optionsSeen = options;
		});

		const result = await adapted(fileInfo, FAKE_API, optionsPassed);

		expect(optionsSeen.blah).toBe(optionsPassed.blah);
	});

	test("is no-op if transform returns undefined", async () => {
		const adapted = adapter(function transform(fileInfo, api, options) {
			return undefined;
		});

		const result = await adapted(fileInfo, FAKE_API, {});

		expect([undefined, null, ""]).toContain(result);
	});

	test("is no-op if transform returns null", async () => {
		const adapted = adapter(function transform(fileInfo, api, options) {
			return null;
		});

		const result = await adapted(fileInfo, FAKE_API, {});

		expect([undefined, null, ""]).toContain(result);
	});

	test("is no-op if transform returns empty string", async () => {
		const adapted = adapter(function transform(fileInfo, api, options) {
			return "";
		});

		const result = await adapted(fileInfo, FAKE_API, {});

		expect([undefined, null, ""]).toContain(result);
	});
}

describe("adapter api tests", () => {
	describe("js files", () => {
		test("passes js content as fileInfo.source", async () => {
			let js: string | null = null;
			const adapted = adapter(function transform(fileInfo, api, options) {
				js = fileInfo.source;
			});

			await adapted(
				{
					source: "const b = 400;",
					path: "util.js",
				},
				FAKE_API,
				{},
			);

			expect(js).toBe("const b = 400;");
		});

		commonAdapterTests({
			source: "const b = 400;",
			path: "util.js",
		});
	});

	describe("vue files", () => {
		test("passes component <script> content as fileInfo.source", async () => {
			let source: string | null = null;
			const adapted = adapter(function transform(fileInfo, api, options) {
				source = fileInfo.source;
			});

			await adapted(
				{
					source: sfc({ markup, script, style }),
					path: "Widget.vue",
				},
				FAKE_API,
				{},
			);

			expect(source).toBe(script);
		});

		test("passes component <script setup> content as fileInfo.source", async () => {
			let source: string | null = null;
			const adapted = adapter(function transform(fileInfo, api, options) {
				source = fileInfo.source;
			});

			await adapted(
				{
					source: sfc({ markup, scriptSetup: script, style }),
					path: "Widget.vue",
				},
				FAKE_API,
				{},
			);

			expect(source).toBe(script);
		});

		test("runs on both <script> and <script setup> if both are present", async () => {
			let runs = 0;
			const adapted = adapter(function transform(fileInfo, api, options) {
				runs += 1;
			});

			await adapted(
				{
					source: sfc({ markup, script, scriptSetup: script, style }),
					path: "Widget.vue",
				},
				FAKE_API,
				{},
			);

			expect(runs).toBe(2);
		});

		test("is no-op and skips transform when there is no <script>", async () => {
			let invokedTransform = false;
			const adapted = adapter(function transform(fileInfo, api, options) {
				invokedTransform = true;
				return "var fail = 4;";
			});

			const result = await adapted(
				{
					source: sfc({ markup, style }),
					path: "Widget.vue",
				},
				FAKE_API,
				{},
			);

			expect(result).toBe(undefined);
			expect(invokedTransform).toBe(false);
		});

		commonAdapterTests({
			path: "Widget.vue",
			source: sfc({ markup, script, style }),
		});
	});

	describe("svelte files", () => {
		test("passes component <script> content as fileInfo.source", async () => {
			let source: string | null = null;
			const adapted = adapter(function transform(fileInfo, api, options) {
				source = fileInfo.source;
			});

			await adapted(
				{
					source: svelte({ markup, script, style }),
					path: "Widget.svelte",
				},
				FAKE_API,
				{},
			);

			expect(source).toBe(script);
		});

		test('passes component <script context="module"> content as fileInfo.source', async () => {
			let source: string | null = null;
			const adapted = adapter(function transform(fileInfo, api, options) {
				source = fileInfo.source;
			});

			await adapted(
				{
					source: svelte({ markup, scriptModule: script, style }),
					path: "Widget.svelte",
				},
				FAKE_API,
				{},
			);

			expect(source).toBe(script);
		});

		test('runs on both <script> and <script context="module"> if both are present', async () => {
			let runs = 0;
			const adapted = adapter(function transform(fileInfo, api, options) {
				runs += 1;
			});

			await adapted(
				{
					source: svelte({ markup, script, scriptModule: script, style }),
					path: "Widget.svelte",
				},
				FAKE_API,
				{},
			);

			expect(runs).toBe(2);
		});

		test("is no-op and skips transform when there is no <script>", async () => {
			let invokedTransform = false;
			const adapted = adapter(function transform(fileInfo, api, options) {
				invokedTransform = true;
				return "var fail = 4;";
			});

			const result = await adapted(
				{
					source: svelte({ markup, style }),
					path: "Widget.svelte",
				},
				FAKE_API,
				{},
			);

			expect(result).toBe(undefined);
			expect(invokedTransform).toBe(false);
		});

		commonAdapterTests({
			path: "Widget.svelte",
			source: svelte({ markup, script, style }),
		});
	});
});
