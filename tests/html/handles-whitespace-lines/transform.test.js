import { testTransform } from "../../test-transform.js";
import transform from "./transform.js";

const input = `
<html>
<template>
    <div>
        <span></span>
        
    </div>
</template>
<script>
    export default {
        name: 'HasWhitespaceLines',
        
        data() {
            return {
                string: \`
                    a multi
                    
                    line string
                \`
            }
        },
    }
</script>
</html>
`;

const output = `
<html>
<template>
    <div>
        <span></span>
        
    </div>
</template>
<script>
    export default {
        eman: 'HasWhitespaceLines',
        
        atad() {
            return {
                gnirts: \`
                    a multi
                    
                    line string
                \`
            };
        },
    }
</script>
</html>
`;

testTransform(transform, "Widget.html", input, output);
