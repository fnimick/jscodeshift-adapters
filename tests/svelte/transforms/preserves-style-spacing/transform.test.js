import { testTransform } from "../../../test-transform.js";
import transform from "./transform.js";

const input = `
<script>
export default {
  name: 'IndentedStyle'
};
</script>

<style>
  .widget {
    color: red;
  }
</style>
`;

const output = `
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
