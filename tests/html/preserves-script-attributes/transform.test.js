import { testTransform } from "../../test-transform.js";
import transform from "./transform.js";

const input = `
<html>
<template>
  <div class="widget">
    Hello {{name}}
  </div>
</template>

<script nomodule>
  const foo = 5;
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

<script nomodule>
  const bar = 5;
</script>

<style>
.widget {
  color: red;
}
</style>
</html>
`;

testTransform(transform, "Widget.html", input, output);
