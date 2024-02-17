<template>
  <Teleport to="body">
    <div class="archive_page">
      <div class="cover no_flex">
        <div class="mask">
          <div class="archive_text">归档</div>
        </div>
      </div>
      <ContributeChart class="no_flex" />
      <div class="archive_list no_flex" v-if="archiveList.length">
        <ElTimeline>
          <ElTimelineItem
            :timestamp="`${month_item.time}（${month_item.articleCount}篇文章）`"
            placement="top"
            v-for="month_item in archiveList"
            :key="month_item.month"
          >
            <template #dot>
              <img :src="logo" class="avatar" alt="" />
            </template>
            <ul class="month_list">
              <li
                v-for="article in month_item.articleList"
                class="article_item"
              >
                <div>
                  <span>&#128214;</span>
                  <span style="margin-left: 10px">{{ article.title }}</span>
                </div>
                <span>{{ article.day }}</span>
              </li>
            </ul>
          </ElTimelineItem>
        </ElTimeline>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElTimeline, ElTimelineItem } from "element-plus";
import ContributeChart from "../../components/ContributeChart/index.vue";
import { useConfig } from "../../utils/client";
import dayjs from "dayjs";
import type { ArticleItem } from "../../types";

interface archiveItem {
  month: string;
  time: string;
  articleList: ArticleItem[];
  articleCount: number;
}

const { logo, article } = useConfig();

const archiveList = ref<archiveItem[]>([]);
const contributeObject = ref({});

/* 
  只获取最近一年的月份，进行匹配，
*/
for (let i = 0; i < 12; i++) {
  const currentMonth = dayjs().subtract(i, "month").format("YYYY-MM");
  // console.log("currentMonth: ", currentMonth);
  const currentMonthList = article.filter(
    (v: ArticleItem) => v.month === currentMonth
  );
  // console.log("currentMonthList: ", currentMonthList);
  if (currentMonthList.length) {
    archiveList.value.push({
      month: currentMonth,
      articleList: currentMonthList,
      time: dayjs(currentMonth).format("YYYY年MM月"),
      articleCount: currentMonthList.length,
    });
  }
}

// console.log("archiveList: ", archiveList.value);

article.forEach((item: ArticleItem) => {
  const date = item.date.substring(0, 10);
  if (contributeObject.value[date]) {
    contributeObject.value[date]++;
  } else {
    contributeObject.value[date] = 1;
  }
});
console.log("contributeObject: ", contributeObject.value);

const contributeList = Object.keys(contributeObject.value);
</script>

<style scoped lang="less">
.archive_page {
  padding-bottom: 10vh;
  width: 100%;
  height: calc(100vh - var(--vp-nav-height));
  position: fixed;
  // top: 0;
  top: var(--vp-nav-height);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  .cover {
    width: 100%;
    height: 40vh;
    // background-image: url("../../../../public/archive_cover.png");
    background-image: url("../../../../public/2.jpg");
    // background-position: left 80%;
    background-size: 100% auto;
    .mask {
      overflow: hidden;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.35);
    }
    .archive_text {
      margin: 12vh 0 0 16vw;
      // text-align: center;
      font-size: 2rem;
      font-weight: bold;
      color: #fff;
      -webkit-box-reflect: below 3px
        linear-gradient(transparent, rgba(0, 0, 0, 0.4));
    }
  }
}

.no_flex {
  flex: none;
}
.archive_list {
  width: 1000px;
  box-shadow: 0 0 10px rgb(0 0 0 / 0.1);
  padding: 20px 30px;
  border-radius: 10px;
  .avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  .month_list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 14px;
    margin-top: 10px;
    .article_item {
      display: flex;
      padding: 2px 8px;
      align-items: center;
      justify-content: space-between;
      border-radius: 4px;
      cursor: pointer;
    }
    .article_item:hover {
      background-color: rgb(226, 232, 240);
    }
  }
}
:deep(.el-timeline-item__tail) {
  left: 10px;
}

:deep(.el-timeline-item__wrapper) {
  margin-left: 6px;
  .el-timeline-item__timestamp {
    margin-left: 6px;
    display: inline-block;
    padding-top: 10px;
    font-size: 14px;
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    background-image: linear-gradient(to right, #24c6dc, #514a9d);
  }
}
</style>