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
    <div class="t-tree-node__content">
      <div
        class="t-icon icon-arrow-right-filling"
        :style="{
          visibility: node.children && node.children.length ? 'visible' : 'hidden',
          transform: showChild ? 'rotateZ(90deg)' : '',
        }"
        @click="showChild = !showChild"
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
      color: var(--t-icon-fill-color);
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

![](http://tuchuang.niubin.site/image/project-20250102-3.png)

我们顺便把点击事件做一下，首先 tree 组件最外部需要注册一个点击事件，但是点击本身是由 tree-node 组件来触发的，所以我们需要在 tree-node 组件中触发一个自定义事件，然后在 tree 组件中监听这个自定义事件，从而实现点击事件。

tree.js

```js
export const TreeProps = {
  // 数据
  data: {
    type: Array,
    default: () => [],
  },
  // 是否显示可选择
  showCheckbox: {
    type: Boolean,
    default: false,
  },
};

export const TreeNodeEmits = ["handleClickNode"];
```

```vue
<template>
  <div class="t-tree">
    <t-tree-node
      v-for="node in props.data"
      :key="node.id"
      :node="node"
      @handleClickNode="emit('handleClickNode', $event)"
    />
  </div>
</template>

<script setup>
import { TreeProps, TreeNodeEmits } from "./tree";
import tTreeNode from "./tree-node.vue";

const props = defineProps(TreeProps);
const emit = defineEmits(TreeNodeEmits);

defineOptions({
  name: "t-tree",
});
</script>
```

tree-node.vue

```vue
<template>
  <div class="t-tree-node">
    <div class="t-tree-node__content" @click="handleClickNode($event, node)">
      <div
        class="t-icon icon-arrow-right-filling"
        :style="{
          visibility: node.children && node.children.length ? 'visible' : 'hidden',
          transform: showChild ? 'rotateZ(90deg)' : '',
        }"
        @click.stop="showChild = !showChild"
      ></div>
      <span class="t-tree-node__label">{{ node.label }}</span>
    </div>
    <!-- children -->
    <div class="t-tree-node__children" v-show="showChild">
      <t-tree-node
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        @handleClickNode="emit('handleClickNode', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { TreeNodeProps, TreeNodeEmits } from "./tree-node";
import { ref } from "vue";

const props = defineProps(TreeNodeProps);
const emit = defineEmits(TreeNodeEmits);

defineOptions({
  name: "t-tree-node",
});

const showChild = ref(false);

const handleClickNode = (e, node) => {
  emit("handleClickNode", {
    ...node,
    $event: e, // 这边是携带上原生的事件对象，方便外部使用
  });
};
</script>
```

这里注意将我们刚才做展开和合并的点击事件添加 `.stop` 修饰符，防止事件冒泡。

## 选中功能

我们需要注意以下几点：

1. 所有的子节点选择的时候，父节点也应该是选中的状态；父节点选中的时候，所有的子节点也全选择。
2. 所有的子节点取消选择的时候，父节点也应该是取消选择的状态；父节点取消选择的时候，所有的子节点也全取消选择。
3. 当存在部分子节点为选中状态的时候，父节点应该是半选状态。

所以我们每个节点都应该有三种状态，选中、未选中、半选，我们对应的 key 分别可以定义为 all、none、some。

由于我们在处理选中状态的时候是我们内部的变量，我们只需要暴露出去选中的节点即可，所以我们可以将外部传入的树的 data 进行二次处理，给每个节点先添加上一个属性，在我们组件内部去使用，这样我们就可以在组件内部去处理选中状态了。

tree.vue

```vue
<template>
  <div class="t-tree">
    <t-tree-node
      v-for="node in props.data"
      :key="node.id"
      :node="node"
      @handleClickNode="emit('handleClickNode', $event)"
    />
  </div>
</template>

<script setup>
import { TreeProps, TreeNodeEmits } from "./tree";
import tTreeNode from "./tree-node.vue";
import { ref, watch } from "vue";

const props = defineProps(TreeProps);
const emit = defineEmits(TreeNodeEmits);

defineOptions({
  name: "t-tree",
});

const treeData = ref([]);

watch(
  () => props.data,
  (newValue) => (treeData.value = newValue),
  { immediate: true }
);
</script>
```

我们先来创建一个可选框，然后使用 computed 通过子集的选中状态来分别定义 all、none、some 的类名，代码如下：

tree-node.vue

```vue
<template>
  <div class="t-tree-node">
    <div class="t-tree-node__content" @click="handleClickNode($event, node)">
      <div
        class="t-icon icon-arrow-right-filling"
        :style="{
          visibility: node.children && node.children.length ? 'visible' : 'hidden',
          transform: showChild ? 'rotateZ(90deg)' : '',
        }"
        @click.stop="showChild = !showChild"
      ></div>
      <span
        :class="`p-tree-node__checkbox ${getCheckType}`"
        @click.stop="changeCheckStatus(node)"
      ></span>
      <span class="t-tree-node__label">{{ node.label }}</span>
    </div>
    <!-- children -->
    <div class="t-tree-node__children" v-show="showChild">
      <t-tree-node
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        @handleClickNode="emit('handleClickNode', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { TreeNodeProps, TreeNodeEmits } from "./tree-node";
import { ref, computed } from "vue";

const props = defineProps(TreeNodeProps);
const emit = defineEmits(TreeNodeEmits);

defineOptions({
  name: "t-tree-node",
});

const showChild = ref(false);

const handleClickNode = (e, node) => {
  emit("handleClickNode", {
    ...node,
    $event: e,
  });
};

const getCheckType = computed(() => {
  let checkType = "";
  if (props.node.isChecked) {
    checkType = "all";
  } else if (props.node.children && props.node.children.every((item) => item.isChecked === true)) {
    checkType = "all";
  } else if (props.node.children && props.node.children.some((item) => item.isChecked === true)) {
    checkType = "some";
  } else {
    checkType = "none";
  }
  return checkType;
});

const changeCheckStatus = (node) => {
  console.log("node: ", node);
};
</script>
```

我们需要点击可选框然后改变当前节点的选中状态，同时需要改变所有父节点的选中状态，在 tree-node 注册一个 changeCheckStatus 的 emit 事件，然后点击可选框的时候触发 changeCheckStatus 事件

```js
const changeCheckStatus = (node) => {
  emit("changeCheckStatus", node);
};
```

当我们拿到当前选中节点的时候，我们需要做的有一下几点：

1. 改变当前节点的选中状态
2. 如果存在子节点，则遍历修改当前节点所有子节点的状态跟当前节点状态相同
3. 从头开始递归，每次找到父级节点，然后更改父级节点状态，然后将父级的节点 id 再传入递归找到父级的父级，以及类推

所有的处理我们在 tree.vue 中执行逻辑，我们先处理一下修改当前节点以及所有子节点的选中状态，代码如下：

tree.vue

```js
const changeCheckStatus = (node) => {
  findNode(treeData.value, node.id, changeAllCheckStatus);
};

const findNode = (data, id, handleFun) => {
  let obj = null;
  for (let item of data) {
    if (item.id === id) {
      obj = item;
      handleFun(item);
      break;
    } else if (item.children && item.children.length) {
      const res = findNode(item.children, id, handleFun);
      if (res) obj = res;
    }
  }
  return obj;
};

const changeAllCheckStatus = (node) => {
  node.isChecked = !node.isChecked;
  if (node.children && node.children.length) {
    changeChildCheckStatus(node.children, node.isChecked);
  }
};

// 修改子级的选中状态
const changeChildCheckStatus = (children, isChecked) => {
  children.forEach((node) => {
    node.isChecked = isChecked;
    if (node.children && node.children.length) changeChildCheckStatus(node.children, isChecked);
  });
};
```

这个简单，只要当前节点是选中，则子级及以下的所有节点选中，反之也是如此。

接下来我们处理一下递归修改父级节点的选中状态，代码如下：

```js
const changeCheckStatus = (node) => {
  node.isChecked = !node.isChecked;
  if (node.children && node.children.length) {
    changeChildCheckStatus(node.children, node.isChecked); // 更改子级所有节点状态
  }
  changeParentCheckStatus(treeData.value, node.id); // 更改父级所有节点状态
};

const changeParentCheckStatus = (data, id) => {
  for (let item of children) {
    if (item.id === id) {
      // 是否当前节点的所有子节点都选中
      const result = children.every((item) => item.isChecked === true);
      if (parent && parent.isChecked === result) {
        // 如果父级跟需要改变的结果一致，则不需要再往上找了
        break;
      } else if (parent && parent.isChecked !== result) {
        parent.isChecked = result;
        parent && changeParentCheckStatus(treeData.value, parent.id);
      }
    } else if (item.children && item.children.length) {
      changeParentCheckStatus(item.children, id, item);
    }
  }
};
```

![](http://tuchuang.niubin.site/image/project-20250102-4.png)

我们测试一下是没有问题的。我们再给添加一下是否选中节点的功能，代码如下：

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
  // 是否显示可选择
  showCheckbox: {
    type: Boolean,
    default: false,
  },
};

export const TreeNodeEmits = ["handleClickNode", "changeCheckStatus"];
```

在 `tree.vue` 中直接 `v-bind="$attrs"` 将属性传递过去

```vue
<template>
  <div class="t-tree">
    <t-tree-node
      v-for="node in treeData"
      :key="node.id"
      :node="node"
      v-bind="$attrs"
      @handleClickNode="emit('handleClickNode', $event)"
      @changeCheckStatus="changeCheckStatus"
    />
  </div>
</template>
```

在 `tree-node.vue` 中控制一下选择框的显示

```vue
<template>
  <div class="t-tree-node">
    <div class="t-tree-node__content" @click="handleClickNode($event, node)">
      <div
        class="t-icon icon-arrow-right-filling"
        :style="{
          visibility: node.children && node.children.length ? 'visible' : 'hidden',
          transform: showChild ? 'rotateZ(90deg)' : '',
        }"
        @click.stop="showChild = !showChild"
      ></div>
      <span
        :class="`p-tree-node__checkbox ${getCheckType}`"
        v-if="props.showCheckbox"
        @click.stop="changeCheckStatus(node)"
      ></span>
      <span class="t-tree-node__label">{{ node.label }}</span>
    </div>
    <!-- children -->
    <div class="t-tree-node__children" v-show="showChild">
      <t-tree-node
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :showCheckbox="showCheckbox"
        @handleClickNode="emit('handleClickNode', $event)"
        @changeCheckStatus="emit('changeCheckStatus', $event)"
      />
    </div>
  </div>
</template>
```

## 选中节点的获取以及主动设置选中节点

我们通常在业务中使用的时候是需要获取到选中节点的值的，以及我们需要可能主动通过代码的触发来勾选上某些节点，那么我们接下来来实现这个功能。

我们先指定一下我们需要获取到的节点的唯一 id key

tree.js

```js
export const TreeProps = {
  // 数据
  data: {
    type: Array,
    default: () => [],
  },
  // 节点的唯一标识
  nodeKey: {
    type: String,
    default: "id",
  },
};

export const TreeNodeEmits = ["handleClickNode"];
```

我们在 tree 组件中 expose 一个方法，用来获取选中的节点 key

```js
const getCheckedNodes = () => {
  const checkedNodes = [];
  getChecked(treeData.value, checkedNodes);
  return checkedNodes.map((item) => item[props.nodeKey]);
};

const getChecked = (data, checkedNodes) => {
  for (let item of data) {
    if (item.isChecked) {
      checkedNodes.push(item);
    }
    if (item.children && item.children.length) {
      getChecked(item.children, checkedNodes);
    }
  }
};

defineExpose({
  getCheckedNodes,
});
```

我们试一下

```vue
<template>
  <div>
    <t-button @click="getCheckedNodes">获取选中的key</t-button>
    <t-tree
      ref="treeRef"
      :data="treeData"
      node-key="id"
      :showCheckbox="true"
      @handleClickNode="handleClickNode"
    />
  </div>
</template>
<script setup>
import { ref } from "vue";

const treeRef = ref(null);

const getCheckedNodes = () => {
  const keys = treeRef.value?.getCheckedNodes();
  console.log("keys: ", keys);
};
</script>
```

> ✨ 注意： 因为这边的 node-key 为自定义了，所以需要将之前逻辑中所有的 `.id` 改为 `props.nodeKey`

![](http://tuchuang.niubin.site/image/project-20250102-5.png)

没有问题，我们再来实现一下主动设置选中节点

```js
const setCheckedNodes = (keys) => {
  setChecked(treeData.value, keys);
  keys.forEach((key) => {
    changeParentCheckStatus(treeData.value, key); // 更改父级所有节点状态
  });
};

const setChecked = (data, keys) => {
  for (let item of data) {
    if (keys.includes(item[props.nodeKey])) {
      item.isChecked = true;
    }
    if (item.children && item.children.length) {
      setChecked(item.children, keys);
    }
  }
};

defineExpose({
  getCheckedNodes,
  setCheckedNodes,
});
```

```vue
<template>
  <div>
    <t-button type="primary" @click="getCheckedNodes">获取选中的key</t-button>
    <t-button type="primary" @click="setCheckedNodes">设置选中的key</t-button>
    <t-tree
      ref="treeRef"
      :data="treeData"
      node-key="id"
      :showCheckbox="true"
      @handleClickNode="handleClickNode"
    />
  </div>
</template>
<script setup>
import { ref } from "vue";

const treeRef = ref(null);

const getCheckedNodes = () => {
  const keys = treeRef.value?.getCheckedNodes();
  console.log("keys: ", keys);
};

const setCheckedNodes = () => {
  treeRef.value?.setCheckedNodes(["1-1", "3-3"]);
};
</script>
```

> ps. 这块时间复杂度有点高，后续优化一下。

## 是否默认展开

我们在 tree-node 中定义一个属性`default-expand-all`

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
  // 是否显示可选择
  showCheckbox: {
    type: Boolean,
    default: false,
  },
  // 节点的唯一标识
  nodeKey: {
    type: String,
    default: "id",
  },
  // 是否默认展开
  defaultExpandAll: {
    type: Boolean,
    default: false,
  },
};

export const TreeNodeEmits = ["handleClickNode", "changeCheckStatus"];
```

然后将传进来的 `defaultExpandAll` 作为 `showChild` 初始值

```js
import { TreeNodeProps, TreeNodeEmits } from "./tree-node";
import { ref, computed } from "vue";

const props = defineProps(TreeNodeProps);
const emit = defineEmits(TreeNodeEmits);

defineOptions({
  name: "t-tree-node",
});

const showChild = ref(props.defaultExpandAll);
```

这样就可以直接控制了

```vue
<t-tree :data="treeData" node-key="id" :default-expand-all="true" />
```
