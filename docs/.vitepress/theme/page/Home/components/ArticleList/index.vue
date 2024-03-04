<template>
  <div class="article_list_box">
    <ul class="article_list">
      <li
        class="article_item"
        v-for="article in list.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )"
        :key="article.path"
      >
        <div class="article_info">
          <div class="article_title" @click="linkTo(article)">
            {{ article.title }}
          </div>
          <p class="article_desc">{{ article.description }}</p>
          <div class="article_bottom">
            <span>{{ author }}</span>
            <span>{{ article.date }}</span>
            <!-- <span>{{ article.tag?.[0] || "react" }}</span> -->
          </div>
        </div>
        <div class="cover_image">
          <img :src="article.cover" alt="" />
        </div>
      </li>
    </ul>
    <div class="pagination">
      <el-pagination
        background
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="list.length"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ElPagination } from "element-plus";
import { useRouter } from "vitepress";
import type { ArticleItem } from "../../../../types";
import { ref } from "vue";

interface IProps {
  list: ArticleItem[];
  author: string;
}

const currentPage = ref(1);
const pageSize = ref(5);

defineProps<IProps>();

const router = useRouter();

// 点击查看文章
const linkTo = (article: ArticleItem) => {
  router.go(article.path);
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
};
</script>
<style lang="less" scoped>
.article_list_box {
  width: 960px;
  .pagination {
    margin-top: 40px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.article_list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  .article_item {
    position: relative;
    display: flex;
    width: 100%;
    height: 240px;
    border-radius: 10px;
    box-shadow: 0 0 20px var(--shadow);
    overflow: hidden;

    &:hover {
      img {
        transform: scale(1.1);
      }
      .article_title::after {
        // display: block;
        width: 100%;
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
      .article_bottom {
        // flex-direction: row-reverse;
        justify-content: end;
        right: 20px;
      }
      .more {
        left: auto;
        right: 0;
        border-radius: 8px 0 0 0;
      }
    }

    .article_info {
      width: 600px;
      padding: 20px;
      box-sizing: border-box;
    }
    .article_title {
      display: inline;
      position: relative;
      font-size: 23px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s;
    }
    .article_title:hover {
      color: #6293f0;
    }

    .article_title::after {
      position: absolute;
      left: 0;
      bottom: -6px;
      content: "";
      // width: 100%;
      width: 0;
      height: 1px;
      border: none;
      border-top: 1px dashed #a1a1a1;
      transition: all 0.3s linear;
    }

    .article_desc {
      margin-top: 20px;
      font-size: 14px;
      color: #6b7280;
    }

    .article_bottom {
      position: absolute;
      width: 468px;
      display: flex;
      // justify-content: space-between;
      bottom: 16px;
      font-size: 14px;
      color: #374151;
      span:nth-child(1)::after {
        content: "";
        display: inline-block;
        width: 1px;
        height: 8px;
        margin: 0 10px;
        background-color: #4e5969;
      }
    }

    .cover_image {
      flex: 1;
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

// dark
.dark {
  .article_bottom {
    color: #d1d5db !important;
  }
}
</style>
