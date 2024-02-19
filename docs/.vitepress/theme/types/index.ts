import { Mapping, Repo } from "@giscus/vue";

// 文章
export interface ArticleItem {
  path: string;
  title: string;
  description: string;
  date: string;
  month: string;
  day: string;
  cover?: string;
  tag?: string[];
  author?: string;
  sticky?: number;
}

// 用户标签
type userTag = {
  id: string;
  name: string;
  value: number;
};

// 作者信息
export interface AutherInfo {
  name: string;
  tags: userTag[];
}

// 评论组件配置
export interface CommentConfig {
  repo: Repo;
  repoId: string;
  category: string;
  categoryId: string;
  inputPosition?: "top" | "bottom";
  mapping?: Mapping;
  lang?: string;
  loading?: "lazy" | "eager";
}

// 友链
export interface FriendItem {
  avatar: string;
  name: string;
  desc: string;
  link: string;
}

// 定制主题配置
export interface ThemeConfig {
  author?: string;
  comment: CommentConfig;
  friend: FriendItem[];
}
