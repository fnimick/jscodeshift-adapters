import { testTransform } from "../../test-transform.js";
import transform from "./transform.js";

const input = `
<template>
  <div
    class="widget"
    data-another="attribute"
  >
    Hello {{name}}
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    }
  }
};
</script>

<style>
.widget {
  color: red;
}
</style>
`;

const output = `
<template>
  <div
    class="widget"
    data-another="attribute"
  >
    Hello {{name}}
  </div>
</template>

<script>
export default {};
</script>

<style>
.widget {
  color: red;
}
</style>
`;

testTransform(transform, "Widget.vue", input, output);
