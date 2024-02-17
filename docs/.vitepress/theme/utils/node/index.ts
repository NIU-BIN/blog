// import process from "node:process";
import fs from "node:fs";
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
  return (
    lines
      // 剔除---之间的内容
      .slice((second___ as number) || 0)
      .join("\n")
  );
};

export const formatDate = (d: any, fmt = "yyyy-MM-dd hh:mm:ss") => {
  if (!(d instanceof Date)) {
    d = new Date(d);
  }
  const o: any = {
    "M+": d.getMonth() + 1, // 月份
    "d+": d.getDate(), // 日
    "h+": d.getHours(), // 小时
    "m+": d.getMinutes(), // 分
    "s+": d.getSeconds(), // 秒
    "q+": Math.floor((d.getMonth() + 3) / 3), // 季度
    S: d.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      `${d.getFullYear()}`.substr(4 - RegExp.$1.length)
    );
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length)
      );
  }
  return fmt;
};

// 获取文章概述（取md中纯内容截取前100）
export const getTextSummary = (text: string, count = 120) => {
  return (
    clearMatterContent(text)
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
      ?.slice(0, count) + "..."
  );
};

// 获取文章发布时间
export const getFileBirthTime = (url: string) => {
  let date: Date | string = new Date();
  let month = "";
  let day = "";

  try {
    // 参考 vitepress 中的 getGitTimestamp 实现
    const infoStr = spawnSync("git", ["log", "-1", '--pretty="%ci"', url])
      .stdout?.toString()
      .replace(/["']/g, "")
      .trim();
    if (infoStr) {
      date = new Date(infoStr);
      month = dayjs(infoStr).format("YYYY-MM");
      day = dayjs(infoStr).format("YYYY-MM-DD");
    }
  } catch (error) {
    date = formatDate(date);
  }

  return {
    date: formatDate(date),
    month,
    day,
  };
};

// 获取md文件中title
export const getArticleTitle = (content: string) => {
  const title =
    clearMatterContent(content)
      .split("\n")
      ?.find((str) => {
        return str.startsWith("# ");
      })
      ?.slice(2)
      .replace(/^\s+|\s+$/g, "") || "";
  return title;
};

// 获取所有md文件信息
export const getFilesInfo = () => {
  const srcDir = process.argv.slice(2)?.[1] || ".";
  // 获取当前项目下所有md
  const files = glob.sync(`${srcDir}/**/*.md`, { ignore: ["node_modules"] });
  // console.log("files: ", files);
  const filesInfo: ArticleItem[] = files.map((file) => {
    const path = file.replace(".md", "");
    const fileContent = fs.readFileSync(file, "utf-8");
    const fileTitle = getArticleTitle(fileContent);
    /* 
      原计划按照文件修改时间为准，但是为了避免文件误修改导致文件修改时间改变
      文章发布时间按照git的timestamp为准
    */
    const { date, month, day } = getFileBirthTime(file);
    const description = getTextSummary(fileContent) || "";
    /* 
      TODO: 封面计划在md的frontmatter中配置，暂定使用正则匹配
    */
    const cover = "";

    const fileInfo: ArticleItem = {
      path,
      title: fileTitle,
      description,
      date,
      month,
      day,
      cover,
    };

    return fileInfo;
  });
  // 固定页面的路径
  const PAGES_PATH = [
    `${srcDir}/index`,
    `${srcDir}/about`,
    `${srcDir}/archive`,
  ];
  // 去掉固定页面，其余为文章
  const filesList = filesInfo.filter((item) => !PAGES_PATH.includes(item.path));
  // console.log("filesList", filesList);
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
