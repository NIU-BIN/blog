---
category: project
cover: https://cdn.pixabay.com/photo/2023/12/16/00/06/mountain-8451604_640.jpg
---

# Steps 组件开发

再开始之前我们需要考虑一下步骤条相关规则。

1. 步骤不能少于两个
2. 步骤有完成状态、准备状态、未开始状态

在这两个规则的前提下我们开始开发。

## 创建组件和样式文件

我们一般情况下使用步骤条都会在每个步骤条中放置一些额外的信息，如果我们封装为一个组件，然后通过属性来让用户传入想要展示的额外信息就有很大的局限性，为此，我们可以采用插槽的方式，让用户自定义展示内容，这样我们需要给每一个步骤去设置我们自定义的模块，所以我们可以将组件拆分为两部分，一部分是步骤条 `Steps`，一部分是步骤条中的每一个步骤 `Step`。

我们创建如图所示的组件目录结构。因为使用者是直接可以使用我们每个步骤的组件，所以我们分开创建两个组件。

> ps. 上节我们的 `tree` 组件是为了在开发过程中方便实现和管理而创建的 `tree-node`，并不暴露给使用者，所以我们不是分开创建的。

![](http://tuchuang.niubin.site/image/project-20250108-1.png)

我们大概需要这样使用

```html
<t-steps :active="active">
  <t-step title="第一步" description="打开微信扫一扫" />
  <t-step title="第二步" description="添加好友" />
  <t-step title="第三步" description="选择我的头像" />
  <t-step title="第四步" description="转款1000万" />
</t-steps>
```

所以我们的 `Steps` 组件需要有一个插槽来接收 `Step` 组件，并且我们需要一个 `active` 属性来控制当前步骤的状态

steps.js

```js
export const StepsProps = {
  active: {
    type: Number,
    default: 0,
  },
};
```

steps.vue

```html
<template>
  <div class="t-steps">
    <slot></slot>
  </div>
</template>
<script setup>
  import { StepsProps } from "./steps";

  const props = defineProps(StepsProps);

  defineOptions({
    name: "t-steps",
  });
</script>
```

对应我们需要做一下每一个步骤的组件 `Step`

Step.js

```js
export const StepProps = {
  title: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
};
```

Step.vue

```html
<template>
  <div class="t-step">
    <div class="t-step__head">
      <span class="t-step__icon t-icon"> 1 </span>
      <div class="t-step__line"></div>
    </div>
    <div class="t-step__content">
      <div class="t-step__title">{{ title }}</div>
      <div class="t-step__description">{{ description }}</div>
    </div>
  </div>
</template>
<script setup>
  import { StepProps } from "./step";

  const props = defineProps(StepProps);

  defineOptions({
    name: "t-step",
  });
</script>
```

样式如下

```less
.t-steps {
  display: flex;
}

.t-step {
  flex: 1;
  .t-step__head {
    width: 100%;
    display: flex;
    align-items: center;
    .t-step__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      text-align: center;
      border: 2px solid #333;
      border-radius: 50%;
      color: #333;
      background-color: #fff;
    }
    .t-step__line {
      height: 2px;
      flex: 1;
      background-color: #888;
    }
  }
  .t-step__content {
    margin: 6px 0;
    width: 100%;
    color: #333;
    .t-step__title {
      font-size: 16px;
    }
    .t-step__description {
      margin-top: 6px;
      font-size: 12px;
    }
  }
}
```

我们先来看一下效果

![](http://tuchuang.niubin.site/image/project-20250108-2.png)

## 步骤条序号

我们在使用步骤条的时候默认展示我们当前步骤的序号，该序号与我们在 `steps` 中传入的顺序对应，那该如何在 `step` 组件中知道我在 `steps` 中是第几位呢？

这个问题是当前组件设计的核心问题，Vue 在渲染虚拟 dom 的时候会在每一个节点上添加一个 `uid`，我们可以通过这个 `uid` 来确定当前组件在 `steps` 组件中的位置，然后通过这个位置来确定当前组件的序号。这个 `uid` 我们该怎么获取呢？

我们可以通过 Vue 的 `getCurrentInstance` 方法获取到当前的实例对象，我们可以通过虚拟 dom 节点获取到默认的插槽的节点，因为插槽是可以传递任意 dom 的，但我们只需要 `t-step` 组件的节点，所以我们需要过滤一下，然后通过 `provide` 和 `inject` 将这个方法传入到 `t-step` 组件中，就可以找到当前的 `t-step` 组件在 `t-steps` 组件插槽中的位置了，具体实现如下：

steps.vue

```js
import { onMounted, provide, ref, getCurrentInstance } from "vue";
import { StepsProps } from "./steps";

const props = defineProps(StepsProps);

defineOptions({
  name: "t-steps",
});

const stepsUids = ref([]);

onMounted(() => {
  getStepUids();
});

const getStepUids = () => {
  const instance = getCurrentInstance();
  const defaultSlots = instance.subTree.children.find((t) => t.key === "_default");
  if (defaultSlots) {
    stepsUids.value = defaultSlots.children
      .filter((vnode) => vnode.type.name === "t-step")
      .map((v) => v.component.uid);
  }
};

provide("stepsUids", stepsUids);
provide("getStepUids", getStepUids);
```

step.vue

```html
<template>
  <div class="t-step">
    <div class="t-step__head">
      <span class="t-step__icon t-icon"> {{ currentIndex + 1 }}</span>
      <div class="t-step__line"></div>
    </div>
    <div class="t-step__content">
      <div class="t-step__title">{{ title }}</div>
      <div class="t-step__description">{{ description }}</div>
    </div>
  </div>
</template>
<script setup>
  import { ref, inject, computed, getCurrentInstance } from "vue";
  import { StepProps } from "./step";

  const props = defineProps(StepProps);

  defineOptions({
    name: "t-step",
  });
  const instance = getCurrentInstance();
  const stepsUids = inject("stepsUids");

  const currentIndex = computed(() => {
    return stepsUids.value.findIndex((uid) => uid === instance.uid);
  });
</script>
```

这下我们来看一下效果

![](http://tuchuang.niubin.site/image/project-20250108-3.png)

丸美！

> 这块存在一个问题，在我们开发 `step` 组建的时候由于 vue 是热更新的，所以每次我们修改代码的时候，`uid` 都会改变，每次都需要重新刷新一下让 `steps` 获取一下最新的 `uid`集合，当然这个问题只会在我们开发 step 组件的时候存在，在使用这个组件的时候是不存在的，虽然使用不影响，但是开发的时候很别扭，那有没有办法解决呢？我们可否在 step 组件中在 `mounted` 的时候获取一下 `steps` 组件默认插槽下 `step` 的 `uid` 呢？这个留给大家去探索。

我们在刚开始的时候说有节点有完成、准备、未开始三种状态，我们把未开始作为基础的样式，所以我们可以定义两个类名，`is_complete`、`is_begining`，我们来完善一下

```html
<template>
  <div
    class="t-step"
    :class="{
      is_complete: (currentIndex || 0) <= active - 1,
      is_begining: (currentIndex || 0) === active,
    }"
  >
    <!-- ... -->
  </div>
</template>
<script setup>
  import { ref, inject, computed, getCurrentInstance } from "vue";
  import { StepProps } from "./step";

  const props = defineProps(StepProps);

  defineOptions({
    name: "t-step",
  });
  const instance = getCurrentInstance();
  const stepsUids = inject("stepsUids");
  const active = inject("active");

  const currentIndex = computed(() => {
    return stepsUids.value.findIndex((uid) => uid === instance.uid);
  });
</script>
```

step.less

```less
.t-step {
  flex: 1;
  &.is_complete {
    .t-step__icon {
      background-color: var(--t-primary);
      color: #fff;
      border-color: var(--t-primary);
    }
    .t-step__title {
      color: var(--t-primary);
    }
    .t-step__line {
      background-color: var(--t-primary);
    }
  }
  &.is_begining {
    .t-step__icon {
      color: var(--t-primary);
      border-color: var(--t-primary);
    }

    .t-step__line {
      background-color: var(--t-primary);
    }
  }
}
```

我们写一个时间，点击按钮 active+1，看看效果

> ps. 这块有个小问题，我们 `provide` 传递的` props.active` 是非响应式的，所以我们在 `step` 组件中获取的 `active` 值是初始值，这块我们可以通过 `computed` 来处理一下，这块就不展开了

```js
const active = computed(() => props.active);

provide("active", active);
```

![](http://tuchuang.niubin.site/image/project-20250108-4.png)

这下我们基本的 `steps` 组件算是完成了，我们再来添加一下别的功能

## 居中的步骤条

我们设置一个 `align` 属性，来控制步骤条是居中还是靠左

steps.js

```js
const STEPS_ALIGN = ["start", "center"];

export const StepsProps = {
  active: {
    type: Number,
    default: 0,
  },
  align: {
    type: STEPS_ALIGN,
    default: "start",
    validator(value) {
      return STEPS_ALIGN.includes(value);
    },
  },
};
```

将 `active` 传入 `step` 组件

step.vue

```html
<template>
  <div
    class="t-step"
    :class="{
      is_complete: (currentIndex || 0) <= active - 1,
      is_begining: (currentIndex || 0) === active,
      't-step__center': align === 'center',
    }"
  >
    <!-- ... -->
  </div>
</template>
<script setup>
  import { ref, inject, computed, getCurrentInstance } from "vue";
  import { StepProps } from "./step";

  const props = defineProps(StepProps);

  defineOptions({
    name: "t-step",
  });
  const instance = getCurrentInstance();
  const stepsUids = inject("stepsUids");
  const active = inject("active");
  const align = inject("align");

  const currentIndex = computed(() => {
    return stepsUids.value.findIndex((uid) => uid === instance.uid);
  });
</script>
```

接下来就是设置样式了，也很简单。

![](http://tuchuang.niubin.site/image/project-20250108-5.png)

我们可以看出，我们只需要 `.t-step__head` 往右移动一半，然后再往左移动我们序号宽度的一半即可

```less
.t-step {
  flex: 1;
  // ...
  &.t-step__center {
    .t-step__head {
      transform: translateX(calc(50% - 13px));
    }
    .t-step__content {
      text-align: center;
    }
  }
}
```

这时候你看大体差不多，但是存在一个问题，就是我们这么设置了等于整体往右平移了，就会导致页面会加宽一个步骤的一半，这时候有人会说直接父级 `overflow:hidden` 不就行了，当然也不是不行，我们应该规范一些去设置，我们可以单独给最后一项步骤做一个处理。

step.vue

```html
<template>
  <div
    class="t-step"
    :class="{
      is_complete: (currentIndex || 0) <= active - 1,
      is_begining: (currentIndex || 0) === active,
      't-step__center': align === 'center',
      is_last_step: currentIndex === stepsUids.length - 1,
    }"
  >
    <!-- .... -->
  </div>
</template>
<script setup>
```

step.less

```less
.t-step {
  flex: 1;
  // ...
  &.t-step__center.is_last_step {
    display: flex;
    flex-direction: column;
    justify-content: center;
    .t-step__head {
      display: flex;
      justify-content: center;
      transform: translateX(0);
    }
  }
}
```

这下就丸美了

![](http://tuchuang.niubin.site/image/project-20250108-6.png)

## 自定义图标
