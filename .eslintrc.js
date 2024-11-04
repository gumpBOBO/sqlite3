module.exports = {
  // "root": true，它就会停止在父级目录中寻找
  root: true,
  // 预定义的全局变量，这里是浏览器环境
  env: {
    browser: true,
    es2021: true,
    node: true,
    // 如果defineProps报错
    'vue/setup-compiler-macros': true,
  },
  // ESTree 只是一个 AST 的某一种规范，ESTree 本质上还是 AST
  // ESLint 默认的 parser ，只转换 js，默认支持 ES5 的语法： 默认采用vue-eslint
  parser: 'vue-eslint-parser',
  // 子配置：优先使用typescript-eslint，支持es2021
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2021,
  },
  // 扩展校验风格 合并 eslint 中的 plugins，rules 的
  /* 
		plugin:vue/base- 只是使解析工作的基本规则。还没有 lint 任何东西。
		plugin:vue/essential- 以上,加上仅用于防止 Vue 中的错误或意外行为的规则。
		plugin:vue/strongly-recommended- 以上,加上通常被认为是最佳实践的规则。
		plugin:vue/recommended- 以上,加上一些经常被建议的样式规则。
		大概语义：使用vue最基本规则，vue3错误或意外行为的规则，eslint最佳实践的规则，
		引入@vue/eslint-config-prettier 可以简写为@vue/prettier
		vue/base 全称应该是 eslint-plugin-vue/base
	*/
  extends: ['plugin:vue/base', 'plugin:vue/vue3-essential', 'eslint:recommended', '@vue/prettier', '@vue/typescript'],
  // 它的默认 parser 会将代码转换为 AST，AST 被 plugin&rules 用来校验和生成错误信息
  plugins: [],
  rules: {
    'no-undef': 0,
    // 检测未使用的变量，函数和函数的参数
    'no-unused-vars': 'off',
    // 检测未使用的变量，函数和函数的参数 for typescript
    '@typescript-eslint/no-unused-vars': 'off',
    // 语句强制分号结尾
    semi: 0,
    // 如果报错回车结尾错误
    endOfLine: 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 在rules中添加自定义规则 关闭组件命名规则
    'vue/multi-word-component-names': 'off',
  },
  // 忽略文件
  ignorePatterns: ['*.css', '*.less', '*.scss', '*.jpg', '*.png', '*.gif', '*.svg', '*vue.d.ts'],
  // 暂时保留
  globals: {
    uni: true,
    wx: true,
  },
}

// rules: {
// 	// 检测未使用的变量，函数和函数的参数
// 	'no-unused-vars': 'off',
// 	// 检测未使用的变量，函数和函数的参数 for typescript
// 	'@typescript-eslint/no-unused-vars': 'off',
// 	//语句强制分号结尾
// 	semi: 0,
// 	// // 如果报错回车结尾错误
// 	endOfLine: 'off',
// 	'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
// 	'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
// 	// //在rules中添加自定义规则
// 	// //关闭组件命名规则
// 	'vue/multi-word-component-names': 'off',
// 	// parser: 'vue-eslint-parser',

// 	// 'import/no-unresolved': 'off',
// 	// 'prettier/prettier': [
// 	//   'error',
// 	//   {
// 	//     //  单引号
// 	//     singleQuote: true,
// 	//     // 分号结束
// 	//     semi: false,
// 	//     trailingComma: 'none',
// 	//     // 箭头函数只有一个参数省略括号
// 	//     arrowParens: 'avoid',
// 	//     // 超过最大值换行
// 	//     printWidth: 100,
// 	//   },
// 	// ],
// },

// parser: 'babel-eslint',
// parser: 'vue-eslint-parser',
// parserOptions: {
//   parser: '@typescript-eslint/parser',
// },
// plugins: ['html'],
// parser: '@typescript-eslint/parser',
// parserOptions: {
//   sourceType: 'module',
//   ecmaVersion: 2021,
//   parser: '@typescript-eslint/parser',
// },
// plugins: ['vue', '@typescript-eslint'],

// extends: [
//   // vue3推荐的语法检查规范  plugin:vue/vue3-essential ，只检查基本的、最重要的语法。 plugin:vue/vue3-strongly-recommended, 严格检查 Vue 组件代码，对语法和规范都进行检查
//   'plugin:vue/vue3-recommended',
//   // eslint推荐的语法检查规范
//   'eslint:recommended',
//   // ts推荐的语法检查规范
//   '@vue/typescript/recommended',
//   // vue for prettier
//   '@vue/prettier',
//   // 使得@typescript-eslint中的样式规范失效，遵循prettier中的样式规范，需要放在最后一项。
//   '@vue/prettier/@typescript-eslint',
//   // eslint-config-prettier 的缩写
//   'prettier',
// ],
// parser: 'vue-eslint-parser',
// // extends: ['plugin:vue/base', 'plugin:vue/vue3-essential', 'eslint:recommended', '@vue/prettier', '@vue/typescript'],
// parserOptions: {
//   ecmaVersion: 2021, // 支援 ECMAScript2019
//   // parser: '@typescript-eslint/parser',
//   sourceType: 'module', // 使用 ECMAScript ****module
//   ecmaFeatures: {
//     jsx: true, // 支援 JSX
//   },
//   // ecmaVersion: 2021,
//   // parser: 'vue-eslint-parser',
//   // parser: 'babel-eslint',
//   // ecmaVersion: 7,
//   // sourceType: 'module',
// },

// module.exports = {
//   root: true,
//   env: {
//     'vue/setup-compiler-macros': true,
//     browser: true,
//     es2021: true,
//     node: true,
//   },
//   extends: [
//     'plugin:vue/vue3-recommended',
//     'eslint:recommended',
//     '@vue/typescript/recommended',
//     '@vue/prettier',
//     '@vue/prettier/@typescript-eslint',
//     // eslint-config-prettier 的缩写
//     'prettier',
//   ],
//   parserOptions: {
//     ecmaVersion: 2021,
//   },
//   plugins: [],
//   rules: {
//     'no-unused-vars': 'off',
//     '@typescript-eslint/no-unused-vars': 'off',
//     semi: 0,
//   },
//   globals: {
//     uni: true,
//     wx: true,
//   },
// }
