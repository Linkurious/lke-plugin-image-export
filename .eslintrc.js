<<<<<<< HEAD
=======
const common = {
  env: {
    node: true,
    es6: true,
  },
  plugins: ["prettier", "markdown"],
  extends: [
    "airbnb-base",
    "plugin:jest/all",
    "plugin:markdown/recommended", // REF: https://github.com/eslint/eslint-plugin-markdown/blob/main/lib/index.js
    "prettier",
  ],
  ignorePatterns: ["node_modules/", "dist/", "coverage/"],
  rules: {
    "prettier/prettier": "error",
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error",
    "jest/expect-expect": "off",
    "jest/prefer-expect-assertions": "off",
    "jest/no-test-return-statement": "off",
    "import/prefer-default-export": "off",
    "import/extensions": "off",
    "no-console": "off",
    "no-iterator": "off",
    "no-restricted-syntax": "off",
    "no-await-in-loop": "off",
    "consistent-return": "off",
    "no-shadow": "off",
    "no-unused-vars": "off",
  },
};

>>>>>>> master
module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-empty-interface": "off",
  },
};
