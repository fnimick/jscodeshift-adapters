import { testTransform } from "../../../test-transform.js";
import transform from "./transform.js";

const input = `
<script>
    export let foo = {
        name: 'HasWhitespaceLines',
        
        data() {
            return {
                string: \`
                    a multi
                    
                    line string
                \`
            }
        },
    };
</script>

<h1>Hello</h1>
`;

const output = `
<script>
    export let oof = {
        eman: 'HasWhitespaceLines',
        
        atad() {
            return {
                gnirts: \`
                    a multi
                    
                    line string
                \`
            };
        },
    };
</script>

<h1>Hello</h1>
`;

testTransform(transform, "Widget.svelte", input, output);
