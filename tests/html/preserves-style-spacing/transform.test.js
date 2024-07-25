import { testTransform } from "../../test-transform.js";
import transform from "./transform.js";

const input = `
<html>
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
</html>
`;

const output = `
<html>
<script>
export default {};
</script>

<style>
  .widget {
    color: red;
  }
</style>
</html>
`;

testTransform(transform, "Widget.html", input, output);
