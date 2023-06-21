/** @type {import("prettier").Config} */
const config = {
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
  singleAttributePerLine: true,
  semi: false,
  trailingComma: "es5",
  singleQuote: false,
  tabWidth: 2,
  useTabs: false,
}

module.exports = config
