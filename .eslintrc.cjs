// module.exports = {
//   root: true,
//   env: { browser: true, es2020: true },
//   extends: [
//     'eslint:recommended',
//     'plugin:@typescript-eslint/recommended',
//     'plugin:react-hooks/recommended',
//   ],
//   ignorePatterns: ['dist', '.eslintrc.cjs'],
//   parser: '@typescript-eslint/parser',
//   plugins: ['react-refresh'],
//   rules: {
//     'react-refresh/only-export-components': [
//       'warn',
//       { allowConstantExport: true },
//     ],
//   },
// }

module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:mdx/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: ['react-refresh', 'prettier', 'jest', 'import', '@typescript-eslint'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: ['variable', 'objectLiteralProperty', 'objectLiteralMethod'],
        types: ['function'],
        format: ['StrictPascalCase', 'strictCamelCase'],
      },
      {
        selector: ['function'],
        format: ['UPPER_CASE', 'PascalCase', 'camelCase'],
        leadingUnderscore: 'allow',
      },
    ],
    'import/no-unresolved': ['error', { commonjs: true, amd: true }],
    'import/named': 'error',
    'import/namespace': 'error',
    'import/default': 'error',
    'import/export': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'react-refresh/only-export-components': 'warn',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/prefer-as-const': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/member-delimiter-style': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'import/namespace': 'off',
    'import/no-unresolved': 'off',
    'import/order': [
      'error',
      {
        'alphabetize': {
          caseInsensitive: true,
          order: 'asc',
        },
        'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        'pathGroups': [
          {
            group: 'external',
            pattern: 'react',
            position: 'before',
          },
        ],
        'pathGroupsExcludedImportTypes': ['react'],
      },
    ],
    'prettier/prettier': ['error'],
  },
  overrides: [
    {
      files: ['*.json'],
      rules: {
        'mdx/no-unused-expressions': 'off',
      },
    },
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', 'ts', 'tsx', 'mdx'],
      },
    },
  },
};
