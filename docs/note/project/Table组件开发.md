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
            <th v-for="theadItem in columnData" :key="theadItem.key">{{ theadItem.label }}</th>
          </tr>
        </thead>
      </table>
    </div>
    <div class="t-table__tbody-wrapper">
      <table class="t-table__tbody">
        <tbody>
          <tr v-for="(rowItem, index) in tableData" :key="'table_row_' + index">
            <td v-for="(colItem, i) in columnData" :key="'table_col_' + i">
              {{ rowItem[colItem.key] }}
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
}
```

这下看一下，大概的 `table` 样子就出来了

![](http://tuchuang.niubin.site/image/project-20250120-3.png)

我们默认是每列都是 flex: 1，也就是均分，但是我们给每列可以设置宽度，所以这时候在列这边修改一下
