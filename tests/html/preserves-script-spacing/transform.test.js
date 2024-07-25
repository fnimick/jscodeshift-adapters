import { testTransform } from "../../test-transform.js";
import transform from "./transform.js";

const input = `
<html>
<template>
  <div><span></span></div>
</template>
<script>
  const foo = 4;
  if (foo === 4) {
      console.log('yes');
  }
</script>
</html>
`;

const output = `
<html>
<template>
  <div><span></span></div>
</template>
<script>
  const bar = 4;
  if (bar === 4) {
      console.log('yes');
  }
</script>
</html>
`;

testTransform(transform, "Widget.html", input, output);
