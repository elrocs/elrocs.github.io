import { defineConfig } from "eslint-define-config";

export default defineConfig({
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  plugins: [
    "@typescript-eslint"
  ],
  rules: {
    semi: ["error", "always"],
    indent: ["error", 2],
    quotes: ["error", "single"],
    "no-unused-vars": "off",      
    "@typescript-eslint/no-unused-vars": ["warn"],
  },
});
