<template>
  <div class="home">
    <div class="swiper" :style="{ backgroundImage: `url(${bgImage})` }">
      <div class="swiper_mask"></div>
      <div class="swiper_content">
        <h1 class="title">
          {{ title }}
        </h1>
        <h3 class="description">
          {{ currentString }}
        </h3>
      </div>
    </div>
    <Waves />
    <div class="home_container">
      <ArticleList :list="articleList" :author="theme.author" />
      <div class="container_right">
        <AuthorCard :autherInfo="autherInfo" :logo="logo" />
        <Concentration :list="stickyArticleList" />
        <FriendlyLink :friends="friendLink" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Waves from "../../components/Waves/index.vue";
import ArticleList from "./components/ArticleList/index.vue";
import AuthorCard from "./components/AuthorCard/index.vue";
import Concentration from "./components/Concentration/index.vue";
import FriendlyLink from "./components/FriendlyLink/index.vue";
import { useData } from "vitepress";
import { useTypewriter } from "../../utils/client";
import { ref } from "vue";
import type { ArticleItem, AutherInfo, FriendItem } from "../../types";
import dayjs from "dayjs";

const { frontmatter, theme } = useData();
// console.log("useData(): ", useData());

const title = frontmatter.value.blog?.name;
const { currentString } = useTypewriter(
  frontmatter.value.blog?.description,
  120
);
const logo = frontmatter.value.blog?.logo;
const bgImage = frontmatter.value.blog?.bg;

const articleList = ref<ArticleItem[]>(theme.value.article);
const stickyArticleList = ref<ArticleItem[]>([]);

// console.log("articleList: ", articleList.value);

// 一个月前的时间戳
const lastMonthTime = dayjs().subtract(30, "day").unix();
// 一周前的时间戳
const lastWeekTime = dayjs().subtract(7, "day").unix();

let withinMonthNumber = 0;
let withinWeekNumber = 0;

articleList.value.forEach((item) => {
  const currentItemTime = dayjs(item.date).unix();
  if (currentItemTime > lastMonthTime) withinMonthNumber++;
  if (currentItemTime > lastWeekTime) withinWeekNumber++;
});

// 获取置顶文章
const getStickyArticleList = () => {
  const list = articleList.value
    .filter((item) => item.sticky)
    .sort((a, b) => a.sticky! - b.sticky!);
  stickyArticleList.value = list;
};

getStickyArticleList();

// 作者信息
const autherInfo = ref<AutherInfo>({
  name: "友人A",
  tags: [
    {
      id: "article",
      name: "博客文章",
      value: articleList.value.length,
    },
    {
      id: "tag",
      name: "最近一月",
      value: withinMonthNumber,
    },
    {
      id: "message",
      name: "最近一周",
      value: withinWeekNumber,
    },
  ],
});

// 友链
const friendLink = ref<FriendItem[]>(theme.value.friend);
</script>
<style lang="less" scoped>
@keyframes blink {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.swiper {
  position: relative;
  // background-image: url("../../styles/swiper_bg.jpg");
  height: 100vh;
  background-size: 100% 100%;
  .swiper_mask {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
  }
  .swiper_content {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    .title {
      display: inline-block;
      line-height: normal;
      font-size: 36px;
      font-weight: bold;
      color: #fff;
      // -webkit-background-clip: text;
      // -webkit-text-fill-color: transparent;
      // // margin-bottom: 1.5rem !important;
      // background-image: linear-gradient(
      //   to right,
      //   var(--tw-gradient-stops)
      // ) !important;
      // --tw-gradient-from: #5d67e8 !important;
      // --tw-gradient-to: rgb(93 103 232 / 0) !important;
      // --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important;
      // --tw-gradient-to: #ef4444 !important;
      // text-align: left !important;
    }
    .description {
      margin-top: 20px;
      font-size: 20px;
      color: #fff;
    }
    .description::after {
      content: "_";
      animation: blink 1.6s infinite;
    }
  }
}

.home_container {
  margin-top: 60px;
  display: flex;
  gap: 36px;
  justify-content: center;
  .container_right {
    position: sticky;
    top: var(--vp-nav-height);
    width: 350px;
  }
}
</style>
