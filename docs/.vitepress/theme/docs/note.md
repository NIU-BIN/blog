## 组件功能

个别组件可使用 vitepress 的组件进行引入使用

## 使用数据

[文档参考](https://vitepress.dev/zh/reference/runtime-api#usedata)

使用`useData`

## 评论功能

集成 giscus
[giscus](https://giscus.app/zh-CN)

使用集成组件[@giscus/vue](https://github.com/giscus/giscus-component)

<!-- https://giscus.app/zh-CN -->

[配置详情](https://vuepress-theme-hope.github.io/v2/comment/zh/config/giscus.html#lazyloading)

## 自定义页面

将页面的 vue 文件注册为组件，然后通过 md 渲染，就达到了自定义页面的功能

## 使用 node

Vite 的 CJS Node API 构建已经被废弃，使用.mjs/.mts 扩展名可以

https://cn.vitejs.dev/guide/troubleshooting

## 如何操作文件

使用 node 将所需文件相关信息写入配置

1. 如何使用 node
2. 如何写入配置

## 文章封面

使用正则获取 “--- ---” 之间的 cover

## 全局搜索

1. 使用 pagefind

安装 vitepress-plugin-pagefind

```
pnpm add vitepress-plugin-pagefind
```

```js
// 在 `.vitepress/config.ts` 引入
import { defineConfig } from "vitepress";
import {
  chineseSearchOptimize,
  pagefindPlugin,
} from "vitepress-plugin-pagefind";

const blogTheme = getThemeConfig({
  // 关闭主题内置
  search: false,
});

export default defineConfig({
  extends: blogTheme,
  lang: "zh-cn",
  vite: {
    // 使用插件加载
    plugins: [
      pagefindPlugin({
        customSearchQuery: chineseSearchOptimize,
        btnPlaceholder: "搜索",
        placeholder: "搜索文档",
        emptyText: "空空如也",
        heading: "共: {{searchResult}} 条结果",
      }),
    ],
  },
});
```

2. 使用 algolia

https://github.com/mqyqingfeng/Blog/issues/267

## 图片预览功能
