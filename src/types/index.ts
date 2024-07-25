import { API, FileInfo, Options, Transform } from "jscodeshift";

/**
 * This is necessary as @types/jscodeshift does not account for returning a Promise from a
 * transform function, which is supported by jscodeshift.
 * See: https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/70137
 */
export type TransformWithPromise<TransformOptions extends Options = Options> = (
	file: FileInfo,
	api: API,
	options: TransformOptions,
) => ReturnType<Transform> | Promise<ReturnType<Transform>>;

export type Adapter<TransformOptions extends Options = Options> = (
	transform: TransformWithPromise<TransformOptions>,
	...args: Parameters<TransformWithPromise<TransformOptions>>
) => ReturnType<TransformWithPromise<TransformOptions>>;
