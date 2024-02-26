module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:import/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:@typescript-eslint/recommended',
    // This disables the formatting rules in ESLint that Prettier is going to be responsible for handling.
    // Make sure it's always the last config, so it gets the chance to override other configs.
    'plugin:prettier/recommended',
    'eslint-config-prettier'
  ],
  globals: {
    google: 'readonly'
  },
  settings: {
    react: {
      // Tells eslint-plugin-react to automatically detect the version of React to use.
      version: 'detect'
    },
    // Tells eslint how to resolve imports
    'import/resolver': {
      node: {
        paths: ['src/'],
        extensions: [
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
          '.cjs',
          '.css',
          '.scss',
          '.json',
          '.d.ts'
        ]
      }
    }
  },
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: './tsconfig.json'
  },
  plugins: ['react', '@typescript-eslint', 'prettier'],
  rules: {
    'react/react-in-jsx-scope': 0,
    'import/no-extraneous-dependencies': 0,
    'react/jsx-no-target-blank': 'warn',
    'react/require-default-props': 'off', // Cho phép không cần truyền default cho props
    'react/button-has-type': 0, // Cho phép thẻ button có thể không cần thuộc tính type
    'import/prefer-default-export': 0, // Cho phép file có thể không cần export default
    '@typescript-eslint/no-explicit-any': 0, // Cho phép sử dụng "any" type
    'import/no-unresolved': 0,
    'import/extensions': 0, // Hỗ trợ import dễ nhìn hơn là ../../
    'react/jsx-no-useless-fragment': 0, // Cho phép sử dụng thẻ Fragment
    'jsx-a11y/label-has-associated-control': 0, // Tắt bắt lỗi: Thẻ label và input cùng trỏ đến ID nhưng vẫn báo lỗi
    '@typescript-eslint/no-var-requires': 0, // Cho phép import require
    'react/jsx-props-no-spreading': 0, // Cho phép sử dụng toán tử spread
    'react/no-unescaped-entities': 0, // Cho phép sử dụng HTML escape (', ", >, }) bên trong JSX Element,
    'no-param-reassign': 0,
    'import/export': 0, // Cho phép import/export thông qua file index
    'jsx-a11y/click-events-have-key-events': 0, // Tắt hỗ trợ cho người khuyết tật
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function'
      }
    ],
    'prettier/prettier': [
      'warn',
      {
        arrowParens: 'always',
        semi: true,
        trailingComma: 'none',
        tabWidth: 2,
        endOfLine: 'auto',
        useTabs: false,
        singleQuote: true,
        printWidth: 80,
        jsxSingleQuote: true,
        bracketSpacing: true
      }
    ]
  }
};
