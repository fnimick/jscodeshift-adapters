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
  const foo = 1;
</script>

<script>
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
  const bar = 1;
</script>

<script>
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
