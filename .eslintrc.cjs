// 修补 @unocss/eslint-plugin，将 rules 提升到模块顶层（ESLint v8 兼容）
require('./.eslint-plugin-unocss-local.cjs')

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-essential',
    // eslint-plugin-import 插件， @see https://www.npmjs.com/package/eslint-plugin-import
    'plugin:import/recommended',
    // eslint-config-airbnb-base 插件 已经改用 eslint-config-standard 插件
    'standard',
    // 1. 接入 prettier 的规则
    'prettier',
    'plugin:prettier/recommended',
    './.eslintrc-auto-import.json',
  ],
  globals: {
    App: true,
    getCurrentPages: true,
    NodeJS: true,
    Page: true,
    uni: true,
    UniApp: true,
    UniHelper: true,
    WechatMiniprogram: true,
    wx: true,
  },
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'vue',
    // 2. 加入 prettier 的 eslint 插件
    'prettier',
    // eslint-import-resolver-typescript 插件，@see https://www.npmjs.com/package/eslint-plugin-import
    'import',
    'perfectionist',
    'prefer-function-declarations',
    'unused-imports',
    '@unocss',
  ],
  rules: {
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        disallowTypeAnnotations: false,
        prefer: 'type-imports',
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off',

    '@typescript-eslint/no-redeclare': 'error',
    '@typescript-eslint/no-unused-vars': 'off',
    '@unocss/order': 'error',
    '@unocss/order-attributify': 'off',
    // UnoCSS class 排序
    // 变量、函数、属性等必须使用小驼峰命名
    camelcase: ['error', { properties: 'always' }],

    'func-style': ['error', 'declaration', { allowArrowFunctions: false }],
    'import/default': 'off',
    // 对后缀的检测，否则 import 一个ts文件也会报错，需要手动添加'.ts', 增加了下面的配置后就不用了
    'import/extensions': [
      'error',
      'ignorePackages',
      { js: 'never', jsx: 'never', ts: 'never', tsx: 'never' },
    ],
    // 'no-unused-vars': ['off'],
    // '@typescript-eslint/no-unused-vars': ['off'],
    // 解决vite.config.ts报错问题
    'import/no-extraneous-dependencies': 'off',
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    // turn on errors for missing imports
    'import/no-unresolved': 'off',
    // 只允许1个默认导出，关闭，否则不能随意export xxx
    'import/prefer-default-export': ['off'],
    'no-console': ['off'],
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    // 避免 `eslint` 对于 `typescript` 函数重载的误报
    'no-redeclare': 'off',
    'no-shadow': 'off',
    'no-undef': 'off',
    'no-underscore-dangle': 'off',
    'no-unused-expressions': 'off',
    'no-unused-vars': 'off',
    'no-use-before-define': 'off',
    // import 语句排序（支持自动修复）
    'perfectionist/sort-imports': [
      'error',
      {
        groups: [
          'side-effect',
          'side-effect-style',
          'type',
          ['builtin', 'external'],
          'internal',
          ['parent', 'sibling', 'index'],
          'style',
        ],
        ignoreCase: true,
        internalPattern: ['^@/'],
        newlinesBetween: 1,
        order: 'asc',
        type: 'natural',
      },
    ],
    // 接口/类型成员排序（支持自动修复）
    'perfectionist/sort-interfaces': [
      'error',
      {
        ignoreCase: true,
        order: 'asc',
        type: 'natural',
      },
    ],
    // 命名导入排序，如 import { A, B, C }（支持自动修复）
    'perfectionist/sort-named-imports': [
      'error',
      {
        ignoreCase: true,
        order: 'asc',
        type: 'natural',
      },
    ],

    // 对象属性排序（支持自动修复）
    'perfectionist/sort-objects': [
      'error',
      {
        ignoreCase: true,
        order: 'asc',
        type: 'natural',
      },
    ],

    'prefer-function-declarations/prefer-function-declarations': 'error',

    // 3. 注意要加上这一句，开启 prettier 自动修复的功能
    'prettier/prettier': 'error',

    // 'unused-imports/no-unused-imports': 'error',
    // 'unused-imports/no-unused-vars': [
    //   'error',
    //   { args: 'after-used', argsIgnorePattern: '^_', vars: 'all', varsIgnorePattern: '^_' },
    // ],

    // 模板属性必须用小驼峰，禁止 kebab-case
    'vue/attribute-hyphenation': ['error', 'never'],

    // 属性排序规则
    'vue/attributes-order': [
      'error',
      {
        alphabetical: true,
        order: [
          'DEFINITION',
          'LIST_RENDERING',
          'CONDITIONALS',
          'RENDER_MODIFIERS',
          'GLOBAL',
          'UNIQUE',
          'TWO_WAY_BINDING',
          'OTHER_DIRECTIVES',
          'OTHER_ATTR',
          'EVENTS',
          'CONTENT',
        ],
      },
    ],

    // 模板中使用组件强制大驼峰
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],

    'vue/component-tags-order': [
      'error',
      {
        order: ['script', 'template', 'style', 'route'],
      },
    ],
    'vue/multi-word-component-names': 'off',
    'vue/no-mutating-props': 'off',

    // prop 定义名称必须用小驼峰
    'vue/prop-name-casing': ['error', 'camelCase'],
  },
  // eslint-import-resolver-typescript 插件，@see https://www.npmjs.com/package/eslint-import-resolver-typescript
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {},
    },
  },
}
