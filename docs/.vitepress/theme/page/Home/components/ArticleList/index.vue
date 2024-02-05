<template>
  <div class="article_list_box">
    <ul class="article_list">
      <li class="article_item" v-for="article in list" :key="article.path">
        <div class="article_info">
          <div class="article_title">
            {{ article.title }}
          </div>
          <p class="article_desc">{{ article.description }}</p>
          <div>
            <span>{{ article.date }}</span>
            <span>{{ article.tag?.[0] }}</span>
          </div>
        </div>
        <div class="cover_image">
          <img
            src="https://cdn.pixabay.com/photo/2014/04/14/20/11/pink-324175_640.jpg"
            alt=""
          />
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import type { ArticleItem } from "../../../../types";

interface IProps {
  list: ArticleItem[];
}

defineProps<IProps>();
</script>
<style lang="less" scoped>
.article_list_box {
  width: 50vw;
}
.article_list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  .article_item {
    display: flex;
    width: 100%;
    height: 240px;
    border-radius: 10px;
    box-shadow: 0 0 16px var(--shadow);
    overflow: hidden;

    &:hover {
      img {
        transform: scale(1.1);
      }
    }

    &:nth-child(2n) {
      flex-direction: row-reverse;
      .cover_image {
        clip-path: polygon(0 0, 92% 0, 100% 100%, 0 100%);
      }
      .article_info {
        justify-content: flex-start;
      }
      .more {
        left: auto;
        right: 0;
        border-radius: 8px 0 0 0;
      }
    }

    .article_info {
      width: 30vw;
      padding: 20px;
      box-sizing: border-box;
    }
    .article_title {
      font-size: 1.25rem;
      font-weight: bold;
    }

    .article_desc {
      font-size: 0.875rem;
    }

    .cover_image {
      width: 20vw;
      height: 100%;
      clip-path: polygon(0 0, 100% 0, 100% 100%, 8% 100%);
    }
    .cover_image > img {
      width: 100%;
      height: 100%;
      transition: all 0.4s;
    }
  }
}
</style>
