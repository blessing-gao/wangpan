module.exports = {
  //运行环境
  env: {
    browser: true, // 浏览器端
    es2021: true, // es2021
  },
  //规则继承
  extends: [
    // 开启 ESLint 推荐规则
    "eslint:recommended",
    // vue3 语法规则
    "plugin:vue/vue3-essential",
  ],
  //要为特定类型的文件指定处理器
  overrides: [],
  //指定解析器: 不再需要使用 TypeScript 解析器
  parser: "babel-eslint", // 使用 Babel 解析器
  //指定解析器选项
  parserOptions: {
    ecmaVersion: "latest", // 校验 ECMAScript 最新版本
    sourceType: "module", // 设置为 "module" 代码在 ECMAScript 模块中
  },
  //ESLint插件
  plugins: ["vue"], // 只保留 vue 插件
  //eslint规则
  rules: {},
};
