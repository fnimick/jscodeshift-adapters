import { testTransform } from "../../../test-transform.js";
import transform from "./transform.js";

const input = `
<h1>This is just a template</h1>
`;

// jscodeshift test utils represent a no-op transform as empty string
const output = "";

testTransform(transform, "Widget.svelte", input, output);
