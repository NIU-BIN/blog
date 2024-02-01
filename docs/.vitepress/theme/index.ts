// .vitepress/theme/index.js

// 可以直接在主题入口导入 Vue 文件
// VitePress 已预先配置 @vitejs/plugin-vue
import Layout from "./layout/index.vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import "./styles/index.less";

const MineTheme: Theme = {
  // ...DefaultTheme,
  extends: DefaultTheme,
  Layout,
  enhanceApp(ctx) {
    // { app, router, siteData }
    // ...
    // DefaultTheme.enhanceApp(ctx);
    // ctx.app.component()  // 全局注册组件
  },
};

export default MineTheme;
