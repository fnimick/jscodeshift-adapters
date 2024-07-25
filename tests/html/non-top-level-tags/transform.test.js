import { testTransform } from "../../test-transform.js";
import transform from "./transform.js";

const input = `
<html>
<template>
  <div class="widget">
    <template>
      <div>1</div>
      <div>2</div>
    </template>
    <script>
      var a = 1;
    </script>
    <style>.widget {background-color: green;}</style>
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
</html>
`;

const output = `
<html>
<template>
  <div class="widget">
    <template>
      <div>1</div>
      <div>2</div>
    </template>
    <script>
// this is new
      var a = 1;
    </script>
    <style>.widget {background-color: green;}</style>
  </div>
</template>

<script>
// this is new
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
</html>
`;

testTransform(transform, "Widget.html", input, output);
