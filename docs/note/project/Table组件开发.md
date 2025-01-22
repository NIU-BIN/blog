---
category: project
cover: https://cdn.pixabay.com/photo/2023/12/16/00/06/mountain-8451604_640.jpg
---

# Table 组件开发

本节开始我们很常用的 Table 组件的开发，主要实现以下功能：

基础使用、自定义列、斑马线、固定表头、固定列、多选。

## 创建组件和样式文件

我们创建如图所示的组件目录结构。

![](http://tuchuang.niubin.site/image/project-20250120-1.png)

这次有人会好奇为什么我没有给每一列去创建一个 `table-column` 的组件，而是直接在 `table` 组件中实现，因为在列多的情况下我们的 html 会显得特别繁琐，当然我们也会实现自定义列的相关功能，后面会提到如何实现。

## 基础使用

我们需要设置我们表格中存在的列都有哪些数据，对应的 `key` 是什么，以及我每列对应的宽度是多少，排列方式是什么，这样我们就得出了我们的 `column` 属性应该大体是什么样子了。如果用 TS 来描述就是：
··

```typescript
interface ColumnItem {
  key: string;
  title: string;
  width?: number;
  align?: "left" | "center" | "right";
}
```

然后我们需要传递表格中的数据，每行也就是对应每条数据，其中每一个 `key` 对应一个列也对应一个值，这样我们的 `data` 就和我们的 `column` 对应起来了。我们定义一下 table 组件的属性：

table.js

```js
export const TableProps = {
  columnData: {
    type: Array,
    default: () => [],
  },
  tableData: {
    type: Array,
    default: () => [],
  },
};
```

我们在我们示例项目中使用一下这个组件：

```html
<template>
  <div>
    <t-table :column-data="columnData" :table-data="tableData"> </t-table>
  </div>
</template>

<script setup lang="ts">
const columnData = [
  {
    key: 'date',
    label: 'Date',
    width: "120",
  },
  {
    key: 'name',
    label: 'Name'
  },
  {
    key: 'address',
    label: 'Address'
  },
]

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
```

这时候我们来写一下 `table` 组件基本的结构

```html
<template>
  <div class="t-table">
    <div class="t-table__thead-wrapper">
      <table class="t-table__thead">
        <thead>
          <tr>
            <th v-for="theadItem in columnData" :key="theadItem.key">
              <div class="cell">{{ theadItem.label }}</div>
            </th>
          </tr>
        </thead>
      </table>
    </div>
    <div class="t-table__tbody-wrapper">
      <table class="t-table__tbody">
        <tbody>
          <tr v-for="(rowItem, index) in tableData" :key="'table_row_' + index">
            <td v-for="(colItem, i) in columnData" :key="'table_col_' + i">
              <div class="cell">{{ rowItem[colItem.key] }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
  import { TableProps } from "./table";

  defineOptions({
    name: "t-table",
  });

  const props = defineProps(TableProps);
</script>
```

这时候就这个样子

![](http://tuchuang.niubin.site/image/project-20250120-2.png)

我们来设置一下样式

```less
.t-table {
  color: var(--t-text-color);
  .t-table__thead-wrapper {
    border-bottom: 1px solid var(--t-border-color);
  }
  .t-table__thead,
  .t-table__tbody {
    width: 100%;
  }
  .t-table__thead tr,
  .t-table__tbody tr {
    display: flex;
    align-items: center;
  }
  .t-table__thead tr > th,
  .t-table__tbody tr > td {
    padding: 8px 0;
    flex: 1;
    text-align: left;
  }
  .t-table__tbody tr {
    border-bottom: 1px solid var(--t-border-color);
    &:hover {
      background-color: var(--t-hover-color);
    }
  }
  .cell {
    padding: 0 10px;
  }
}
```

这下看一下，大概的 `table` 样子就出来了

![](http://tuchuang.niubin.site/image/project-20250120-3.png)

我们默认是每列都是 flex: 1，也就是均分，但是我们给每列可以设置宽度，所以这时候在列这边修改一下

```html
<template>
  <div class="t-table">
    <div class="t-table__thead-wrapper">
      <table class="t-table__thead">
        <thead>
          <tr>
            <th
              v-for="theadItem in columnData"
              :key="theadItem.key"
              :style="{
                width: theadItem.width + 'px',
                flex: theadItem.width ? 'none' : 1,
              }"
            >
              <div class="cell">{{ theadItem.label }}</div>
            </th>
          </tr>
        </thead>
      </table>
    </div>
    <div class="t-table__tbody-wrapper">
      <table class="t-table__tbody">
        <tbody>
          <tr v-for="(rowItem, index) in tableData" :key="'table_row_' + index">
            <td
              v-for="(colItem, i) in columnData"
              :key="'table_col_' + i"
              :style="{
                width: colItem.width + 'px',
                flex: colItem.width ? 'none' : 1,
              }"
            >
              <div class="cell">{{ rowItem[colItem.key] }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
```

![](http://tuchuang.niubin.site/image/project-20250120-4.png)

## 斑马纹

这个简单，我们定义一个属性 `stripe`，接受一个 boolean 值，默认为 false

```js
export const TableProps = {
  columnData: {
    type: Array,
    default: () => [],
  },
  tableData: {
    type: Array,
    default: () => [],
  },
  stripe: {
    type: Boolean,
    default: false,
  },
};
```

然后添加一下类名即可

```html
<!-- ... -->
<div class="t-table__tbody-wrapper">
  <table class="t-table__tbody">
    <tbody>
      <tr
        v-for="(rowItem, index) in tableData"
        :key="'table_row_' + index"
        :class="{
              't-table__tbody--stripe': stripe && index % 2 === 1,
            }"
      >
        <td
          v-for="(colItem, i) in columnData"
          :key="'table_col_' + i"
          :style="{
                width: colItem.width + 'px',
                flex: colItem.width ? 'none' : 1,
              }"
        >
          <div class="cell">{{ rowItem[colItem.key] }}</div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
<!-- ... -->
```

```less
.t-table {
  // ...
  .t-table__tbody--stripe {
    background-color: #f8f8f8;
  }
}
```

## 边框

我们定义一个属性 `border`，接受一个 boolean 值，默认为 false

```js
export const TableProps = {
  columnData: {
    type: Array,
    default: () => [],
  },
  tableData: {
    type: Array,
    default: () => [],
  },
  stripe: {
    type: Boolean,
    default: false,
  },
  border: {
    type: Boolean,
    default: false,
  },
};
```

我们在最外部添加一个类名，然后在这个类下添加边框即可

```html
<div :class="['t-table', border ? 't-table--border' : '']">
  <!-- ... -->
</div>
```

添加一下样式

```less
.t-table {
  // ...
.t-table--border {
  border: 1px solid var(--t-border-color);
  .t-table__tbody tr:nth-last-child(1) {
    border: none;
  }
  .t-table__thead tr > th,
  .t-table__tbody tr > td {
    border-right: 1px solid var(--t-border-color);
  }
  .t-table__thead tr > th:nth-last-child(1),
  .t-table__tbody tr > td:nth-last-child(1) {
    border-right: none;
  }
}
```

![](http://tuchuang.niubin.site/image/project-20250120-5.png)

## 自定义列

我们经常在开发的过程中需要修改某列的显示内容，`element-plus` 是在各自的 `el-table-column` 组件的默认插槽中定义的，那我们改如何设置呢？

其实也很简单，我们可以设置具名插槽，具名插槽的名称就为我们每列的 key

```html
<!-- ... -->
<div class="t-table__tbody-wrapper">
  <table class="t-table__tbody">
    <tbody>
      <tr
        v-for="(rowItem, index) in tableData"
        :key="'table_row_' + index"
        :class="{
              't-table__tbody--stripe': stripe && index % 2 === 1,
            }"
      >
        <td
          v-for="(colItem, i) in columnData"
          :key="'table_col_' + i"
          :style="{
                width: colItem.width + 'px',
                flex: colItem.width ? 'none' : 1,
              }"
        >
          <div class="cell">
            <slot :name="colItem.key"> {{ rowItem[colItem.key] }} </slot>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
<!-- ... -->
```

比如我们需要修改 `address` 这列

```html
<t-table :column-data="columnData" :table-data="tableData">
  <template #address> 我要自己定义 </template>
</t-table>
```

![](http://tuchuang.niubin.site/image/project-20250120-6.png)

这样就可以自定义了

但是，我们一般都需要在这块根据当前的值来做进一步的转换，所以我们需要在插槽中获取到当前行的数据，我们最常用的就是当前行的数据以及当前行的下标。

```html
<div class="t-table__tbody-wrapper">
  <table class="t-table__tbody">
    <tbody>
      <tr
        v-for="(rowItem, index) in tableData"
        :key="'table_row_' + index"
        :class="{
              't-table__tbody--stripe': stripe && index % 2 === 1,
            }"
      >
        <td
          v-for="(colItem, i) in columnData"
          :key="'table_col_' + i"
          :style="{
                width: colItem.width + 'px',
                flex: colItem.width ? 'none' : 1,
              }"
        >
          <div class="cell">
            <slot
              :name="colItem.key"
              v-bind="{ scoped: rowItem, $index: index }"
            >
              {{ rowItem[colItem.key] }}
            </slot>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

我们可以这样获取

```html
<t-table :column-data="columnData" :table-data="tableData">
  <template #address="{ scoped, $index }">
    这是第{{ $index }}行数据，内容是{{ scoped }}
  </template>
</t-table>
```

![](http://tuchuang.niubin.site/image/project-20250120-7.png)

## 固定表头

因为默认我们是内容有多少，表格的 body 部分就有多长，固定表头的时候就需要我们设定高度，超过这个高度表格的 body 部分才会滚动，所以我们需要定义一个属性 height

```js
export const TableProps = {
  columnData: {
    type: Array,
    default: () => [],
  },
  tableData: {
    type: Array,
    default: () => [],
  },
  stripe: {
    type: Boolean,
    default: false,
  },
  border: {
    type: Boolean,
    default: false,
  },
  height: {
    type: Number,
  },
};
```

```html
<!-- ... -->
<div
  class="t-table__tbody-wrapper"
  :style="{
        height: height ? height + 'px' : 'auto',
        overflow: height ? 'auto' : 'hidden',
      }"
>
  <table class="t-table__tbody">
    <tbody>
      <!-- ... -->
    </tbody>
  </table>
</div>
<!-- ... -->
```

我们来看看

```html
<t-table :column-data="columnData" :table-data="tableData" height="260">
</t-table>
```

![](http://tuchuang.niubin.site/image/project-20250120-8.png)

感觉确实可以，但是其实是有问题的，我们这时候给固定表头的这个设置上 `border` 再来看一下

![](http://tuchuang.niubin.site/image/project-20250120-9.png)

这时候就会发现，表格的 body 部分和表头部分没有对齐，这是因为边框占据了 body 的宽度，导致内部的空间缩减，这时候有三种方式来解决这个问题：

1. 直接给表格的 body 部分的滚动条设置隐藏，这样就不会占据宽度了，但是我们看过去不知道当前的内容是不是还有，可以滚动，所以不推荐
2. 判断表格的 body 的高度是否比 body 中内容的总体高度还大，如果大的时候我们给 thead 部分设置一个 `padding-right`，这个 `padding-right` 必须和滚动条宽度一致，这样的话等于上下存在的空间都是相同的，这样也就不会出现设置边框的时候对不齐的情况了
3. 隐藏现有滚动条，手写一个滚动条，该滚动条为绝对定位，在表格的右侧，这样就可以保证滚动条不会占据表格的宽度，当然这种很麻烦，需要你计算位置、添加鼠标相关的事件等等，element-plus 就是采用该方案。

我最后想了想，还是选择第三种，第二种没有什么意思，相信大家都能做出来，还是带大家实现一下 element-plus 的思路。

思路如下：

1. 先把滚动条隐藏
2. 然后创建一个 div 滚动条设置绝对定位
3. 获取 tbody 部分的高度跟内容的高度作比较，如果比 tbody 的容器高度还大的时候表明要显示滚动条，否则隐藏滚动条
4. 手写拖动逻辑，鼠标按下的时候记录，然后鼠标移动，上下移动了多少，同时通过计算出内容需要滚动多少

```less
.t-table__tbody-wrapper {
  &::-webkit-scrollbar {
    display: none;
  }
}
```
