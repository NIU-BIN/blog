# 友人 A の博客

该博客由 [vitepress](https://vitepress.dev/zh/) 为基础，使用 Vue3、TypeScript 自定义改造，现已完成下述功能，✔ 为已完成

- [x] 首页结构重写
- [x] 获取文章数据
- [x] 文章左侧导航列表
- [x] 文章封面配置
- [x] 归档页面
- [x] 暗夜主题适配
- [x] 图片预览功能
- [x] 评论模块集成
- [ ] 文章 meta（bug 待修复）
- [ ] 移动端适配
- [ ] 配置说明

## 博客样图

![首页](/image/1.webp)
![归档](/image/2.webp)
![文章](/image/3.webp)
![暗夜](/image/4.webp)

## 线上地址

> 🎉 欢迎留言，还望指教

[http://niubin.site/](http://niubin.site/)

## 结构说明

```
|-- blog
    |-- docs
        |-- .vitepress
            |-- theme  // 自定义主题
            |-- config.mts  // vitepress配置文件
            |-- theme-config.mts  // 自定义主题配置文件
        |-- public // 静态资源
        |-- index.md // 主页
        |-- archive.md // 归档
        |-- about.md // 关于
    |-- .gitignore
    |-- LICENSE.md
    |-- README.md
    |-- package.json
    |-- pnpm-lock.yaml
```

## 快速上手

1. 安装依赖

```bash
pnpm i
```

2. 开发启动

```bash
npm run docs:dev
```

3. 构建打包

```bash
npm run docs:build
```

4. 预览

```bash
npm run docs:preview
```
