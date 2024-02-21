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
      { text: "技术笔记", link: "/note" },
      {
        text: "大前端",
        items: [
          // {
          //   text: "JavaScript",
          //   link: "/front-end/JavaScript",
          // },
          // {
          //   text: "CSS",
          //   link: "/front-end/CSS",
          // },
          // {
          //   text: "Vue",
          //   link: "/front-end/Vue",
          // },
          {
            text: "React",
            link: "/front-end/React/基础hook",
          },
          // {
          //   text: "Node",
          //   link: "/front-end/Node",
          // },
        ],
      },
      { text: "关于", link: "/about" },
    ],
    sidebar: [
      {
        text: "React",
        items: [
          {
            text: "基础hook",
            link: "/front-end/React/基础hook",
          },
          {
            text: "性能优化相关hook",
            link: "/front-end/React/性能优化相关hook",
          },
          {
            text: "reducer",
            link: "/front-end/React/reducer",
          },
        ],
      },
    ],
    socialLinks: [{ icon: "github", link: "https://github.com/NIU-BIN" }],
    // search: {
    //   provider: "local",
    // },
  },
});
