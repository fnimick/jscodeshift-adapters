import { Transform } from "jscodeshift";

/**
 * This is necessary as @types/jscodeshift does not account for returning a Promise from a
 * transform function, which is supported by jscodeshift.
 * See: https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/70137
 */
export type TransformWithPromise = (
	...args: Parameters<Transform>
) => ReturnType<Transform> | Promise<ReturnType<Transform>>;

export type Adapter = (
	transform: TransformWithPromise,
	...args: Parameters<Transform>
) => ReturnType<TransformWithPromise>;
