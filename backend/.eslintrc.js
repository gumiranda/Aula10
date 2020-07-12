module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    'import/prefer-default-export': 'off',
    'no-underscore-dangle': 'off',
    'import/order': 'off',
    'no-use-before-define': 'off',
    camelcase: 'off',
    'no-unused-expressions': 'off',
    'no-underscore-dangle': 'off',
    'no-undef': 'off',
  },
};
