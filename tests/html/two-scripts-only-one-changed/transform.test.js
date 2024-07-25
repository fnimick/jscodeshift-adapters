import { testTransform } from "../../test-transform.js";
import transform from "./transform.js";

const input = `
<html>
<template>
  <div class="widget">
    Hello {{name}}
  </div>
</template>

<script>
  // unchanged
  const asdf = 10;
</script>

<script>
  // this changes
  const foo = 4;
</script>

<style>
.widget {
  color: red;
}
</style>
</html>
`;

const output = `
<html>
<template>
  <div class="widget">
    Hello {{name}}
  </div>
</template>

<script>
  // unchanged
  const asdf = 10;
</script>

<script>
  // this changes
  const bar = 4;
</script>

<style>
.widget {
  color: red;
}
</style>
</html>
`;

testTransform(transform, "Widget.html", input, output);
