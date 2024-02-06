<template>
  <Teleport to="body">
    <div class="archive_page">
      <div class="cover no_flex">
        <div class="mask">
          <div class="archive_text">归档</div>
        </div>
      </div>
      <ContributeChart class="no_flex" />
      <div class="archive_list no_flex">
        <ElTimeline>
          <ElTimelineItem
            :timestamp="`${month.time}（${month.articleCount}篇文章）`"
            placement="top"
            v-for="month in monthList"
            :key="month.id"
          >
            <template #dot>
              <img :src="logo" class="avatar" alt="" />
            </template>
            <ul class="month_list">
              <li v-for="article in month.articleList" class="article_item">
                <div>
                  <span>&#128214;</span>
                  <span>{{ article.articleTitle }}</span>
                </div>
                <span>{{ article.updateTime }}</span>
              </li>
            </ul>
          </ElTimelineItem>
        </ElTimeline>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from "vue";
import { ElTimeline, ElTimelineItem } from "element-plus";
import ContributeChart from "../../components/ContributeChart/index.vue";
import { useConfig } from "../../utils/client";
// import { ArticleItem } from "@/types";

const { logo } = useConfig();

const monthList = ref([
  {
    id: "2023-12",
    time: "2023年12月",
    articleCount: 3,
    articleList: [
      {
        id: "1",
        articleTitle: "nest集成日志管理",
        articleDesc:
          "当集成日志管理时，你需要在 Nest.js 项目中添加日志功能来记录应用的运行状态和事件。日志是开发和维护应用的重要工具，它可以帮助你追踪问题、监控性能，并了解应用的运行情况。在这篇文章中，我们将介绍如何使用 `winston` 日志库在 Nest.js 项目中集成日志管理功能",
        articleCover:
          "http://43.138.109.120:9000/avatar/c8a20e4939c4234419c5ed0f6d5a337f.jpg",
        category: "nest.js",
        updateTime: "2023-09-14",
        articleContent: "",
      },
      {
        id: "2",
        articleTitle: "切图仔最后的倔强：包教不包会设计模式 - 结构型",
        articleDesc:
          "当集成日志管理时，你需要在 Nest.js 项目中添加日志功能来记录应用的运行状态和事件。日志是开发和维护应用的重要工具，它可以帮助你追踪问题、监控性能，并了解应用的运行情况。在这篇文章中，我们将介绍如何使用 `winston` 日志库在 Nest.js 项目中集成日志管理功能",
        articleCover:
          "http://43.138.109.120:9000/avatar/c8a20e4939c4234419c5ed0f6d5a337f.jpg",
        category: "nest.js",
        updateTime: "2023-09-14",
        articleContent: "",
      },
      {
        id: "3",
        articleTitle: "无缝集成：一键登录码云和GitHub，提升用户体验与应用安全",
        articleDesc:
          "当集成日志管理时，你需要在 Nest.js 项目中添加日志功能来记录应用的运行状态和事件。日志是开发和维护应用的重要工具，它可以帮助你追踪问题、监控性能，并了解应用的运行情况。在这篇文章中，我们将介绍如何使用 `winston` 日志库在 Nest.js 项目中集成日志管理功能",
        articleCover:
          "http://43.138.109.120:9000/avatar/c8a20e4939c4234419c5ed0f6d5a337f.jpg",
        category: "nest.js",
        updateTime: "2023-09-14",
        articleContent: "",
      },
    ],
  },
  {
    id: "2023-11",
    time: "2023年11月",
    articleCount: 2,
    articleList: [
      {
        id: "1",
        articleTitle: "nest集成日志管理",
        articleDesc:
          "当集成日志管理时，你需要在 Nest.js 项目中添加日志功能来记录应用的运行状态和事件。日志是开发和维护应用的重要工具，它可以帮助你追踪问题、监控性能，并了解应用的运行情况。在这篇文章中，我们将介绍如何使用 `winston` 日志库在 Nest.js 项目中集成日志管理功能",
        articleCover:
          "http://43.138.109.120:9000/avatar/c8a20e4939c4234419c5ed0f6d5a337f.jpg",
        category: "nest.js",
        updateTime: "2023-09-14",
        articleContent: "",
      },
      {
        id: "2",
        articleTitle: "nest集成日志管理",
        articleDesc:
          "当集成日志管理时，你需要在 Nest.js 项目中添加日志功能来记录应用的运行状态和事件。日志是开发和维护应用的重要工具，它可以帮助你追踪问题、监控性能，并了解应用的运行情况。在这篇文章中，我们将介绍如何使用 `winston` 日志库在 Nest.js 项目中集成日志管理功能",
        articleCover:
          "http://43.138.109.120:9000/avatar/c8a20e4939c4234419c5ed0f6d5a337f.jpg",
        category: "nest.js",
        updateTime: "2023-09-14",
        articleContent: "",
      },
    ],
  },
  {
    id: "2023-10",
    time: "2023年10月",
    articleCount: 4,
    articleList: [
      {
        id: "1",
        articleTitle: "nest集成日志管理",
        articleDesc:
          "当集成日志管理时，你需要在 Nest.js 项目中添加日志功能来记录应用的运行状态和事件。日志是开发和维护应用的重要工具，它可以帮助你追踪问题、监控性能，并了解应用的运行情况。在这篇文章中，我们将介绍如何使用 `winston` 日志库在 Nest.js 项目中集成日志管理功能",
        articleCover:
          "http://43.138.109.120:9000/avatar/c8a20e4939c4234419c5ed0f6d5a337f.jpg",
        category: "nest.js",
        updateTime: "2023-09-14",
        articleContent: "",
      },
      {
        id: "2",
        articleTitle: "nest集成日志管理",
        articleDesc:
          "当集成日志管理时，你需要在 Nest.js 项目中添加日志功能来记录应用的运行状态和事件。日志是开发和维护应用的重要工具，它可以帮助你追踪问题、监控性能，并了解应用的运行情况。在这篇文章中，我们将介绍如何使用 `winston` 日志库在 Nest.js 项目中集成日志管理功能",
        articleCover:
          "http://43.138.109.120:9000/avatar/c8a20e4939c4234419c5ed0f6d5a337f.jpg",
        category: "nest.js",
        updateTime: "2023-09-14",
        articleContent: "",
      },
      {
        id: "3",
        articleTitle: "切图仔最后的倔强：包教不包会设计模式 - 结构型",
        articleDesc:
          "当集成日志管理时，你需要在 Nest.js 项目中添加日志功能来记录应用的运行状态和事件。日志是开发和维护应用的重要工具，它可以帮助你追踪问题、监控性能，并了解应用的运行情况。在这篇文章中，我们将介绍如何使用 `winston` 日志库在 Nest.js 项目中集成日志管理功能",
        articleCover:
          "http://43.138.109.120:9000/avatar/c8a20e4939c4234419c5ed0f6d5a337f.jpg",
        category: "nest.js",
        updateTime: "2023-09-14",
        articleContent: "",
      },
      {
        id: "4",
        articleTitle: "无缝集成：一键登录码云和GitHub，提升用户体验与应用安全",
        articleDesc:
          "当集成日志管理时，你需要在 Nest.js 项目中添加日志功能来记录应用的运行状态和事件。日志是开发和维护应用的重要工具，它可以帮助你追踪问题、监控性能，并了解应用的运行情况。在这篇文章中，我们将介绍如何使用 `winston` 日志库在 Nest.js 项目中集成日志管理功能",
        articleCover:
          "http://43.138.109.120:9000/avatar/c8a20e4939c4234419c5ed0f6d5a337f.jpg",
        category: "nest.js",
        updateTime: "2023-09-14",
        articleContent: "",
      },
    ],
  },
]);
</script>

<style scoped lang="less">
.archive_page {
  padding-bottom: 10vh;
  width: 100%;
  height: calc(100vh - var(--vp-nav-height));
  position: fixed;
  top: var(--vp-nav-height);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  .cover {
    width: 100%;
    height: 35vh;
    background-image: url("../../../../public/archive_cover.png");
    background-position: center 80%;
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
  // box-shadow: 0 0 10px rgb(0 0 0 / 0.1);
  animation-duration: 1s;
  transition: all 0.2s ease-in-out 0s;
  .avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  .month_list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    font-size: 14px;
    margin-top: 20px;
    .article_item {
      display: flex;
      padding: 2px 6px;
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
    display: inline-block;
    padding-top: 10px;
    font-size: 16px;
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    background-image: linear-gradient(to right, #24c6dc, #514a9d);
  }
}
</style>
