import Layout from "./layout/index.vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import "./styles/index.less";
import { withConfigProvider } from "./utils/client";
import Archive from "./page/Archive/index.vue";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";

const MineTheme: Theme = {
  // ...DefaultTheme,
  extends: DefaultTheme,
  Layout: withConfigProvider(Layout),
  enhanceApp(ctx) {
    // { app, router, siteData }
    // ...
    // DefaultTheme.enhanceApp(ctx);
    ctx.app.component("Archive", Archive); // 全局注册组件
  },
};

export default MineTheme;
