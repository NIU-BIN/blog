---
category: project
cover: https://cdn.pixabay.com/photo/2025/04/22/09/32/daisy-9549631_1280.jpg
---

# Loading 组件开发

loading 我们一般用于页面等待，或者某个模块需要加载的时候，我们一般会使用 loading 组件。

loading 组件的展示一般分为两种，一种是全局 loading，一种是局部 loading。这两种使用也不一样，全局 loading 我们使用方法调用的方式来使用，局部 loading 我们使用指令调用的方式来使用。

创建如下的结构。

![](http://tuchuang.niubin.site/image/project-20250516-1.png)

## 自定义 v-loading 指令

先思考一下，指令不是组件，所以只要用户引入并 `use` 了组件库，则直接生效，所以我们需要在组件的入口文件 `index.js` 中注册指令。

/packages/components/index.js

```js
import * as components from "./components";
import "@test-ui/theme-chalk/index.less";

const FUNCTION_COMP = ["TMessage"]; // 方法调用类组件
const DIRECTIVE_COMP = ["TLoading"]; // 指令类组件

export default {
  install(app) {
    Object.entries(components).forEach(([key, value]) => {
      if (!FUNCTION_COMP.includes(key)) app.component(key, value);
      if (DIRECTIVE_COMP.includes(key)) app.use(value);
    });
  },
};

export const TMessage = components.TMessage;
export const TLoading = components.TLoading;
```

为什么是 `use`，而不是直接 `app.directive`，然后组件里面直接写自定义指令不就完了，因为我们还有全局的 `loading`，全聚德 `loading` 需要调用方法，所以我们在 `loading` 的组件内部再写 `app.directive`

我们这下来写一下 loading 组件入口文件，因为能被 use，所以是抛出的是一个对象，且携带有 `install` 方法。

```js
import vLoading from "./src/directive.js";

export const TLoading = {
  install(app) {
    app.directive("loading", vLoading);
  },·
  // 后续要写全局的方法在这
};

export default TLoading;
```

loading/src/directive.js

```js
const vLoading = {
  mounted(el, binding) {
    const value = binding.value;
  },
};

export default vLoading;
```

我们画一个简单的 loading，使用 svg 的动画来实现。

loading/src/loading.vue

```vue
<template>
  <div class="'t-loading'">
    <div class="t-loading__spinner">
      <div class="t-loading__spinner-icon">
        <svg width="60" height="30" viewBox="0 0 100 50">
          <circle cx="25" cy="25" r="10" fill="#5e72e4">
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="50" cy="25" r="10" fill="#5e72e4">
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="75" cy="25" r="10" fill="#5e72e4">
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              begin="0.5s"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>
      <div class="t-loading__text">加载中</div>
    </div>
  </div>
</template>

<script setup></script>
```

loading.less

```css
.t-loading {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1001;
  .t-loading__spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;
    color: var(--t-primary);
    text-align: center;
  }
}
```

我们需要在自定义指令中 `mounted` 的时候，将 `loading` 组件挂载到当前元素上，所以我们需要在 `directive.js` 中引入 `loading.vue` 组件，然后通过 `h` 函数生成 `vnode`，然后通过 `render` 方法将组件挂载到当前元素上。

loading/src/directive.js

```js
import TLoadingComponent from "./loading.vue";
import { h, render } from "vue";

const createLoading = (el) => {
  el.style.position = "relative";
  const vnode = h(TLoadingComponent);
  render(vnode, el);
};

const vLoading = {
  mounted(el, binding) {
    const value = binding.value;
    if (value) createLoading(el);
  },
};

export default vLoading;
```

我们来写一个示例看一下

```html
<t-table
  :column-data="columnData"
  :table-data="tableData"
  border
  v-loading="true"
/>
```

![](http://tuchuang.niubin.site/image/project-20250516-2.png)

看起来没问题，但是我们一般情况下给传入一个布尔值，当这个值为 `true` 的时候才显示，`false` 的时候消失，这时候我们需要根据传入值的变化来控制显示和隐藏，这时候我们在 `v-loading` 指令中写一个 `update` 方法，并且当当前组件销毁的时候我们也需要将 `loading` 组件销毁。

```js
import TLoadingComponent from "./loading.vue";
import { h, render } from "vue";

const createLoading = (el) => {
  el.style.position = "relative";
  const vnode = h(TLoadingComponent);
  render(vnode, el);
};

const vLoading = {
  mounted(el, binding) {
    const value = binding.value;
    if (value) createLoading(el);
  },
  updated(el, binding) {
    if (!binding.value && binding.value !== binding.oldValue) {
      el.removeChild(el.querySelector(".t-loading"));
    } else if (binding.value && binding.value !== binding.oldValue) {
      createLoading(el);
    }
  },
  unmounted(el) {
    el.removeChild(el.querySelector(".t-loading"));
  },
};

export default vLoading;
```

我们只要发现绑定的值第一次生成的时候是正常的，然后变为 `false`，`loading` 消失，然后重新改变为 `true` 的时候组件不会重新生成了或者说新生成的组件没有在界面渲染，是因为什么呢？因为仅使用 removeChild 移除 DOM 节点不会触发 Vue 的生命周期钩子，导致组件实例仍然存在并保持对 DOM 的引用。这时候怎么处理呢？

```js
import TLoadingComponent from "./loading.vue";
import { h, render } from "vue";

const createLoading = (el) => {
  el.style.position = "relative";
  const vnode = h(TLoadingComponent);
  render(vnode, el);
};

const vLoading = {
  mounted(el, binding) {
    const value = binding.value;
    if (value) createLoading(el);
  },
  updated(el, binding) {
    if (!binding.value && binding.value !== binding.oldValue) {
      el.removeChild(el.querySelector(".t-loading"));
      render(null, el);
    } else if (binding.value && binding.value !== binding.oldValue) {
      createLoading(el);
    }
  },
  unmounted(el) {
    el.removeChild(el.querySelector(".t-loading"));
    render(null, el);
  },
};

export default vLoading;
```

这时候试一下呢？是不是正常了，你会发现我们添加了一个 `render(null, el)`，这个作用就是将上次的 `loading` 组件销毁。

## 补充属性

我们一般情况下需要自定义加载内容，以及加载的背景色，这时候怎么怎么传递呢？我们看一下 `element-plus`，打开 F12，你会发现他的属性实际是在 `DOM` 节点上插入的自定义属性，但是是非标准的自定义属性，因为自定义属性是必须 `data-` 开头，获取可以直接通过 `DOM.dateset.[属性名]`来获取，那这种非标准的怎么获取属性值呢？我们可以通过 `getAttribute(属性名) `来获取，这下知道怎么做也简单了。

```html
<t-table
  :column-data="columnData"
  :table-data="tableData"
  border
  v-loading="loading"
  loading-text="等待中"
  loading-background="rgba(122, 122, 122, 0.6)"
/>
```

我们在 `createLoading` 的方法中获取一下属性值，然后传递给组件

packages/loading/src/directive.js

```js
const createLoading = (el) => {
  el.style.position = "relative";
  const vnode = h(TLoadingComponent, {
    text: el.getAttribute("loading-text"),
    background: el.getAttribute("loading-background"),
  });
  render(vnode, el);
};
```

然后我们在 loading 组件内部获取一下组件

```vue
<template>
  <div
    class="'t-loading'"
    :style="{
      'background-color': background,
    }"
  >
    <div class="t-loading__spinner">
      <div class="t-loading__spinner-icon">
        <svg width="60" height="30" viewBox="0 0 100 50">
          <!-- ... -->
        </svg>
      </div>
      <div class="t-loading__text" v-if="text">{{ text }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
  },
  background: {
    type: String,
  },
});
</script>
```

![](http://tuchuang.niubin.site/image/project-20250516-3.png)

## 全屏加载

全屏加载我们可以使用调用方法来生成组件，我们可以抛出去一个方法，使用者可以使用这个方法来生成一个 `loading` 组件，然后这个方法返回一个操作 `loading` 的一个对象，这个对象包含关闭当前 `loading` 的方法，`element-plus` 是引入 ElMessage，然后通过 `ElLoading.service()` 传入一个 `loading` 的配置对象来显示组件，那我们可以在 `loading` 的入口文件中 `export` 一个 `service` 方法就行就行，然后 `service` 方法返回一个对象，包含关闭的方法。

```js
import TLoadingComponent from "./loading.vue";
import { h, render } from "vue";

const createLoading = (el) => {
  el.style.position = "relative";
  const vnode = h(TLoadingComponent, {
    text: el.getAttribute("loading-text"),
    background: el.getAttribute("loading-background"),
  });
  render(vnode, el);
};

const vLoading = {
  mounted(el, binding) {
    const value = binding.value;
    if (value) createLoading(el);
  },
  updated(el, binding) {
    if (!binding.value && binding.value !== binding.oldValue) {
      el.removeChild(el.querySelector(".t-loading"));
      render(null, el);
    } else if (binding.value && binding.value !== binding.oldValue) {
      createLoading(el);
    }
  },
  unmounted(el) {
    el.removeChild(el.querySelector(".t-loading"));
    render(null, el);
  },
};

export const createGlobalLoading = ({ text, background }) => {
  let vnode = h(TLoadingComponent, {
    text,
    loadingBackground: background,
    screen: true, // 是否全屏
  });
  window.document.body.classList.add("t-loading-screen-parent");
  render(vnode, window.document.body);
  return {
    close() {
      window.document.body.removeChild(vnode.el);
      render(null, window.document.body); // 该代码作用是清除vnode
      vnode = null;
    },
  };
};

export default vLoading;
```

我们在给 loading 组件添加一个 `screen` 属性，如果 `screen` 为 `true`，则全屏显示，否则在绑定的元素上显示，我们也需要设置一个全屏加载的一个 `class`，来单独设置全屏加载的样式。

```vue
<template>
  <div
    :class="['t-loading', { 't-loading-mask--screen': screen }]"
    :style="{
      'background-color': background,
    }"
  >
    <div class="t-loading__spinner">
      <div class="t-loading__spinner-icon">
        <svg width="60" height="30" viewBox="0 0 100 50">
          <!-- ... -->
        </svg>
      </div>
      <div class="t-loading__text" v-if="text">{{ text }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
  },
  background: {
    type: String,
  },
  screen: {
    type: Boolean,
  },
});
</script>
```

loading.less

```less
.t-loading-mask--screen {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1001;
  pointer-events: none;
}
```

我们写一个试试

```html
<template>
  <t-button type="primary" @click="openFullScreenLoading"> 全屏加载 </t-button>
</template>
<script setup>
  import { TLoading } from "@test-ui/components";

  const openFullScreenLoading = () => {
    const loading = TLoading.service({
      text: "全屏加载",
      background: "rgba(0, 0, 0, 0.7)",
    });

    setTimeout(() => {
      loading.close();
    }, 3000);
  };
</script>
```

![](http://tuchuang.niubin.site/image/project-20250516-4.png)

目前是正常的，但是细心的小伙伴会发现这个遮罩层是可以触发底部滚动的，那怎么解决呢？我们可以在触发全屏加载的时候给 body 设置一个 `overflow: hidden`，在关闭的时候再移除这个样式，我们可以给 body 添加一个类名来设置样式，然后关闭的时候移除掉这个类名。

```js
export const createGlobalLoading = ({ text, background }) => {
  let vnode = h(TLoadingComponent, {
    text,
    loadingBackground: background,
    screen: true,
  });
  window.document.body.classList.add("t-loading-screen-parent");
  render(vnode, window.document.body);
  return {
    close() {
      window.document.body.classList.remove("t-loading-screen-parent");
      window.document.body.removeChild(vnode.el);
      render(null, window.document.body); // 该代码作用是清除vnode
      vnode = null;
    },
  };
};
```

```less
.t-loading-screen-parent {
  overflow: hidden !important;
}
```

这样就完成了。

## 自定义图标

我们有时候想要吧加载的动画换一下，这个实现也比较容易，element 是把动画做在了组件内部，你只需要改变组件的图表即可，我们这边是在 svg 里面实现的动画图标，如果你想和 element-plus 一样，你就只需要 spinner 添加 css 动画即可，这边我们就不写了。给我们可以同样使用自定义属性传递 svg 图表，然后在生成 loading 组件的时候获取，然后在组件内部渲染即可。

```html
<template>
  <t-table
    :column-data="columnData"
    :table-data="tableData"
    border
    v-loading="loading"
    loading-text="loading..."
    :loading-spinner="loadingSVG1"
    style="margin-top: 20px"
  />
  <t-button
    type="primary"
    style="margin-top: 20px"
    @click="openFullScreenLoading2"
  >
    全屏加载自定义图标
  </t-button>
</template>
<script setup>
  const loadingSVG1 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42" width="42" height="42">
  <circle cx="21" cy="21" r="5" fill="none" stroke="#5e72e4" stroke-width="2">
    <animate attributeName="r" from="5" to="18" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" from="1" to="0" dur="1.5s" repeatCount="indefinite"/>
  </circle>
  <circle cx="21" cy="21" r="5" fill="none" stroke="#5e72e4" stroke-width="2">
    <animate attributeName="r" from="5" to="18" dur="1.5s" begin="0.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" from="1" to="0" dur="1.5s" begin="0.5s" repeatCount="indefinite"/>
  </circle>
</svg>
`;
  const loadingSVG2 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42" width="42" height="42">
  <circle cx="21" cy="21" r="18" fill="none" stroke="#5e72e4" stroke-width="3" stroke-dasharray="5,5">
    <animate attributeName="stroke-dashoffset" from="0" to="20" dur="1s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
  </circle>
</svg>
`;

  const openFullScreenLoading2 = () => {
    const loading = TLoading.service({
      text: "全屏加载",
      background: "rgba(0, 0, 0, 0.7)",
      loadingSpinner: loadingSVG2,
    });

    setTimeout(() => {
      loading.close();
    }, 3000);
  };
</script>
```

然后我们改一下

packages/loading/src/directive.js

```js
import TLoadingComponent from "./loading.vue";
import { h, render } from "vue";

const createLoading = (el) => {
  el.style.position = "relative";
  const vnode = h(TLoadingComponent, {
    text: el.getAttribute("loading-text"),
    background: el.getAttribute("loading-background"),
    icon: el.getAttribute("loading-spinner"),
  });
  render(vnode, el);
};

const vLoading = {
  mounted(el, binding) {
    const value = binding.value;
    if (value) createLoading(el);
  },
  updated(el, binding) {
    if (!binding.value && binding.value !== binding.oldValue) {
      el.removeChild(el.querySelector(".t-loading"));
      render(null, el);
    } else if (binding.value && binding.value !== binding.oldValue) {
      createLoading(el);
    }
  },
  unmounted(el) {
    el.removeChild(el.querySelector(".t-loading"));
    render(null, el);
  },
};

export const createGlobalLoading = ({ text, background, loadingSpinner }) => {
  let vnode = h(TLoadingComponent, {
    text,
    loadingBackground: background,
    screen: true,
    icon: loadingSpinner,
  });
  window.document.body.classList.add("t-loading-screen-parent");
  render(vnode, window.document.body);
  return {
    close() {
      window.document.body.classList.remove("t-loading-screen-parent");
      window.document.body.removeChild(vnode.el);
      render(null, window.document.body); // 该代码作用是清除vnode
      vnode = null;
    },
  };
};

export default vLoading;
```

packages/loading/src/loading.vue

```vue
<template>
  <div
    :class="['t-loading', { 't-loading-mask--screen': screen }]"
    :style="{
      'background-color': background,
    }"
  >
    <div class="t-loading__spinner">
      <div class="t-loading__spinner-icon" v-if="!icon">
        <svg width="60" height="30" viewBox="0 0 100 50">
          <circle cx="25" cy="25" r="10" fill="#5e72e4">
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="50" cy="25" r="10" fill="#5e72e4">
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="75" cy="25" r="10" fill="#5e72e4">
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              begin="0.5s"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>
      <div v-else v-html="icon"></div>
      <div class="t-loading__text" v-if="text">{{ text }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
  },
  background: {
    type: String,
  },
  screen: {
    type: Boolean,
  },
  icon: {
    type: String,
  },
});
</script>
```

![](http://tuchuang.niubin.site/image/project-20250516-4.png)

丸美！
