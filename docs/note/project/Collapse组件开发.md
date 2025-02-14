---
category: project
cover: https://cdn.pixabay.com/photo/2023/12/16/00/06/mountain-8451604_640.jpg
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
