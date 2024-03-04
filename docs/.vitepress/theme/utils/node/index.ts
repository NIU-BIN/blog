// import process from "node:process";
import fs from "node:fs";
import NodePath from "node:path";
import glob from "fast-glob";
import { spawn, spawnSync } from "node:child_process";
import { ArticleItem, ThemeConfig } from "../../types";
import { DefaultTheme } from "vitepress";
import dayjs from "dayjs";

export const clearMatterContent = (content: string) => {
  let first___: unknown;
  let second___: unknown;

  const lines = content.split("\n").reduce<string[]>((pre, line) => {
    // 移除开头的空白行
    if (!line.trim() && pre.length === 0) {
      return pre;
    }
    if (line.trim() === "---") {
      if (first___ === undefined) {
        first___ = pre.length;
      } else if (second___ === undefined) {
        second___ = pre.length;
      }
    }
    pre.push(line);
    return pre;
  }, []);

  return {
    frontmatterContent: lines.slice(0, (second___ as number) || 0),
    articleContent: lines.slice((second___ as number) || 0).join("\n"),
  };
};

// 获取文章信息
export const getArticleInfo = (text: string, count = 180) => {
  const { articleContent, frontmatterContent } = clearMatterContent(text);

  // 获取文章封面  TODO: 默认封面文章封面进行配置
  const cover =
    frontmatterContent
      .find((str) => {
        return str.startsWith("cover:");
      })
      ?.slice(6)
      .trim() ||
    "https://cdn.pixabay.com/photo/2014/04/14/20/11/pink-324175_640.jpg";

  // 获取文章置顶序号
  const sticky =
    Number(
      frontmatterContent
        .find((str) => {
          return str.startsWith("sticky:");
        })
        ?.slice(7)
        .trim()
    ) || undefined;

  // 取md中纯内容截取前count
  const description =
    articleContent
      .match(/^# ([\s\S]+)/m)?.[1]
      // 除去标题
      ?.replace(/#/g, "")
      // 除去图片
      ?.replace(/!\[.*?\]\(.*?\)/g, "")
      // 除去链接
      ?.replace(/\[(.*?)\]\(.*?\)/g, "$1")
      // 除去加粗
      ?.replace(/\*\*(.*?)\*\*/g, "$1")
      ?.split("\n")
      ?.filter((v) => !!v)
      ?.slice(1)
      ?.join("\n")
      ?.replace(/>(.*)/, "")
      ?.slice(0, count) + "..." || "";

  const title =
    articleContent
      .split("\n")
      ?.find((str) => {
        return str.startsWith("# ");
      })
      ?.slice(2)
      .replace(/^\s+|\s+$/g, "") || "";

  return {
    title,
    description,
    cover,
    sticky,
  };
};

// 获取文章发布时间
export const getFileBirthTime = (url: string) => {
  let date: string = dayjs().format("YYYY-MM-DD hh:mm:ss");
  let updateTime: string = dayjs().format("YYYY-MM-DD hh:mm:ss");

  try {
    // 使用git log命令获取文件的提交时间
    // git log --pretty=%ci --reverse docs/note/network/TCP.md
    // --reverse  倒序
    const timelineData = spawnSync("git", [
      "log",
      '--pretty="%ci"',
      "--reverse",
      url,
    ])
      .stdout?.toString()
      .trim()
      .replace(/["']/g, "")
      .split("\n");

    if (timelineData) {
      date = dayjs(timelineData[0]).format("YYYY-MM-DD hh:mm:ss");
      updateTime = dayjs(timelineData[timelineData.length - 1]).format(
        "YYYY-MM-DD hh:mm:ss"
      );
    }
  } catch (error) {
    console.log("error:", error);
  }

  return {
    date,
    updateTime: dayjs(updateTime).format("YYYY-MM-DD hh:mm:ss"),
    month: dayjs(date).format("YYYY-MM"),
    day: dayjs(date).format("YYYY-MM-DD"),
  };
};

// 获取md文件中title
/* export const getArticleTitle = (content: string) => {
  const title =
    clearMatterContent(content)
      .split("\n")
      ?.find((str) => {
        return str.startsWith("# ");
      })
      ?.slice(2)
      .replace(/^\s+|\s+$/g, "") || "";
  return title;
}; */

// 获取所有md文件信息
export const getFilesInfo = () => {
  const srcDir = process.argv.slice(2)?.[1] || ".";
  // 获取当前项目下所有md
  const files = glob.sync(`${srcDir}/**/*.md`, { ignore: ["node_modules"] });
  // console.log("files: ", files);
  const filesInfo: ArticleItem[] = files.map((file) => {
    const path = file.replace(".md", "").replace("docs", "");
    const fileContent = fs.readFileSync(file, "utf-8");
    /* 
      TODO: 封面计划在md的frontmatter中配置，暂定使用正则匹配
    */
    const { title, description, cover, sticky } = getArticleInfo(fileContent);
    /* 
      原计划按照文件修改时间为准，但是为了避免文件误修改导致文件修改时间改变
      文章发布时间按照git的timestamp为准
    */
    const { date, month, day, updateTime } = getFileBirthTime(file);
    // const description = getArticleInfo(fileContent) || "";

    const fileInfo: ArticleItem = {
      path,
      title,
      description,
      date,
      updateTime,
      month,
      day,
      cover,
      sticky,
    };

    return fileInfo;
  });
  // 固定页面的路径
  const PAGES_PATH = [
    `/index`, // 首页
    `/about`, // 关于
    `/archive`, // 归档
  ];
  // 去掉固定页面，其余为文章
  const filesList = filesInfo
    .filter((item) => !PAGES_PATH.includes(item.path))
    .sort((a, b) => +dayjs(b.date) - +dayjs(a.date));
  return filesList;
};

type ThemeConfigType = DefaultTheme.Config & {
  article: ArticleItem[];
} & ThemeConfig;

export const getThemeConfig = (config: ThemeConfig) => {
  const themeConfig: ThemeConfigType = {
    article: getFilesInfo(),
    ...config,
  };
  return themeConfig;
};
