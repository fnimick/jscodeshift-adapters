import { testTransform } from "../../test-transform.js";
import transform from "./transform.js";

const input = `
<script lang="ts" context="module">
  // this changes
  const foo = 4;
</script>

<script lang="ts">
  // unchanged
  const asdf = 10;
</script>

<div class="widget">
  Hello {{name}}
</div>

<style>
.widget {
  color: red;
}
</style>
`;

const output = `
<script lang="ts" context="module">
  // this changes
  const bar = 4;
</script>

<script lang="ts">
  // unchanged
  const asdf = 10;
</script>

<div class="widget">
  Hello {{name}}
</div>

<style>
.widget {
  color: red;
}
</style>
`;

testTransform(transform, "Widget.svelte", input, output);
