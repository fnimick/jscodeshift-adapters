import { testTransform } from "../../../test-transform.js";
import transform from "./transform.js";

const input = `
<script lang="ts" context="module">
  export const foo = 42;
</script>

<script lang="ts">
  const foo = 4;
  if (foo === 4) {
      console.log('yes');
  }
</script>

<h1>Hello</h1>
`;

const output = `
<script lang="ts" context="module">
  export const bar = 42;
</script>

<script lang="ts">
  const bar = 4;
  if (bar === 4) {
      console.log('yes');
  }
</script>

<h1>Hello</h1>
`;

testTransform(transform, "Widget.svelte", input, output);
