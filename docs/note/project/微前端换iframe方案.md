# 微前端换 iframe 方案

在某个 Vue3 项目中，需要将已有的平台合并进新的平台，由于代码迁移太过繁琐，于是最先想到的就是微前端方案，但是碰到了许多问题，最终还是放弃了。

- qiankun
  起初之前在 vue2 项目中使用过阿里的[qiankun](https://qiankun.umijs.org/zh)，所以这次也是打算使用，但是在 vite 构建的 vue3 项目中出现了一些问题，官网的文档依旧很老旧，vue3 迟迟没有更新，并且对于 vite 的支持较差，目前已经有了方案，有大佬已经开发了支持 vite 的插件 `vite-plugin-qianku`。

  最恼人的还是样式隔离问题，官方提供了沙箱 sandbox 来解决，但是启用严格模式的样式隔离时，虽然父子应用得到了隔离，但是子应用的样式文件直接作用到父应用，子应用样式丢失，也想了很多方法，使用了一些`change-prefix-loader`改变 class 的前缀来防止不同应用中的样式污染，但是组件库却碰到了一些问题，最后彻底放弃了
  ![](http://tuchuang.niubin.site/image/project-20240905-1.png)

- wujie
  看到了京东物流的[wujie](https://wujie-micro.github.io/doc/)，基于 `WebComponent` 容器 + `iframe` 沙箱解决，在样式隔离方面是优点，但是遇到了偶尔渲染失败，渲染异常的问题。无界的文章相对较少，自己也没有排查到问题，因此也放弃了

- iframe
  由于时间不够，没有去排查上述微前端方案的问题，本来也想再试试其他微前端方案的，我知道会有很多的坑需要趟，考虑了一下场景，决定使用 `iframe`，我们都知道 iframe 虽然用起来方便，样式可以说完全隔离，但是带来的问题也很多，比如每次进入都需要重新拉取子应用资源、路由刷新回到初始的 src 的 path、通信、加载慢、遮罩层问题等等，下面我来说一下我的处理

## 通信与数据共享

在同源的情况下，我们可以使用 `postMessage` 和监听 `message` 来解决通讯，通过`同源`的 `localStorage`、`sessionStorage`来共享数据（所以还是建议放在同源下，使用 nginx 代理子应用）。

主应用：

```html
<template>
  <div id="container">
    <button @click="send">send</button>
    <iframe :src="`${origin}/app1`" ref="app1" frameborder="0"></iframe>
  </div>
</template>
<script setup>
  import { ref } from "vue";

  const app1 = ref();

  const send = () => {
    app1.value && app1.value.contentWindow?.postMessage("我是主应用发送过来的消息");
  };

  window.addEventListener(
    "message",
    (event) => {
      if (event.origin !== window.location.origin) return;
      console.log("接收到子应用的消息: ", event.data); // 我是子应用发送过来的消息
    },
    false
  );
</script>
```

子应用：

```js
window.addEventListener(
  "message",
  (event) => {
    if (event.origin !== window.location.origin) return;
    console.log("接收到主应用的消息: ", event.data); // 我是主应用发送过来的消息
  },
  false
);

const send = () => {
  window.parent.postMessage("我是子应用发送过来的消息");
};
```

子应用通知主应用一般较少，比如 401 超时，通知主应用退出之类的。

> 如果你使用了 vue devtools 或者 react 的 React Developer Tools 会频繁接受到消息

## 渲染与路由保持

先说渲染吧，一般我们路由的权限都是做控制的，在主应用返回之后处理好后存储起来，等待 iframe 将所需要下载的前端资源下载完成后会执行 `onload` 的方法，这时候我们再通知子应用进行渲染（这边以 Vue 为例）

> 建议将 postMessage 发送的消息进行规范，我是定义了一个对象，action 代表我发送的行为，value 是行为所携带的值

主应用：

```html
<template>
  <div id="container">
    <iframe :src="`${origin}/app1`" ref="app1" frameborder="0" :onload="postMessage"></iframe>
  </div>
</template>
<script setup>
  import { ref } from "vue";

  const app1 = ref();
  const app1Routes = ref([]); // 这是app1子应用的路由表

  const postMessage = () => {
    app1.value &&
      app1.value.contentWindow?.postMessage({
        action: "getAppRoutes",
        value: JSON.stringify(app1Routes),
      });
  };
</script>
```

子应用：

```js
import { createApp, onUnmounted } from "vue";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";

const app = createApp(App);
const pinia = createPinia();
let router;

app
  .use(pinia)
  .use(ElementIcons)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .use(plugin);

const store = appStore();

// 应用通信
const actionDispatch = (event) => {
  if (event.origin !== window.location.origin) return;
  const { action, value } = event.data;
  console.log("vpp子应用接收到的消息：", event.data);
  if (action === "getAppRoutes") initApp(value);
};

window.addEventListener("message", (event) => actionDispatch(event), false);

const getAppRoutes = (data) => {
  sessionStorage.setItem("app1-routes", data);
  return [
    {
      path: "/",
      name: "layout",
      meta: {
        title: "",
        isMenuPage: true,
      },
      component: () => import("@/layout"),
      children: [...loadRouterComponent([...JSON.parse(data)])],
    },
  ];
};

//  应用初始化
const initApp = (routeData) => {
  const appMenu = getAppRoutes(routeData);
  router = createRouter({
    routes: appMenu,
    history: createWebHistory("/app1"),
  });
  app.use(router).mount("#app");
};
```

我们想保持上次的跳转路径，可以存储在 storage 中，我们在 `app.vue` 中监听路由，然后存储

```js
watch(
  () => route.path,
  (path) => {
    localStorage.setItem("app1-route", path);
  }
);
```

在 `main.js` 初始化的时候获取存储的路径 path

```js
//  应用初始化
const initApp = (routeData) => {
  const appMenu = getAppRoutes(routeData);
  router = createRouter({
    routes: appMenu,
    history: createWebHistory("/app1"),
  });
  app.use(router).mount("#app");
  const currentPath = localStorage.getItem("app1-route") || JSON.parse(routeData)[0].path; // 获取缓存中的路径，没有则需要递归查找第一个路径进行跳转
  router.push(currentPath);
};
```

这样即使跳转了之后我再刷新也是上次的路径。

> 这时候有小伙伴可能会问，如果我需要浏览器的 url 也跟着变动，并且我输入 url，能够进入到子应用的页面该如何处理？

这个问题可以解决，也可以不用管，具体看你们的需求是否需要让 url 也变化，我觉得还是要解决一下。

如果我们需要使用 `location` 直接改变，他也会重新刷新页面，所以传统的 `location` 是行不通的，这时候，我们需要了解一下[History 接口](https://developer.mozilla.org/zh-CN/docs/Web/API/History)

其中有一个方法是 `pushState()`，该方法可以更改 url 路径，但是不会触发页面的刷新，那这样的话我们就可以在子应用监听路由的时候将当前的 path 通知到主应用，让他更新当前的路径。

子应用：

```js
watch(
  () => route.path,
  (path) => {
    localStorage.setItem("app1-route", path);
    window.parent.postMessage({
      action: "changeURL",
      value: path,
    });
  }
);
```

主应用：

```js
window.addEventListener(
  "message",
  (event) => {
    if (event.origin !== window.location.origin) return;
    const { action, value } = event.data;
    if (action === "changeURL") changeURL(value);
  },
  false
);

const changeURL = (path) => {
  history.pushState(null, null, path);
};
```

接下来就是当前更改的路径然后 F5 刷新的问题了，直接访问你更改的路径会 404 的，因为在你的主应用的路由中没有注册这个路径，这时候我们需要在路由守卫去处理。我们根据当前的路径在子应用的路由表数据中递归一次，看是否属于子应用菜单，如果是，那直接跳转对应子应用的入口路由（这边的入口路由就是主应用中渲染子应用的页面的路径），跳转之间依旧存储一下子应用的路由，用于子应用渲染的时候它该知道要跳转什么页面，记得这时候当前窗口的 URL 是我们子应用的入口路由的 path，需要重新通过 `history.replaceState` 更改当前路径

> 注意，这边的匹配可以在 404 的时候再去匹配，这样会减少匹配的次数，不需要每次都递归一次查看是否匹配

## 遮罩层的问题

由于我们的遮罩层是铺满整个当前的 iframe 的全屏，在子应用中实际遮罩层是遮盖的渲染当前子应用容器的大小，如果你的项目必须得解决这个问题的话我们可以这样处理：

首先给主应用的 layout 层级创建一个遮罩层，颜色与子应用中的遮罩层颜色保持一致，在子应用中我们使用携带遮罩层的组件的时候例如 `Dialog` 组件，我们通过 `postMessage` 给主应用发送通知，让显示出遮罩层。需要注意的问题就是，由于主应用的遮罩层会覆盖整个窗口，所以需要设置 `z-index`，使得 `iframe` 的 `z-index` 大于遮罩层的层级，这样 `iframe` 是不会受主应用的遮罩层影响，只会显示出自己的遮罩层，这样看起来就是打开 `Dialog` 的时候覆盖住全局的遮罩层.

## 加载慢

其实上述问题解决了基本都差不多了，够用了，但是我们知道 iframe 最严重的问题就是完全隔离，导致他里面的资源每次都会重新下载，会导致渲染特别慢，所以我们尽可能的将子应用包的体积缩小，比如 gzip 压缩什么的一大堆性能优化，这是必要，但又没有解决实际 iframe 所带来的的问题，我们先来分析一下慢，慢在哪，有没有方法可以处理？

举个例子，我们已经打包部署到环境中，主应用地址为 `localhost:3000`，我主应用叫做 `web`，其中有一个页面是负责渲染子应用的，他的 vue 文件是`demo1.vue`，路由的 path 为`/demo1`, 子应用叫做`app`（这边子应用也是 vue 项目），子应用中有一个页面的 path 为`user-manage`，我们来理一下当我首次进入 `/user-manage`这个页面时都需要干什么，打包后我们的`web`主应用的`index.html` 内容如下：

```html
<!DOCTYPE html>
<html class="dark">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="renderer" content="webkit" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
    />
    <link rel="icon" href="/favicon.ico" />
    <title></title>
    <script type="module" crossorigin src="/assets/index-DZ3Sl4YY.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-DRuLSQSP.css" />
  </head>

  <body>
    <div id="app"></div>
  </body>
</html>
```

![](http://tuchuang.niubin.site/image/project-20240905-2.png)

首先我们先下载 web 的 html 文件，然后浏览器进行解析，发现需要下载的 css、js 文件，入口的 js 文件是打包后的 vue 入口 `main.js` 文件，并且包含 vue 渲染的代码，可以当做 vue 源码吧，所以一般来说这个入口的 `main-xxxxx.js` 文件还是比较大的，`main-xxx.js` 文件下载完解析发现，还需要下载你的组件库、pinia、等其他在 `main.js` 中使用的包，等这些包下载完之后，开始注册路由、注册 store 这些东西，然后发现需要跳转对应的 path，看一下需要访问的 path 是已经注册过的，如果路由注册使用的是懒加载，那需要下载这个 path 对应注册的组件的代码，然后进行渲染，如果这个 path 刚好是我们子应用页面的路径，那我们进入的是渲染子应用的界面，那么在解析的时候发现碰到了 `iframe`，又获取 `iframe` 的 url 去下载这个子应用 app 的 html 文件，然后用重复上面跟主应用相同的解析以及下载渲染逻辑。

所以如果我们访问的是子应用的页面的时候，我们子应用的相关前端资源都是等待主应用的资源下载且渲染后才开始下载，一切都是串式的，所以我们想如果我要进入子应用的某个页面前能不能让他提前将他基础的资源下载完，当进入页面的时候我只需要下载我访问这个页面当时的 vue 文件然后进行这个界面的渲染就完了，这样大大节省了时间。我是这么处理的：

```html
<!DOCTYPE html>
<html class="dark">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="renderer" content="webkit" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
    />
    <link rel="icon" href="/favicon.ico" />
    <title></title>
    <script type="module" crossorigin src="/assets/index-DZ3Sl4YY.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-DRuLSQSP.css" />
  </head>

  <body>
    <div id="app"></div>
    <script>
      window.onload = () => {
        const origin = location.origin;
        const appIframe = document.createElement("iframe");
        appIframe.src = `${origin}/app`;
        appIframe.setAttribute("id", "appRef");
        appIframe.setAttribute("frameborder", "0");
        appIframe.style.display = "none";
        document.body.append(appIframe);
        window.appWindow = appIframe.contentWindow;
      };
    </script>
  </body>
</html>
```

这是 demo1.vue

```html
<template>
  <div id="app-container"></div>
</template>

<script setu>
  import usePermissionStore from "@/store/modules/permission";
  import { ref } from "vue";
  import { storeToRefs } from "pinia";
  const permissionStore = usePermissionStore();
  const { appRoutes } = storeToRefs(permissionStore);

  const postMessage = () => {
    window.appWindow.postMessage({
      action: "getAppMenu",
      value: JSON.stringify(appRoutes),
    });
  };

  onMounted(() => {
    const appWindow = document.querySelector("#appRef");
    appWindow.onload = postMessage;
    appWindow.style.display = "block";
    appWindow.contentWindow?.postMessage({
      action: "getAppMenu",
      value: JSON.stringify(appRoutes),
    });
  });

  onUnmounted(() => {
    const appWindow = document.querySelector("#appRef");
    appWindow.style.display = "none";
    appWindow.contentWindow?.postMessage({
      action: "uninstall",
      value: null,
    });
  });
</script>

<style lang="scss" scoped>
  #app-container {
    height: calc(100vh - 96px);
    overflow: hidden;
  }
</style>
```

这是子应用 app 的入口文件 main.js

```js
import { createApp, onUnmounted } from "vue";
import "@/router/guard";
import { createPinia } from "pinia";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import plugin from "@/plugins";
import { appStore } from "./store/app";
import { createRouter, createWebHistory } from "vue-router";
import { loadRouterComponent } from "@/utils";
import ElementIcons from "@/plugins/svgicon";

let app;
let router;
let store;

const pinia = createPinia();

// 应用通信
const actionDispatch = (event) => {
  if (event.origin !== window.location.origin) return;
  const { action, value } = event.data;
  console.log("vpp子应用接收到的消息：", event.data);
  if (action === "getAppMenu") initApp(value);
  if (action === "routeChange") router && router.push(value);
  if (action === "uninstall") resetRouter();

  store[action] && store[action](value);
};

window.addEventListener("message", (event) => actionDispatch(event), false);

const getAppMenu = (data) => {
  sessionStorage.setItem("vpp-menu", data);
  return [
    {
      path: "/",
      name: "layout",
      meta: {
        title: "",
        isMenuPage: true,
      },
      component: () => import("@/layout"),
      children: [...loadRouterComponent([...JSON.parse(data)])],
    },
  ];
};

//  应用初始化
const initApp = (menuData) => {
  if (!app) {
    const appMenu = getAppMenu(menuData);
    app = createApp(App);
    app
      .use(pinia)
      .use(ElementIcons)
      .use(ElementPlus, {
        locale: zhCn,
      })
      .use(plugin);
    router = createRouter({
      routes: appMenu,
      history: createWebHistory("/app"),
    });
    app.use(router).mount("#app");

    store = appStore();
  }
  const currentPath = localStorage.getItem("app-route") || JSON.parse(menuData)[0].path;
  router.push(currentPath);
};

// 清空路由
const resetRouter = () => {
  app.unmount();
  app = null;
};
```

是什么意思呢，就是我们将子应用的 iframe 单独提出来，不跟随主应用的 vue 渲染，单独渲染，这样，在刚开始下载主应用前端资源之后开始解析 html 的时候就会发现子应用的 iframe，然后直接开始下载子应用前端的资源，这时候主应用还在渲染，等渲染完之后然后通知 app 子应用进行渲染，这样就会快很多，然后通过 `display` 来控制子应用的显示隐藏，下次进入子应用的时候只需要重新 render 即可，不需要再次下载前端资源。
