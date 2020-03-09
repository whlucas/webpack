// 首先先来一个这个,创建一个这个文件
// npx eslint --init
// 安装一个ESLint插件

module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:react/recommended',
    // 'airbnb', // 这个就是一个规则,打开之后就会按照这个规则来检查代码,自己的规则写到rule里面
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    document: false  // 全局变量要在这里声明,false表示不能被覆盖
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    // 自己的规则写到rule里面
    // 去官网loaders-eslint-loader去找规则
  },
  // 注意要是用react还的加一个这个
  "settings": {
    "react": {
      "version": "detect"
    }
  }
};
