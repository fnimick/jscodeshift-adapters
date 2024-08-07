import { testTransform } from "../../test-transform.js";
import transform from "./transform.js";

const input = `
<script>
  const foo = 4;
  if (foo === 4) {
      console.log('yes');
  }
</script>

<h1>Hello</h1>
`;

const output = `
<script>
  const bar = 4;
  if (bar === 4) {
      console.log('yes');
  }
</script>

<h1>Hello</h1>
`;

testTransform(transform, "Widget.svelte", input, output);
