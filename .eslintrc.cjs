// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path")

/** @type {import("eslint").Linter.Config} */
const config = {
  globals: {
    React: true,
    JSX: true,
  },
  overrides: [
    {
      extends: [
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
      files: ["*.ts", "*.tsx"],
      parserOptions: {
        project: path.join(__dirname, "tsconfig.json"),
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: path.join(__dirname, "tsconfig.json"),
    sourceType: "module",
  },
  env: { es6: true },
  plugins: ["@typescript-eslint", "simple-import-sort", "import"],
  extends: ["next/core-web-vitals", "plugin:@typescript-eslint/recommended"],
  rules: {
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      },
    ],
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-empty-interface": ["off"],

    //#endregion  //*======== IMPORT SORT ===========
    "simple-import-sort/exports": "warn",
    "simple-import-sort/imports": [
      "warn",
      {
        groups: [
          // ref: https://github.com/lydell/eslint-plugin-simple-import-sort/blob/main/examples/.eslintrc.js#L217
          // The default grouping, but with type imports first in each group.
          ["^\\u0000"],
          ["^node:.*\\u0000$", "^node:"],
          ["^@?\\w.*\\u0000$", "^@?\\w"],
          ["(?<=\\u0000)$", "^"],
          ["^\\..*\\u0000$", "^\\."],

          // Style imports.
          ["^.+\\.s?css$"],
        ],
      },
    ],
    //#endregion  //*======== IMPORT SORT ===========
  },
}

module.exports = config
