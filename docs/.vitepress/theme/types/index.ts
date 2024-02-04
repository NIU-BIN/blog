// 文章
export interface ArticleItem {
  path: string;
  title: string;
  description: string;
  date: string;
  cover?: string;
  tag?: string[];
  author?: string;
  top?: number;
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
