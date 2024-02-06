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
    logo: "logo.jpg",
    outline: [2, 3],
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "主页", link: "/" },
      { text: "归档", link: "/archive" },
      { text: "Examples", link: "/markdown-examples" },
      { text: "React", link: "/基础hook" },
    ],

    sidebar: [
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
      {
        text: "React",
        items: [
          {
            text: "基础hook",
            link: "/基础hook",
          },
          {
            text: "性能优化相关hook",
            link: "/性能优化相关hook",
          },
          {
            text: "reducer",
            link: "/reducer",
          },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
