// @ts-check

import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
	{
		ignores: ["lib/", "node_modules/"],
	},
	eslint.configs.recommended,
	...tseslint.configs.strictTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				project: ["tsconfig.json", "tsconfig.all.json"],
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	{
		files: ["tests/**/*"],
		languageOptions: {
			globals: {
				...globals.jest,
				...globals.node,
			},
		},
		rules: {
			"@typescript-eslint/no-unused-vars": "off",
		},
	},
);
