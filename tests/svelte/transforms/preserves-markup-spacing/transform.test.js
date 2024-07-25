import { testTransform } from "../../../test-transform.js";
import transform from "./transform.js";

const input = `
<div>
  <div
    class="widget"
    data-another="attribute"
  >
    Hello {{name}}
  </div>
</div>

<span>Even more!</span>

<script>
const foo = 42;
</script>

<style>
.widget {
  color: red;
}
</style>
`;

const output = `
<div>
  <div
    class="widget"
    data-another="attribute"
  >
    Hello {{name}}
  </div>
</div>

<span>Even more!</span>

<script>
const foo = 'bar';
</script>

<style>
.widget {
  color: red;
}
</style>
`;

testTransform(transform, "Widget.svelte", input, output);
