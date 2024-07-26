import { testTransform } from "../../test-transform.js";
import transform from "./transform.js";

const input = `
<template>
  <div class="widget">
    Hello {{name}}
  </div>
</template>

<script lang="ts">
  const foo: number = 1;
</script>

<script setup lang="ts">
  const foo: number = 4;
</script>

<style>
.widget {
  color: red;
}
</style>
`;

const output = `
<template>
  <div class="widget">
    Hello {{name}}
  </div>
</template>

<script lang="ts">
  const bar: number = 1;
</script>

<script setup lang="ts">
  const bar: number = 4;
</script>

<style>
.widget {
  color: red;
}
</style>
`;

testTransform(transform, "Widget.vue", input, output);
