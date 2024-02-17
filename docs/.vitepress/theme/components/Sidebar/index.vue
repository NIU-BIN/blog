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
            decodeURIComponent(route.path) === `/${item.text}.html`,
        }"
        @click="linkTo(item)"
      >
        <span class="sequence">{{ item.sequence }}</span>
        <div>
          <div class="article_name">
            {{ item.text }}
          </div>
          <div class="article_date">
            {{ item.date }}
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { useData, useRoute, useRouter } from "vitepress";
import { computed, ref, watch } from "vue";

interface SiderbarItem {
  text: string;
  link: string;
  sequence: number;
  date: string;
}

const route = useRoute();
const router = useRouter();
const { theme, page } = useData();

const sideList = ref<SiderbarItem[]>([]);

const siderbarList = theme.value.sidebar;
const articleList = theme.value.article;

// console.log("siderbarList: ", siderbarList, articleList);

const getCurrentPageSiderList = () => {
  const currentCategory = page.value.frontmatter.category;
  const currentPageSiderList = siderbarList.find(
    (item) => item.text === currentCategory
  );
  const currentSiderList = currentPageSiderList?.items.map((item, index) => {
    return {
      ...item,
      sequence: index + 1,
      date: articleList.find((v) => v.text === item.title)?.date,
    };
  });
  currentSiderList?.sort((a, b) => +new Date(b.date) - +new Date(a.date));

  console.log(currentSiderList);
  sideList.value = currentSiderList;
};

const linkTo = (article) => {
  router.go(article.text);
};

watch(
  () => route.path,
  (newValue) => {
    console.log("route.path", newValue);
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
