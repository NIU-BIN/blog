---
category: project
cover: https://cdn.pixabay.com/photo/2023/12/16/00/06/mountain-8451604_640.jpg
---

# Tree 组件开发

## 创建组件和样式文件

跟之前先创建如图所示的目录结构，然后我们在 `packages/components/components.js` 导出

![](http://tuchuang.niubin.site/image/project-20250102-1.png)

```js
export { TButton } from "./button";
export { TMessage } from "./message";
export { TTree } from "./tree";
```

> 先来说一下我们为什么需要多创建一个 `tree-node.vue`， 因为一般情况下 tree 内部的处理相对来说比较麻烦，我们将树的节点再抽为一个组件可以很好管理和控制，这个我们在实际开发的过程中就会感受到。

然后在 `packages/theme-chalk/components` 中创建 `tree.less`，并在 `theme-chalk/index.less` 中引入

## tree 的基本功能实现

首先我们需要在最外层传入 data，然后传入到 tree 组件内部，我们将数组再遍历，将每一个节点传入到 `tree-node` 组件中，由于是树层级的，所以我们在 `tree-node` 组件内部需要递归组件从而实现树形结构的生成。

tree.js

```js
export const TreeProps = {
  // 数据
  data: {
    type: Array,
    default: () => [],
  },
};
```

tree.vue

```vue
<template>
  <div class="t_tree">
    <t-tree-node v-for="node in props.data" :key="item.id" :node="node" />
  </div>
</template>

<script setup>
import { TreeProps } from "./tree";
import treeNode from "./tree-node.vue";

const props = defineProps(TreeProps);
defineOptions({
  name: "t-tree",
});
</script>
```

tree-node.js

```js
export const TreeNodeProps = {
  node: {
    type: Object,
    default: () => ({
      id: "",
      label: "",
      showChild: false,
      children: [],
    }),
  },
};
```

tree-node.vue

```vue
<template>
  <div class="t-tree-node">
    <div class="t-tree-node__content">
      <span class="t-tree-node__label">{{ node.label }}</span>
    </div>
    <!-- children -->
    <div class="t-tree-node__children">
      <t-tree-node v-for="child in node.children" :key="child.id" :node="child" />
    </div>
  </div>
</template>

<script setup>
import { TreeNodeProps } from "./tree-node";

const props = defineProps(TreeNodeProps);

defineOptions({
  name: "t-tree-node",
});
</script>
```

我们来设置一点样式，让树的层级看起来能主观一些

```less
.t-tree {
  .t-tree-node__children {
    padding-left: 20px;
  }
}
```

在我们的 example 的项目中测试一下

```vue
<template>
  <t-tree :data="data" />
</template>

<script setup>
const treeData = [
  {
    id: "1",
    label: "Level one 1",
    children: [
      {
        id: "1-1",
        label: "Level two 1-1",
        children: [
          {
            id: "1-1-1",
            label: "Level three 1-1-1",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    label: "Level one 2",
    children: [
      {
        id: "2-1",
        label: "Level two 2-1",
        children: [
          {
            id: "2-1-1",
            label: "Level three 2-1-1",
          },
        ],
      },
      {
        id: "2-2",
        label: "Level two 2-2",
        children: [
          {
            id: "2-2-1",
            label: "Level three 2-2-1",
          },
        ],
      },
    ],
  },
  {
    id: "3",
    label: "Level one 3",
    children: [
      {
        id: "3-1",
        label: "Level two 3-1",
        children: [
          {
            id: "3-1-1",
            label: "Level three 3-1-1",
          },
        ],
      },
      {
        id: "3-2",
        label: "Level two 3-2",
        children: [
          {
            id: "3-2-1",
            label: "Level three 3-2-1",
          },
        ],
      },
      {
        id: "3-3",
        label: "Level two 3-3",
      },
    ],
  },
];
</script>
```

![](http://tuchuang.niubin.site/image/project-20250102-2.png)

没有问题，接下来我们来实现一下展开和收起的功能，我们通过在 `tree-node` 组件中添加一个 `showChild` 属性来控制展开和收起，然后通过点击事件来控制 `showChild` 的值，从而实现展开和收起的功能。

## 展开和收起功能实现

我们修改一下 `tree-node.vue` 组件，添加上箭头的图标，然后添加上点击事件，通过点击事件来控制 `showChild` 的值，并且控制 `children` 的显示隐藏

```vue
<template>
  <div class="t-tree-node">
    <div class="t-tree-node__content" @click="handleClickNode">
      <div
        class="t-icon icon-arrow-right-filling"
        :style="{
          visibility: node.children && node.children.length ? 'visible' : 'hidden',
          transform: showChild ? 'rotateZ(90deg)' : '',
        }"
      ></div>
      <span class="t-tree-node__label">{{ node.label }}</span>
    </div>
    <!-- children -->
    <div class="t-tree-node__children" v-show="showChild">
      <t-tree-node v-for="child in node.children" :key="child.id" :node="child" />
    </div>
  </div>
</template>

<script setup>
import { TreeNodeProps } from "./tree-node";
import { ref } from "vue";

const props = defineProps(TreeNodeProps);

defineOptions({
  name: "t-tree-node",
});

const showChild = ref(false);

const handleClickNode = () => {
  showChild.value = !showChild.value;
};
</script>
```

我们来试试，发现是正常使用的。我们来优化一下样式

```less
.t-tree {
  .t-tree-node__content {
    padding: 0 8px;
    display: flex;
    height: 26px;
    gap: 6px;
    align-items: center;
    cursor: pointer;
    user-select: none;
    &:hover {
      background-color: #f0f0f0;
    }
    .t-icon {
      font-size: 13px;
      color: var(--p-icon-fill-color);
      transition: all 0.3s ease;
    }
    .t-tree-node__label {
      color: var(--t-text-color);
    }
  }
  .t-tree-node__children {
    padding-left: 20px;
  }
}
```
