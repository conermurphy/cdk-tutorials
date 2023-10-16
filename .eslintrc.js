module.exports = {
  extends: 'conermurphy',
  ignorePatterns: ['/**/cdk.out/', '*.js', '**/*.d.ts', '**/node_modules/**'],
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
        project: ['./tsconfig.json'],
      },
      settings: {
        'import/resolver': {
          typescript: {
            project: ['./tsconfig.json'],
          },
        },
      },
      rules: {
        'no-new': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },
    {
      files: ['./**/*.ts', './**/*.tsx'],
      plugins: ['import', '@typescript-eslint'],
      parser: '@typescript-eslint/parser',
      extends: ['conermurphy'],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./*/tsconfig.json'],
      },
      settings: {
        'import/resolver': {
          typescript: {
            tsconfigRootDir: __dirname,
            project: ['./*/tsconfig.json'],
          },
        },
      },
      rules: {
        'no-new': 'off',
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
  rules: {
    '@typescript-eslint/restrict-template-expressions': 'off',
    'no-new': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
};
