import { testTransform } from "../../test-transform.js";
import transform from "./transform.js";

const input = `
<script>
export let foo = {
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

<div class="widget">
    Hello {{name}}
</div>

<style>
.widget {
  color: red;
}
</style>
`;

const output = `
<script>
export let foo = {
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

<div class="widget">
    Hello {{name}}
</div>

<style>
.widget {
  color: red;
}
</style>
`;

testTransform(transform, "Widget.svelte", input, output);
