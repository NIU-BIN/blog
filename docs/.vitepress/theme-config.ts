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
      avatar: "https://cdn.jsdelivr.net/gh/hehuan2023/pic/typora/rabbit.png",
      name: "dleei",
      desc: "欢迎访问代磊的个人博客鸭~",
      link: "https://dleei.github.io/",
    },
    {
      avatar: "https://blog.lubowen.xyz/_nuxt/head.6a38cc3c.jpg",
      name: "小鹿",
      desc: "愿你一生有山可靠，有树可栖。与心爱之人，春赏花，夏纳凉。秋登山，冬扫雪。",
      link: "https://blog.lubowen.xyz/",
    },
  ],
});
