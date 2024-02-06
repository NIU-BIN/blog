// .vitepress/theme/index.js

// 可以直接在主题入口导入 Vue 文件
// VitePress 已预先配置 @vitejs/plugin-vue
import Layout from "./layout/index.vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import "./styles/index.less";
import { withConfigProvider } from "./utils/client";
import Archive from "./page/Archive/index.vue";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
// import { ElTimeline, ElTimelineItem } from "element-plus";

const MineTheme: Theme = {
  // ...DefaultTheme,
  extends: DefaultTheme,
  Layout: withConfigProvider(Layout),
  enhanceApp(ctx) {
    // { app, router, siteData }
    // ...
    // DefaultTheme.enhanceApp(ctx);
    ctx.app.component("Archive", Archive); // 全局注册组件
    // ctx.app.use("ElTimeline", ElTimeline); // 全局注册组件
    // ctx.app.use("ElTimelineItem", ElTimelineItem); // 全局注册组件
  },
};

export default MineTheme;
