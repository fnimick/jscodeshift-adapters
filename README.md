# jscodeshift-adapters

Run [jscodeshift](https://github.com/facebook/jscodeshift) on scripts contained in Svelte
components, Vue components, and more. Supports both esmodule and commonjs projects. Additional
adapter contributions are welcome!

## Install

```
npm install jscodeshift-adapters -D
```

## Usage

The instructions below assume you're familiar with [jscodeshift](https://github.com/facebook/jscodeshift).

### Run a codemod on some `.js`, `.ts`, `.vue`, `.svelte`, and/or `.html` files

| When transforming | `fileInfo.source` will be  |
| ----------------- | -------------------------- |
| `.js`             | the contents of the file   |
| `.ts`             | the contents of the file   |
| `.vue`            | the contents of `<script>` |
| `.svelte`         | the contents of `<script>` |
| `.html`           | the contents of `<script>` |

The source file will be updated appropriately based on the return value of your `transform()`.

For files that do not have an appropriate script source (such as a `<script>` tag), your
codemod will not be called and the source file will not be changed.

#### 1. Create wrapped transform function

```js
// my-transform.js
import adapt from "jscodeshift-adapters";
import someCodemod from "some-codemod";

export default adapt(someCodemod);
```

#### 2. Run jscodeshift

```bash
$ jscodeshift <path> -t my-transform.js --extensions js,ts,html,svelte,vue --parser tsx
```

See [jscodeshift readme](https://github.com/facebook/jscodeshift#usage-cli) for more info on
jscodeshift CLI. Note that you must use the `tsx` parser or another parser that supports typescript
for handling files which use typescript syntax.

## Acknowledgements

Heavily inspired by Paul Salaets's
[vue-jscodeshift-adapter](https://github.com/psalaets/vue-jscodeshift-adapter), copied and modified
to support asynchronous transform functions and running in commonjs contexts.

[@knighted/duel](https://github.com/knightedcodemonkey/duel) for dual commonjs and esm build target
support.

## License

MIT
