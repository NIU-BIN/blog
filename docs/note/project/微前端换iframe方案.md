# 微前端换 iframe 方案

在某个 Vue3 项目中，需要将已有的平台合并进新的平台，由于代码迁移太过繁琐，于是最先想到的就是微前端方案，但是碰到了许多问题，最终还是放弃了。

- qiankun
  起初之前在 vue2 项目中使用过阿里的[qiankun](https://qiankun.umijs.org/zh)，所以这次也是打算使用，但是在 vite 构建的 vue3 项目中出现了一些问题，官网的文档依旧很老旧，vue3 迟迟没有更新，并且对于 vite 的支持较差，目前已经有了方案，有大佬已经开发了支持 vite 的插件 `vite-plugin-qianku`。

  最恼人的还是样式隔离问题，官方提供了沙箱 sandbox 来解决，但是启用严格模式的样式隔离时，虽然父子应用得到了隔离，但是子应用的样式文件直接作用到父应用，子应用样式丢失，也想了很多方法，使用了一些`change-prefix-loader`改变 class 的前缀来防止不同应用中的样式污染，但是组件库却碰到了一些问题，最后彻底放弃了

- wujie
  看到了京东物流的[wujie](https://wujie-micro.github.io/doc/)，基于 `WebComponent` 容器 + `iframe` 沙箱解决，在样式隔离方面是优点，但是遇到了偶尔渲染失败，渲染异常的问题。无界的文章相对较少，自己也没有排查到问题，因此也放弃了

- iframe
  本来也想再试试其他微前端方案的，但是时间不够，我知道会有很多的坑需要趟，考虑了一下场景，决定使用 `iframe`，我们都知道 iframe 虽然用起来方便，样式可以说完全隔离，但是带来的问题也很多，比如每次进入都需要重新拉取子应用资源、路由刷新回到初始的 src 的 path、通信、加载慢、遮罩层问题等等，下面我来说一下我的处理

## 通信与数据共享

在同源的情况下，我们可以使用 `postMessage` 和监听 `message` 来解决通讯，通过同源的 `localStorage`、`sessionStorage`来共享数据。

主应用：

```vue
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

```vue
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

这个问题可以解决，也可以不用管，具体看你们的需求是否需要让 url 也变化，废话不多说，我们还是要解决一下。

如果我们需要使用 location 直接改变，他也会重新刷新页面，所以串通的 location 是行不通的，这时候，我们需要了解一下[History 接口](https://developer.mozilla.org/zh-CN/docs/Web/API/History)

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

接下来就是当前更改的路径刷新的问题了，直接访问你更改的路径会 404 的，因为在你的主应用的路由中没有注册这个路径，这时候我们需要在路由守卫去处理。我们根据当前的路径在子应用的路由表数据中递归一次，看是否属于子应用菜单，如果是，那直接跳转对应子应用的入口路由（这边的入口路由就是主应用中渲染子应用的页面的路径）

> 注意，这边的匹配可以在 404 的时候再去匹配，这样会减少匹配的次数，不需要每次都递归一次查看是否匹配
