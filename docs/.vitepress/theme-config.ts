import { getThemeConfig } from "./theme/utils/node";

export const themeConfig = getThemeConfig({
  // 作者
  author: "友人A",
  // 评论
  comment: {
    repo: "Niu-bin/blog",
    repoId: "R_kgDOLMBB5Q",
    category: "Announcements",
    categoryId: "DIC_kwDOLMBB5c4Cc-ci",
    inputPosition: "bottom",
  },
  // 友链
  friend: [
    {
      avatar:
        "https://img.cdn.sugarat.top/mdImg/MTY3NDk5NTE2NzAzMA==674995167030",
      name: "粥里有勺糖",
      desc: "你的指尖,拥有改变世界的力量",
      link: "https://sugarat.top/",
    },
    {
      avatar: "https://vitepress.dev/vitepress-logo-large.webp",
      name: "Vitepress",
      desc: "Vite & Vue Powered Static Site Generator",
      link: "https://vitepress.dev/zh/",
    },
  ],
});
