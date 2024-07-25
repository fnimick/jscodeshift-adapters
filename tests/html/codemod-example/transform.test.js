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
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: false
    },
    age: {
      type: String
    }
  },
  computed: {
    hasName() {
      return !!this.name;
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
    Hello {{name}}
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    age: {
      type: String,
      required: true
    }
  },
  computed: {
    hasName() {
      return !!this.name;
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