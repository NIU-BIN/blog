import { DefaultTheme, defineConfig } from "vitepress";
import { fileURLToPath, URL } from "node:url";
import { themeConfig } from "./theme-config";
// https://vitepress.dev/reference/site-config
export default defineConfig({
  extends: {
    themeConfig,
  },
  vite: {
    resolve: {
      alias: [
        {
          find: /^.*\/VPHero\.vue$/,
          replacement: fileURLToPath(
            new URL("./theme/components/Reset/index.vue", import.meta.url)
          ),
        },
        {
          find: /^.*\/VPFeature\.vue$/,
          replacement: fileURLToPath(
            new URL("./theme/components/Reset/index.vue", import.meta.url)
          ),
        },
        {
          find: /^.*\/VPSidebarItem\.vue$/,
          replacement: fileURLToPath(
            new URL("./theme/components/Reset/index.vue", import.meta.url)
          ),
        },
      ],
    },
  },
  title: "友人A",
  themeConfig: {
    logo: "/logo.jpg",
    outline: [2, 3],
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "主页", link: "/" },
      { text: "归档", link: "/archive" },
      {
        text: "笔记",
        items: [
          {
            text: "网络",
            link: "/note/network/SSE",
          },
          {
            text: "项目",
            link: "/note/project/Monorepo架构",
          },
        ],
      },
      {
        text: "大前端",
        items: [
          {
            text: "CSS",
            link: "/front-end/CSS/grid布局",
          },
          {
            text: "React",
            link: "/front-end/React/基础hook",
          },
          {
            text: "Three.js",
            link: "/front-end/Three.js/Three.js入门",
          },
        ],
      },
      { text: "关于", link: "/about" },
    ],
    sidebar: [
      {
        text: "CSS",
      },
      {
        text: "React",
      },
      {
        text: "Three.js",
      },
      {
        text: "network",
      },
      {
        text: "project",
      },
    ],
    socialLinks: [{ icon: "github", link: "https://github.com/NIU-BIN" }],
    // search: {
    //   provider: "local",
    // },
  },
});
