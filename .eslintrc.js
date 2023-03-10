module.exports = {
  extends: 'conermurphy',
  ignorePatterns: ['/**/cdk.out/'],
  plugins: ['unused-imports'],
  root: true,
  settings: {
    react: {
      version: '18.x.x',
    },
  },
  overrides: [
    {
      files: ['./*.ts', './*.tsx'],
      plugins: ['import', '@typescript-eslint'],
      parser: '@typescript-eslint/parser',
      extends: ['conermurphy'],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json', './*/tsconfig.json'],
      },
      settings: {
        'import/resolver': {
          typescript: {
            tsconfigRootDir: __dirname,
            project: ['./tsconfig.json', './*/tsconfig.json'],
          },
        },
      },
      rules: {
        'no-new': 'off',
      },
    },
  ],
  rules: {
    '@typescript-eslint/restrict-template-expressions': 'off',
    'no-new': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
};
