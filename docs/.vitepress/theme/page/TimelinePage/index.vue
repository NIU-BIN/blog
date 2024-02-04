<template>
  <div>
    <PageTop title="归档" />
    <div
      class="archive_list my-10 mx-auto p-6 w-[1050px] rounded-2xl"
      v-animate="['slideUpBigIn']"
    >
      <el-timeline>
        <el-timeline-item
          :timestamp="`${month.time}（${month.articleCount}篇文章）`"
          placement="top"
          v-for="month in monthList"
          :key="month.id"
        >
          <template #dot>
            <img
              src="@/assets/image/avatar.png"
              class="w-6 h-6 rounded-full"
              alt=""
            />
          </template>
          <ul
            class="flex flex-col gap-2 text-sm mt-2 text-gray-600 dark:text-gray-400"
          >
            <li
              v-for="article in month.articleList"
              class="px-2 py-1 flex items-center gap-2 justify-between hover:bg-slate-200 cursor-pointer rounded-md dark:hover:bg-gray-700"
            >
              <!-- <span>&#128196;</span>  -->
              <div>
                <span>&#128214;</span>
                <span class="ml-2">{{ article.articleTitle }}</span>
              </div>
              <span class="text-gray-400">{{ article.updateTime }}</span>
            </li>
          </ul>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import PageTop from "@/components/PageTop/index.vue";
// import { ArticleItem } from "@/types";

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
.archive_list {
  // box-shadow: 0 0 10px rgb(0 0 0 / 0.1);
  visibility: hidden;
  animation-duration: 1s;
  transition: all 0.2s ease-in-out 0s;
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
