<template>
  <div class="concentration">
    <div class="section_top">✨ &nbsp; 精选文章</div>
    <ul class="concentration_list">
      <li
        class="concentration_list_item"
        v-for="item in list"
        :key="item.sequence"
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
const list = [
  {
    sequence: "1",
    text: "【免费】Node.js 入门教程",
    date: "2023-12-17",
  },
  {
    sequence: "2",
    text: "浏览器专题系列文章",
    date: "2023-12-23",
  },
  {
    sequence: "3",
    text: "2023年度总结",
    date: "2023-12-17",
  },
  {
    sequence: "4",
    text: "如何编写一份好的互联网校招简历",
    date: "2023-12-17",
  },
  {
    sequence: "5",
    text: "浏览器专题系列文章",
    date: "2023-12-23",
  },
  {
    sequence: "6",
    text: "2023年度总结",
    date: "2023-12-17",
  },
  {
    sequence: "7",
    text: "如何编写一份好的互联网校招简历",
    date: "2023-12-17",
  },
];
</script>
<style lang="less" scoped>
.concentration {
  margin-top: 20px;
  width: 100%;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 16px var(--shadow);
  box-sizing: border-box;
  .section_top {
    font-weight: bold;
    margin-bottom: 20px;
  }
}
.concentration_list {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  .concentration_list_item {
    display: flex;
    gap: 8px;
    .sequence {
      display: block;
      padding: 0 6px;
      height: 20px;
      line-height: 20px;
      border-radius: 8px 0;
      font-weight: bold;
      font-style: italic;
      text-align: left;
      color: #999;
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
    &:nth-child(1) > .sequence {
      background-color: #f87171;
      color: #fff;
      font-size: 12px;
    }
    &:nth-child(2) > .sequence {
      background-color: #60a5fa;
      color: #fff;
      font-size: 12px;
    }
    &:nth-child(3) > .sequence {
      background-color: #34d399;
      color: #fff;
      font-size: 12px;
    }
  }
  .article_active .article_name {
    color: rgb(77, 137, 248);
  }
}
</style>
