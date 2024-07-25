import { testTransform } from "../../../test-transform.js";
import transform from "./transform.js";

const input = `
<script>
  const foo = 4;
  if (foo === 4) {
      console.log('yes');
  }
</script>

<div>
  <slot />
</div>
`;

const output = `
<script>
  const bar = 4;
  if (bar === 4) {
      console.log('yes');
  }
</script>

<div>
  <slot />
</div>
`;

testTransform(transform, "Widget.svelte", input, output);
