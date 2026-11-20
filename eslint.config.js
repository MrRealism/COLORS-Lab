const js = require("@eslint/js");

module.exports = [
  {
    ignores: [
      "node_modules/**",
      "public/js/md5.js",
      "**/*.min.js",
      "coverage/**"
    ]
  },
  js.configs.recommended,
  {
    files: ["public/js/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        window: "readonly",
        document: "readonly",
        fetch: "readonly",
        console: "readonly",
        hex_md5: "readonly"
      }
    }
  },
  {
    files: ["tests/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        describe: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        fetch: "readonly",
        process: "readonly"
      }
    }
  }
];
