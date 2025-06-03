---
category: project
cover: https://cdn.pixabay.com/photo/2025/02/12/10/55/cat-9401282_1280.jpg
---

# Collapse 组件开发

本节我们来做折叠面板组件的开发，通过折叠面板收纳内容区域，在一些需要展示大量内容，但又不希望用户一次性全部看到的情况下，使用折叠面板可以很好地解决这一问题。

我们先来分析一下，首先，需要标题和内容两个部分，点击标题可以展开或收起内容，所以需要绑定一个状态来控制内容的显示与隐藏。同时我们也可以添加手风琴效果，以及自定义面板标题。

## 创建组件和样式文件

因为我们有多个面板，并且面板中的内容可以任意设置，而且我们的组件标题部分也可以自定义，所以我们可以将折叠面板组件分为两部分，一个容器组件 Collapse 和单个面板组件 CollapseItem。

跟之前一样，我们先创建如下所示的结构，然后导出组件，在我们示例工程上使用。

![](http://tuchuang.niubin.site/image/project-20250212-1.png)

collapse.vue

```html
<template>
  <div class="t-collapse">
    <slot></slot>
  </div>
</template>

<script setup>
  defineOptions({
    name: "t-collapse",
  });
</script>
```

```js
export const CollapseItemProps = {
  title: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
};
```

```less
.t-collapse {
  border-top: 1px solid var(--t-border-color);
}
```

collapse-item.vue

```html
<template>
  <div class="t-collapse-item">item</div>
</template>

<script setup>
  import { CollapseItemProps } from "./collapse-item";

  defineOptions({
    name: "t-collapse-item",
  });

  const props = defineProps(CollapseItemProps);
</script>
```

使用

```html
<t-collapse>
  <t-collapse-item title="Consistency" name="1">
    <div>
      Consistent with real life: in line with the process and logic of real
      life, and comply with languages and habits that the users are used to;
    </div>
  </t-collapse-item>
  <t-collapse-item title="Feedback" name="2">
    <div>
      Operation feedback: enable the users to clearly perceive their operations
      by style updates and interactive effects;
    </div>
  </t-collapse-item>
  <t-collapse-item title="Efficiency" name="3">
    <div>
      Simplify the process: keep operating process simple and intuitive;
    </div>
  </t-collapse-item>
  <t-collapse-item title="Controllability" name="4">
    <div>
      Decision making: giving advices about operations is acceptable, but do not
      make decisions for the users;
    </div>
  </t-collapse-item>
</t-collapse>
```

## collapse-item 部分

`collapse-item` 包含两部分，标题和内容，默认情况下内容是隐藏的，点击标题可以展开或收起内容，所以我们需要一个状态来控制内容的显示与隐藏，我们先画一下界面。

```html

```

```less
.t-collapse-item {
  border-bottom: 1px solid var(--t-border-color);
  .t-collapse-item__header {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    color: var(--t-text-color);
    cursor: pointer;
    .icon-arrow-right {
      color: var(--icon);
    }
  }
  .t-collapse-item__content {
    padding-bottom: 20px;
    font-size: 13px;
    color: var(--t-text-color);
  }
}
```

现在是这个样子

![](http://tuchuang.niubin.site/image/project-20250212-2.png)

## 数据绑定

collapse.vue

```js
import { provide } from "vue";

defineOptions({
  name: "t-collapse",
});

const opened = defineModel();
```

默认所有的面板都是折叠的，我们设置一个双向绑定的变量，为一个数组，打开某个面板，则数组中包含该面板的 `name`
我们后面创建 `v-model` 的数据就都这么创建了，不再像之前那些写一个 `props` 然后再写一个 `emit` 了，这个方法在 vue3.4 以后都能用，见官网[v-model](https://cn.vuejs.org/guide/components/v-model.html#basic-usage)

```html
<template>
  <t-collapse v-model="activeNames">
    <t-collapse-item title="Consistency" name="1">
      <div>
        Consistent with real life: in line with the process and logic of real
        life, and comply with languages and habits that the users are used to;
      </div>
    </t-collapse-item>
    <!-- ... -->
    <t-collapse-item title="Controllability" name="4">
      <div>
        Decision making: giving advices about operations is acceptable, but do
        not make decisions for the users;
      </div>
    </t-collapse-item>
  </t-collapse>
</template>

<script setup>
  import { ref } from "vue";
  const activeNames = ref([]);
</script>
```

因为我们是点击 `collapse-item` 然后改变绑定的值，但是我们双向绑定是设置在 `collapse` 上的，所以我们写一个操作这个 `opened` 变量的方法，然后将 `opened` 和这个方法都提供给 `collapse-item`，`collapse-item` 点击的时候调用这个方法，这样就可以了。

collapse.vue

```js
import { provide } from "vue";

defineOptions({
  name: "t-collapse",
});

const opened = defineModel();

const changeOpened = (name) => {
  opened.value.includes(name)
    ? (opened.value = opened.value.filter((item) => item !== name))
    : (opened.value = [...opened.value, name]);
};

provide("opened", opened);
provide("changeOpened", changeOpened);
```

collapse-item.vue

```html
<template>
  <div class="t-collapse-item">
    <div class="t-collapse-item__header" @click="handleClickCollapse">
      <div class="t-collapse-item__header-title">{{ title }}</div>
      <i class="t-icon icon-arrow-right"></i>
    </div>
    <div class="t-collapse-item__content">
      <slot />
    </div>
  </div>
</template>

<script setup>
  import { CollapseItemProps } from "./collapse-item";
  import { inject } from "vue";

  defineOptions({
    name: "t-collapse-item",
  });

  const props = defineProps(CollapseItemProps);
  const opened = inject("opened");
  const changeOpened = inject("changeOpened");

  const handleClickCollapse = () => {
    changeOpened(props.name);
  };
</script>
```

我们目前算是收集了我们目前所展开的面板的 `name`，接下来我们让所有的面板默认折叠，然后点击了 `title` 部分展开，再次点击展开的然后折叠。

```html
<template>
  <div class="t-collapse-item">
    <!-- ... -->
    <div class="t-collapse-item__content" v-show="opened.includes(name)">
      <slot />
    </div>
  </div>
</template>

<script setup>
  // ...

  const props = defineProps(CollapseItemProps);
  const opened = inject("opened");
  const changeOpened = inject("changeOpened");

  const handleClickCollapse = () => {
    changeOpened(props.name);
  };
</script>
```

现在虽然可以开合，我们想要一个高度从 0 到目前内容最高的一个过渡动画，这个可以参考我之前的文章。

我们现在修改一下结构和样式

```html
<template>
  <div
    :class="`t-collapse-item ${
      opened.includes(name) ? 't-collapse-item--active' : ''
    }`"
  >
    <div class="t-collapse-item__header" @click="handleClickCollapse">
      <div class="t-collapse-item__header-title">{{ title }}</div>
      <i class="t-icon icon-arrow-right"></i>
    </div>
    <div class="t-collapse-item__content">
      <div class="t-collapse-item__reference">
        <div class="t-collapse-item__body">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { CollapseItemProps } from "./collapse-item";
  import { inject } from "vue";

  defineOptions({
    name: "t-collapse-item",
  });

  const props = defineProps(CollapseItemProps);
  const opened = inject("opened");
  const changeOpened = inject("changeOpened");

  const handleClickCollapse = () => {
    changeOpened(props.name);
  };
</script>
```

```less
.t-collapse-item {
  border-bottom: 1px solid var(--t-border-color);
  .t-collapse-item__header {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    color: var(--t-text-color);
    cursor: pointer;
    .icon-arrow-right {
      color: var(--icon);
    }
  }
  .t-collapse-item__content {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.3s ease;
    font-size: 13px;
    color: var(--t-text-color);
    .t-collapse-item__reference {
      overflow: hidden;
    }
    .t-collapse-item__body {
      padding-bottom: 20px;
    }
  }
  &.t-collapse-item--active {
    .t-collapse-item__content {
      grid-template-rows: 1fr;
    }
  }
}
```

这下动画就加上了。

还有一个右边的图标，我们展开的时候是是朝下的，有人会想到那直接两个图标切换就好了，但是这样在切换的时候是添加不了动画或者过度效果的，所以我们依旧使用之前向右的箭头，只是打开的时候我们顺时针旋转 90 度即可。

```less
.t-collapse-item {
  // ...
  &.t-collapse-item--active {
    .t-collapse-item__content {
      grid-template-rows: 1fr;
    }
    .icon-arrow-right {
      transform: rotate(90deg);
      transition: all 0.3s;
    }
  }
}
```

## 手风琴效果

这个很简单，就是我们点击一个的时候别的都折叠，如果点击的当前为展开状态，则折叠，反之则展开。

我们定义一个属性 `accordion`，来决定是否需要手风琴效果。

collapse.js

```js
export const CollapseProps = {
  accordion: {
    type: Boolean,
    default: false,
  },
};
```

collapse.vue

```js
const changeOpened = (name) => {
  if (props.accordion) {
    opened.value = opened.value.includes(name) ? [] : [name];
  } else {
    opened.value.includes(name)
      ? (opened.value = opened.value.filter((item) => item !== name))
      : (opened.value = [...opened.value, name]);
  }
};
```

## 自定义面板标题和图标

这个简单，直接把 `title` 和 `icon` 部分改为插槽即可

```html
<template>
  <div
    :class="`t-collapse-item ${
      opened.includes(name) ? 't-collapse-item--active' : ''
    }`"
  >
    <div class="t-collapse-item__header" @click="handleClickCollapse">
      <div class="t-collapse-item__header-title">
        <slot name="title"> {{ title }} </slot>
      </div>
      <slot name="icon">
        <i class="t-icon icon-arrow-right"></i>
      </slot>
    </div>
    <div class="t-collapse-item__content">
      <div class="t-collapse-item__reference">
        <div class="t-collapse-item__body">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
```

我们可以给插槽暴露一个属性 `isActive`，表示当前是否展开，这样他可以根据不同的状态来显示不同的图标

```html
<template>
  <div
    :class="`t-collapse-item ${
      opened.includes(name) ? 't-collapse-item--active' : ''
    }`"
  >
    <div class="t-collapse-item__header" @click="handleClickCollapse">
      <div class="t-collapse-item__header-title">
        <slot name="title"> {{ title }} </slot>
      </div>
      <div>
        <slot name="icon" :isActive="opened.includes(name)">
          <i class="t-icon icon-arrow-right"></i>
        </slot>
      </div>
    </div>
    <div class="t-collapse-item__content">
      <div class="t-collapse-item__reference">
        <div class="t-collapse-item__body">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
```

我们来试一下

```html
<t-collapse v-model="activeNames2">
  <t-collapse-item name="1">
    <template #title>
      Consistency
      <i class="t-icon icon-email" />
    </template>
    <div>
      Consistent with real life: in line with the process and logic of real
      life, and comply with languages and habits that the users are used to;
    </div>
  </t-collapse-item>
  <t-collapse-item title="Feedback" name="2">
    <template #icon="{ isActive }">
      <i
        :class="`t-icon ${
              isActive ? 'icon-arrow-down-filling' : 'icon-arrow-right-filling'
            }`"
      />
    </template>
    <div>
      Operation feedback: enable the users to clearly perceive their operations
      by style updates and interactive effects;
    </div>
  </t-collapse-item>
  <t-collapse-item title="Efficiency" name="3">
    <div>
      Simplify the process: keep operating process simple and intuitive;
    </div>
  </t-collapse-item>
  <t-collapse-item title="Controllability" name="4">
    <div>
      Decision making: giving advices about operations is acceptable, but do not
      make decisions for the users;
    </div>
  </t-collapse-item>
</t-collapse>
```

![](http://tuchuang.niubin.site/image/project-20250212-3.png)
