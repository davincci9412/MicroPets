
const blockstackConfig = require('@blockstack/eslint-config');

const { parser, ...rest } = blockstackConfig;

module.exports = {
  ...rest,
  plugins: ['import', 'prettier'],
  extends: ['react-app'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      modules: true
    }
  },
  rules: {
    ...rest.rules,
	'prettier/prettier': 0,
    "@typescript-eslint/no-non-null-assertion": [0],
    "@typescript-eslint/array-type": [0]
  }
}


/*
module.exports = {
  extends: "@blockstack",
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  rules: {
    "@typescript-eslint/no-use-before-define": [2],
  }
}

module.exports = {
  extends: ["@blockstack"],
  
}
*/