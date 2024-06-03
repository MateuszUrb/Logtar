import globals from "globals";
import pluginJs from "@eslint/js";
import jsdoc from "eslint-plugin-jsdoc";

export default [
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "module" },
    plugins: {
      jsdoc,
    },
    rules: {
      "jsdoc/no-defaults": 0,
    },
  },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  jsdoc.configs["flat/recommended"],
];
