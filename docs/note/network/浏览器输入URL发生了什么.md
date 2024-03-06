---
category: network
cover: https://cdn.pixabay.com/photo/2023/10/30/05/19/sunflowers-8351807_640.jpg
---

# 浏览器输入 URL 发生了什么

## DNS 查询

DNS 查询顺序如下，如果其中一部成功则直接跳到建立链接部分

1. 浏览器自身 DNS
2. 操作系统 DNS
3. 本地 host 文件
4. 向域名服务器发送请求

![](http://tuchuang.niubin.site/image/network-10.png)

向域名服务器发送请求，请求规则如下：

1. 根域名服务器
2. 顶级域名服务器
3. 权威域名服务器

![](http://tuchuang.niubin.site/image/network-11.png)

DNS 解析之后获取到 ip，有了 ip 发送网络请求，进入 OSI 七层网络模型，其中传输层发起三次握手，发送 http 请求

我们在发送 post 请求时有时会发现有两个请求，一个是 options 请求，第二个是我们真正的请求，那 options 请求是什么呢？
options 请求会有两种情况出现：

1. 遇到跨域的时候，浏览器会发送一个 options 请求做一个预检，看能不能通讯
2. 自定义请求头的时候也会触发 options 请求

![](http://tuchuang.niubin.site/image/network-12.png)

## 浏览器缓存

### 强缓存

强缓存指的是让浏览器强制缓存服务器端提供的资源

缓存的资源存放的位置一般有两种：

1. `from disk cache` 硬盘缓存
2. `from memory cache` 内存缓存

![](http://tuchuang.niubin.site/image/network-13.png)

> ✨ 当 Cache-Control 和 Expires 同时存在的时候哪个优先级更高呢？

## 协商缓存

- Last-Modified: Sat, 09 Apr 2023 20:11:23 GMT(最后被修改的时间)
- If-Modified-Since: Sat, 09 Apr 2023 20:11:23 GMT
- ETag: "aaaaasssdasddasdsd"
- If-None-Match: "aaaaaaaaaaaaaaaa"

当服务端发现资源最后修改时间和 `If-Modified-Since` 值相等，代表资源从该时间后再未改变过。服务端于是返回 `304(Not Modified)` 状态码，表示资源没有改变，并且响应体为空。浏览器拿到后，就知道原本可能过期的缓存其实还可以继续使用。如果资源改变了，就会返回 200，且响应体带上最新资源。
Etag 的值没有规定一般是文件 hash，你也可以设置版本号之类的去对比

> ✨ 当 Last-Modified 和 ETag 同时存在的时候哪个优先级更高呢？

到这里请求完就要完成 TCP 的四次挥手了，当完成之后我们拿到 html 文件要如何渲染呢？

## HTML 渲染

html 渲染第一步就是绘制 DOM 树

HTML 解析器将超文本和标签解析为 `DOM` 树，从上往下进行 `AST` 抽象语法树一行一行解析我们的 DOM，然后绘制成一个抽象语法树

![](http://tuchuang.niubin.site/image/network-14.png)

那 CSS 如何解析呢？

CSS 样式来源主要有 3 种，分别是 通过 link 引用的外部 CSS 文件、style 标签内的 CSS、元素的 style 属性内嵌的 CSS。CSS 渲染引擎会将我们的 CSS 样式表转换为浏览器可以理解的 styleSheets，其样式计算过程主要为:

![](http://tuchuang.niubin.site/image/network-15.png)

上面的 CSS 文本中有很多属性值，如 2em、blue、bold，这些类型数值不容易被渲染引擎理解，所以需要将所有值转换为渲染引警容易理解的、标准化的计算值，这个过程就是属性值标准化。处理完成后再处理样式的继承和层叠，有些文章将这个过程称为 CSSOM 的构建过程。

CSS 绘制的时候会遇到什么呢？

1. 回流（Reflow）

当 Render Tree 中部分或者全部元素的尺寸、结构或者某些属性发生改变的时候，浏览器重新渲染部分或者全部文档的过程叫做回流

导致回流的一些操作：

- 页面首次渲染
- 浏览器窗口发生改变时
- 元素尺寸或者位置发生改变
- 元素内容变化（文字数量或者图片大小等）
- 元素字体大小发生改变
- 添加或者删除可见的 DOM 元素
- 激活 CSS 伪类（如 `:hover`等）
- 查询某些属性或者调用某些方法

一些常用且会导致回流的属性或者方法

- `clientWidth`、`clientHeight`、`clientTop`、`clientLeft`
- `offsetwidth`、`offsetHeight`、`offsetTop`、`offsetLeft`
- `scrollwidth`、`scrollHeight`、`scrollTop`、`scrollLeft`
- `scrollIntoView()`、`scrollIntoViewIfNeeded()`
- `getComputedstyle()`
- `getBoundingclientRect()`
- `scrollTo()`

2. 重绘（Repaint）

当页面中元素的样式改变并不影响他在文档流中的位置时（如：`color`、`background-color`、`visibility` 等），浏览器将新样式赋予给元素并重新绘制它，这个过程叫做重绘

## JavaScript 解析

JavaScript 是浏览器 V8 引擎进行解析的，V8 引擎是由 `C++` 编写

![](http://tuchuang.niubin.site/image/network-16.png)
