<template>
  <div class="article_list_box">
    <ul class="article_list">
      <li class="article_item" v-for="article in articleList" :key="article.id">
        <div class="article_title">
          {{ article.title }}
        </div>
        <p class="article_desc">{{ article.desc }}</p>
        <div>
          <span>{{ article.updateTime }}</span>
          <span>{{ article.category }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
// 文章
export type ArticleItem = {
  id: string;
  title: string;
  desc: string;
  cover: string;
  category: string;
  updateTime: string;
};

const articleList = ref<ArticleItem[]>([
  {
    id: "1",
    title: "",
    desc: "",
    cover: "",
    category: "",
    updateTime: "",
  },
]);
</script>
<style lang="less" scoped>
.article_list_box {
  width: 100%;
}
.article_list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  .article_item {
    padding: 20px;
    width: 100%;
    height: 270px;
    border-radius: 6px;
    box-shadow: 0 0 6px #000;
  }
}
</style>
