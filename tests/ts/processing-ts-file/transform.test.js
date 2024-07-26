import { testTransform } from "../../test-transform.js";
import transform from "./transform.js";

const input = `
const foo: number = 42;
`;

const output = `
const bar: number = 42;
`;

testTransform(transform, "util.ts", input, output, {}, { parser: "tsx" });
