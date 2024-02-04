import { DefaultTheme, defineConfig } from "vitepress";
import { fileURLToPath, URL } from "node:url";
import { getThemeConfig } from "./theme/utils/node";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  extends: {
    themeConfig: getThemeConfig(),
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
      { text: "Examples", link: "/markdown-examples" },
    ],

    sidebar: [
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
