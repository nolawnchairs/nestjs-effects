
module.exports = {
  parserOptions: {
    project: 'tsconfig.lint.json',
    sourceType: 'module',
  },
  root: true,
  env: {
    node: true,
    jest: true,
  },
  extends: [
    'plugin:@knightinteractive/library',
  ],
}
