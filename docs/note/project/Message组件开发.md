---
category: project
cover: https://cdn.pixabay.com/photo/2023/12/16/00/06/mountain-8451604_640.jpg
---

# Message 组件开发

在开发之前依旧带大家来思考一下整体的设计、布局、触发方式和需要注意的问题

1. 使用方法触发（非组件直接注册在 template 中使用）
2. 不受外界样式影响（比如父级 overflow：hidden 等）
3. message 显示的存在有一定的时间，并且每个触发后 message 的位置是依次从上往下排列，且上个消失后自动上移
4. 不同状态
5. 存在的时间可以自定义
6. 可关闭

基本大致就这些，开始，一步步带着问题去思考和开发

先来创建文件，结构依旧是跟之前 Button 组件一致

![](http://tuchuang.niubin.site/image/project-20241125-1.png)

## 外观样式

我们先实现一下大概的样子，这块简单，直接上代码

message.vue

```vue
<template>
  <div class="t-message">
    <i :class="t-icon icon-success-filling"></i>
    <span class="t-message__text">{{ message }}</span>
    <i class="t-icon icon-close-bold t-message_close_icon" @click="close"></i>
  </div>
</template>

<script setup>
import { Props } from "./message";

defineProps(Props);

const close = () => {};
</script>
```

这边我们定义了类型、消息内容、是否可关闭、显示时间（默认 3 秒）

message.js

```js
const MESSAGE_TYPE = ["success", "info", "warning", "error"];

export const Props = {
  type: {
    type: String,
    default: "",
    validator(value) {
      return MESSAGE_TYPE.includes(value);
    },
  },
  message: {
    type: String,
    default: "",
  },
  showClose: {
    type: Boolean,
    default: false,
  },
  duration: {
    type: Number,
    default: 3000,
  },
};
```

到了样式，先别急，我们一般会直接`position: fixed`，但是父级出现 `overflow：hidden`等问题的时候会受到印象。还记得我们之前有节讲过 element-plus 他们都是怎么做的吗，他们是在我们 html 中 vue 渲染的的 `#app` 节点的同级创建了一个 div，在其中放着我们的 `message` 渲染后的 html，所以我们需要先创建我们的组件，然后通过 js 操作 dom 的方式 append 到我们指定 0 的位置，这样 vue 中渲染的一些 dom 以及样式跟我们 message 无关

## 组件创建和渲染

为了解决上述问题，我们得先来了解一些关键的 api，Vue 提供了一些方法，用于创建 vnode 和虚拟 dom 的渲染

[h 函数](https://cn.vuejs.org/api/render-function.html#h) 创建虚拟 DOM 节点 (vnode)

[render](https://cn.vuejs.org/api/options-rendering.html#render) render 是字符串模板的一种替代，可以使你利用 JavaScript 的丰富表达力来完全编程式地声明组件最终的渲染输出。（你就可以理解为吧 vnode 渲染在 html 中）

核心方法这两个，具体 api 地址已经给了，我觉得官网已经说的很清楚，就不做过多解释

思路：我们需要将 vue 文件中的代码使用 `h` 函数创建为 `vnode`，然后我们通过 js 创建一个放这类 message dom 的 div 容器（也可以不要 div 这个容器，为了避免以后各种组件导致太多难以管理和区分），我们再使用 render 方法将 vnode 在我们刚才创建的这个容器中渲染，大致组件创建就是这么个思路，废话不多说，上代码

index.js

```js
import Message from "./src/message.vue";
import { h, render } from "vue";

export const TMessage = (config) => {
  const VNode = h(Message, {
    ...config,
  });
  const container = document.createElement("div");
  container.setAttribute("class", "t-message-container");
  document.body.append(container);
  container.style.top = "50px";
  render(VNode, container);
};

export default TMessage;
```

来来来 💥，先看这，带 hxdm 理解一下，我们在使用组件的时候是直接调用方法，所以我们需要抛出去一个函数，但是函数中我们穿了一个对象，还记得 element-plus 的 message 吗

```js
ElMessage({
  showClose: true,
  message: "Congrats, this is a success message.",
  type: "success",
});
```

所以这个地方我们需要接收一个 `config`，这里面包含用户对这个组件的配置，有类型、信息、是否关闭、停留时长等，这时候有小伙伴问那传入到组件的这个 `config` 怎么获取呢，他其实就是通用过 `h` 函数转成我们的 props，我们就可以在 props 中接收了，丸美；然后我们创建了一个 div，然后我们让 message 相对 html 或者 body 绝对定位就好了。

到这里问题一下子就明朗了起来，别急，还有我们需要注意的一个点，就是依次从上往下排列，且一个消失其他都要重新更改位置

我们来写一下注册这块，回到我们的 `packages/components/components.js` 和入口 `packages/components/index.js`

components.js

```js
export { TButton } from "./button";
export { TMessage } from "./message";
```

index.js

```js
import * as components from "./components";

const FUNCTION_COMP = ["TMessage"];

export default {
  install(app) {
    Object.entries(components).forEach(([key, value]) => {
      if (!FUNCTION_COMP.includes(key)) app.component(key, value);
    });
  },
};

export const TMessage = components.TMessage;
```

这样就可以在我们示例中使用了

```js
import { ref } from "vue";
import { TMessage } from "@test-ui/components";

const handleMessage = () => {
  TMessage({
    type: "success",
    message: "hahahahaha",
  });
};
```

## 组件的销毁和位置的确定

我们需要一个数组来收集我们目前创建的 message 组件，然后我们需要封装一个定时器，时间为 config 传入的时间，在结束的时候销毁我们的组件，并且遍历我们收集的 message 组件的数据重新调整我们的位置

```js
import Message from "./src/message.vue";
import { h, render } from "vue";

let messageInstaceList = [];

const MESSAGE_START_TOP = 56; // 起始的高度
const MESSAGE_HEIGHT = 44; // 组件高度
const MESSAGE_GAP = 16; // 间隔高度

const setDestoryClock = (element, time = 3000) => {
  setTimeout(() => {
    destoryMessageElement(element);
  }, time);
};

const destoryMessageElement = (element) => {
  if (!element.parentElement?.contains(element)) return;
  element.parentElement?.removeChild(element);
  messageInstaceList = messageInstaceList.filter((item) => item !== element);
  messageInstaceList.forEach((item, index) => {
    item.style.top = MESSAGE_START_TOP + index * (MESSAGE_HEIGHT + MESSAGE_GAP) + "px";
  });
};

export const TMessage = (config) => {
  const VNode = h(Message, {
    ...config,
  });
  const container = document.createElement("div");
  container.setAttribute("class", "t-message-container");
  document.body.append(container);
  messageInstaceList.push(container);
  container.style.top =
    MESSAGE_START_TOP + (messageInstaceList.length - 1) * (MESSAGE_HEIGHT + MESSAGE_GAP) + "px";
  render(VNode, container);
  setDestoryClock(container, config.duration);
};

export default TMessage;
```

我们在组件创建的时候触发定时器，并添加进我们收集的数组，根据我们数组的长度我们来计算新的 message 组件的 top，然后等定时器结束的时候我们触发销毁指定的组件，且我们重新计算剩余组件的位置

## 组件的其他功能以及优化

我们完善一下不同类型的显示，我们根据类型需要更改样式、图标

```vue
<template>
  <div class="t-message" :class="`t-message__${type}`">
    <i :class="`t-icon icon-${MESSAGE_ICON_NAME[type]}`"></i>
    <span class="t-message__text">{{ message }}</span>
    <i class="t-icon icon-close-bold t-message_close_icon" v-if="showClose"></i>
  </div>
</template>

<script setup>
import { Props } from "./message";

defineProps(Props);

const MESSAGE_ICON_NAME = {
  success: "success-filling",
  info: "prompt-filling",
  warning: "warning-filling",
  error: "delete-filling",
};
</script>
```

我们需要在关闭的时候触发当前组件的销毁，这时候我们可以 `emit` 一个方法，然后使用我们 `message/index.js` 中的 `destoryMessageElement` 方法销毁实例

```vue
<template>
  <div class="t-message" :class="`t-message__${type}`">
    <i :class="`t-icon icon-${MESSAGE_ICON_NAME[type]}`"></i>
    <span class="t-message__text">{{ message }}</span>
    <i class="t-icon icon-close-bold t-message_close_icon" v-if="showClose" @click="close"></i>
  </div>
</template>

<script setup>
import { getCurrentInstance } from "vue";
import { Props } from "./message";

defineProps(Props);

const emit = defineEmits(["close"]);

const MESSAGE_ICON_NAME = {
  success: "success-filling",
  info: "prompt-filling",
  warning: "warning-filling",
  error: "delete-filling",
};

const instance = getCurrentInstance();

const close = () => {
  emit("close", instance.vnode.el.parentElement);
};
</script>
```

message/index.js

```js
import Message from "./src/message.vue";
import { h, render } from "vue";

let messageInstaceList = [];

const MESSAGE_START_TOP = 56; // 起始的高度
const MESSAGE_HEIGHT = 44; // 组件高度
const MESSAGE_GAP = 16; // 间隔高度

const setDestoryClock = (element, time = 3000) => {
  setTimeout(() => {
    destoryMessageElement(element);
  }, time);
};

const destoryMessageElement = (element) => {
  if (!element.parentElement?.contains(element)) return;
  element.parentElement?.removeChild(element);
  messageInstaceList = messageInstaceList.filter((item) => item !== element);
  messageInstaceList.forEach((item, index) => {
    item.style.top = MESSAGE_START_TOP + index * (MESSAGE_HEIGHT + MESSAGE_GAP) + "px";
  });
};

export const TMessage = (config) => {
  const VNode = h(Message, {
    ...config,
    onClose(element) {
      destoryMessageElement(element); // 关闭时销毁
    },
  });
  const container = document.createElement("div");
  container.setAttribute("class", "t-message-container");
  document.body.append(container);
  messageInstaceList.push(container);
  container.style.top =
    MESSAGE_START_TOP + (messageInstaceList.length - 1) * (MESSAGE_HEIGHT + MESSAGE_GAP) + "px";
  render(VNode, container);
  setDestoryClock(container, config.duration);
};

export default TMessage;
```

message.less

```css
.t-message-container {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  transition: all 0.35s;
}

.slideY-fade-enter-active,
.slideY-fade-leave-active {
  transition: all 10s ease;
}
.slideY-fade-enter-from,
.slideY-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -100%);
}

@keyframes fadeIn {
  0% {
    transform: translateY(-30px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.t-message {
  padding: 0 30px 0 12px;
  min-width: 260px;
  min-height: 44px;
  line-height: 44px;
  border-radius: 6px;
  animation: fadeIn 0.3s;
  .t-message__text {
    margin-left: 10px;
    font-size: 14px;
  }
  .t-message_close_icon {
    position: absolute;
    right: 10px;
    font-size: 12px;
    cursor: pointer;
  }
  &.t-message__success {
    background-color: var(--t-success-lighten);
    border: 1px solid var(--t-success-border);
    color: var(--t-success);
  }
  &.t-message__info {
    background-color: var(--t-info-lighten);
    border: 1px solid var(--t-info-border);
    color: var(--t-info);
  }
  &.t-message__warning {
    background-color: var(--t-warning-lighten);
    border: 1px solid var(--t-warning-border);
    color: var(--t-warning);
  }
  &.t-message__error {
    background-color: var(--t-danger-lighten);
    border: 1px solid var(--t-danger-border);
    color: var(--t-danger);
  }
}
```

## 使用和测试

```vue
<template>
  <!-- message -->
  <h2>消息</h2>
  <h3>Message</h3>
  <t-button type="success" @click="handleMessage('success')">success</t-button>
  <t-button type="info" @click="handleMessage('info')">info</t-button>
  <t-button type="warning" @click="handleMessage('warning')">warning</t-button>
  <t-button type="danger" @click="handleMessage('error')">danger</t-button>
  <h3>Message close</h3>
  <t-button type="success" @click="handleMessage('success', true)">success</t-button>
  <t-button type="info" @click="handleMessage('info', true)">info</t-button>
  <t-button type="warning" @click="handleMessage('warning', true)">warning</t-button>
  <t-button type="danger" @click="handleMessage('error', true)">danger</t-button>
  <h3>Message time</h3>
  <t-button type="success" @click="handleMessage('success', true, 1000)">1s</t-button>
  <t-button type="success" @click="handleMessage('success', true, 5000)">5s</t-button>
</template>
<script setup>
import { ref } from "vue";
import { TMessage } from "@test-ui/components";

const handleMessage = (type, showClose, time) => {
  TMessage({
    type,
    message: type,
    showClose,
    duration: time,
  });
};
</script>
```

来点击测试一下，如下：

![](http://tuchuang.niubin.site/image/project-20241125-2.png)

丸美

> ✨ [本专栏源码地址](https://github.com/NIU-BIN/test-ui)
