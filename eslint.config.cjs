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
    files: ["eslint.config.cjs", "eslint.config.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        require: "readonly",
        module: "readonly"
      }
    }
  },
  {
    files: ["public/js/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        window: "readonly",
        document: "readonly",
        XMLHttpRequest: "readonly",
        fetch: "readonly",
        console: "readonly",
        hex_md5: "readonly"
      }
    },
    rules: {
      // Functions in code.js are invoked from HTML attributes (e.g., onclick/onload)
      "no-unused-vars": ["error", { vars: "local", args: "after-used" }]
    }
  },
  {
    files: ["tests/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        __dirname: "readonly",
        window: "readonly",
        document: "readonly",
        console: "readonly",
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
