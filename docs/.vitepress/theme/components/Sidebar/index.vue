<template>
  <div class="blog_siderbar">
    <div class="sider_title" v-show="sideList && sideList.length">
      <span style="font-size: 18px">&#127809;</span> &nbsp; 相关文章
    </div>
    <ul class="sider_list">
      <li
        v-for="item in sideList"
        :key="item.link"
        class="sider_list_item"
        :class="{
          article_active:
            decodeURIComponent(route.path) === `${item.path}.html`,
        }"
        @click="linkTo(item)"
      >
        <span class="sequence">{{ item.sequence }}</span>
        <div>
          <div class="article_name">
            {{ item.title }}
          </div>
          <div class="article_date">
            {{ item.day }}
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { useData, useRoute, useRouter } from "vitepress";
import { ref, watch } from "vue";
import { ArticleItem } from "../../types";

type SiderbarItem = ArticleItem & { sequence: number };

const route = useRoute();
const router = useRouter();
const sideList = ref<SiderbarItem[]>([]);

const { theme, page } = useData();

const articleList = theme.value.article;

const getCurrentPageSiderList = () => {
  const currentCategory = page.value.frontmatter.category;
  const currentPageSiderList = articleList
    .filter((item: ArticleItem) => item.category === currentCategory)
    .map((item, index) => {
      return {
        ...item,
        sequence: index + 1,
      };
    });
  sideList.value = currentPageSiderList;
};

const linkTo = (article) => {
  router.go(article.path);
};

watch(
  () => route.path,
  (newValue) => {
    getCurrentPageSiderList();
  },
  {
    immediate: true,
  }
);
</script>
<style lang="less" scoped>
.blog_siderbar {
  margin-top: 60px;
  font-size: 14px;
}
// .sider_title {
//   font-size: 14px;
// }
.sider_list {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  .sider_list_item {
    display: flex;
    gap: 8px;
    .sequence {
      width: 26px;
      font-weight: bold;
      color: #838383;
      font-style: italic;
      text-align: left;
    }
    .article_name {
      font-size: 15px;
      cursor: pointer;
    }
    .article_name:hover {
      text-decoration: underline;
      color: rgb(77, 137, 248);
    }
    .article_date {
      font-size: 13px;
    }
  }
  .article_active .article_name {
    color: rgb(77, 137, 248);
  }
}
</style>
