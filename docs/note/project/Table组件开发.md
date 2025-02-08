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

这时候觉得使用 `flex` 已经丸美解决了，但是后续会存在一个问题，这边我最后还是选择使用 `colgroup` 来解决

> `<colgroup>` 标签用于规定表格中包含一列或多列的分组的格式。

因为我们表头和表格内容是分开的，所以我们需要在表头和表格内容都添加一个 `colgroup` 标签，然后设置统一的宽度，因为如果不设置宽度，上下两个 `colgroup` 标签的宽度会不一致，导致表格错乱

```html
<template>
  <div class="t-table" ref="tableRef">
    <div class="t-table__thead-wrapper">
      <table class="t-table__thead">
        <colgroup>
          <col
            v-for="colItem in columnData"
            :key="'table_col_' + colItem.key"
            :width="colItem.width"
          />
        </colgroup>
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
        <colgroup>
          <col
            v-for="colItem in columnData"
            :key="'table_col_' + colItem.key"
            :width="colItem.width"
          />
        </colgroup>
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
```

这时候如果不设置列宽，表头和表格的内容列宽自动的时候宽度将不一样，所以我们需要计算一下没有设置列宽的列的宽度，然后均分

```html
<template>
  <div class="t-table" ref="tableRef">
    <div class="t-table__thead-wrapper">
      <table class="t-table__thead">
        <colgroup>
          <col
            v-for="colItem in columnData"
            :key="'table_col_' + colItem.key"
            :width="colItem.width || averageWidth"
          />
        </colgroup>
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
        <colgroup>
          <col
            v-for="colItem in columnData"
            :key="'table_col_' + colItem.key"
            :width="colItem.width || averageWidth"
          />
        </colgroup>
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
  import { nextTick, onMounted, ref, watch } from "vue";
  import { TableProps } from "./table";

  defineOptions({
    name: "t-table",
  });

  const props = defineProps(TableProps);
  const tableRef = ref(null);
  const averageWidth = ref(0);

  const calcColumnWidth = () => {
    const tableWrapperWidth = tbodyWrapperRef.value.offsetWidth;
    const columnWidthArrs = props.columnData
      .filter((item) => item.width)
      .map((item) => item.width);
    const sumOfColumnWidth = columnWidthArrs.reduce((x, y) => x + parseInt(y));
    averageWidth.value =
      (tableWrapperWidth - sumOfColumnWidth) /
      (props.columnData.length - columnWidthArrs.length);
  };

  watch(
    props.columnData,
    () => {
      nextTick(() => {
        calcColumnWidth();
      });
    },
    {
      immediate: true,
    }
  );
</script>
```

```less
.t-table {
  color: var(--t-text-color);
  .t-table__thead-wrapper {
    border-bottom: 1px solid var(--t-border-color);
  }
  .t-table__thead,
  .t-table__tbody {
    width: 100%;
    border-spacing: 0;
    border-collapse: collapse;
  }
  .t-table__thead tr > th,
  .t-table__tbody tr > td {
    padding: 8px 0;
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

这样就可以了，但是有时候我们屏幕大小在变动，所以我们需要监听一下屏幕大小变化，重新计算一下

```js
onMounted(() => {
  window.addEventListener("resize", calcColumnWidth);
});

onUnmounted(() => {
  window.removeEventListener("resize", calcColumnWidth);
});
```

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
<table class="t-table__tbody">
  <colgroup>
    <col
      v-for="colItem in columnData"
      :key="'table_col_' + colItem.key"
      :width="colItem.width || averageWidth"
    />
  </colgroup>
  <tbody>
    <tr
      v-for="(rowItem, index) in tableData"
      :key="'table_row_' + index"
      :class="{
              't-table__tbody--stripe': stripe && index % 2 === 1,
            }"
    >
      <td v-for="(colItem, i) in columnData" :key="'table_col_' + i">
        <div class="cell">{{ rowItem[colItem.key] }}</div>
      </td>
    </tr>
  </tbody>
</table>
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
.t-table--border {
  border: 1px solid var(--t-border-color);
  .t-table__tbody tr:nth-last-child(1) {
    border: none;
  }
  .t-table__thead tr > th,
  .t-table__tbody tr > td {
    box-sizing: border-box;
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
    <colgroup>
      <col
        v-for="colItem in columnData"
        :key="'table_col_' + colItem.key"
        :width="colItem.width || averageWidth"
      />
    </colgroup>
    <tbody>
      <tr
        v-for="(rowItem, index) in tableData"
        :key="'table_row_' + index"
        :class="{
              't-table__tbody--stripe': stripe && index % 2 === 1,
            }"
      >
        <td v-for="(colItem, i) in columnData" :key="'table_col_' + i">
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
<!-- ... -->
<div class="t-table__tbody-wrapper">
  <table class="t-table__tbody">
    <colgroup>
      <col
        v-for="colItem in columnData"
        :key="'table_col_' + colItem.key"
        :width="colItem.width || averageWidth"
      />
    </colgroup>
    <tbody>
      <tr
        v-for="(rowItem, index) in tableData"
        :key="'table_row_' + index"
        :class="{
              't-table__tbody--stripe': stripe && index % 2 === 1,
            }"
      >
        <td v-for="(colItem, i) in columnData" :key="'table_col_' + i">
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
<!-- ... -->
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
    <!-- ... -->
  </table>
</div>
<!-- ... -->
```

我们来看看

```html
<t-table :column-data="columnData" :table-data="tableData" :height="260">
</t-table>
```

![](http://tuchuang.niubin.site/image/project-20250120-8.png)

感觉确实可以，但是其实是有问题的，我们这时候给固定表头的这个设置上 `border` 再来看一下

![](http://tuchuang.niubin.site/image/project-20250120-9.png)

这时候就会发现，表格的 body 部分和表头部分没有对齐，这是因为边框占据了 body 的宽度，导致内部的空间缩减，这时候有三种方式来解决这个问题：

1. 直接给表格的 body 部分的滚动条设置隐藏，这样就不会占据宽度了，但是我们看过去不知道当前的内容是不是还有，可以滚动，所以不推荐
2. 判断表格的 body 的高度是否比 body 中内容的总体高度还大，如果大的时候我们给 thead 部分的 `colgroup` 中设置一个 `col`，这个 `col` 必须和滚动条宽度一致，这样的话等于上下存在的空间都是相同的，这样也就不会出现设置边框的时候对不齐的情况了
3. 隐藏现有滚动条，手写一个滚动条，该滚动条为绝对定位，在表格的右侧，这样就可以保证滚动条不会占据表格的宽度，当然这种很麻烦，需要你计算位置、添加鼠标相关的事件等等，element-plus 就是采用该方案。

![](http://tuchuang.niubin.site/image/project-20250120-10.png)

我还是带大家想一下 element-plus 的 table 滚动条实现思路。

思路如下：

1. 先把滚动条隐藏
2. 然后创建一个 div 当做滚动条的轨道，然后在里面再创建一个 div 作为滚动条的滑块，滚动条设置绝对定位
3. 获取 tbody 视口的高度跟内容的高度作比较，如果比 tbody 的容器高度还大的时候表明要显示滚动条，否则隐藏滚动条
4. 手写拖动逻辑，鼠标在滑块上按下的时候记录，然后鼠标移动，上下移动了多少，滚动条的滑块移动多少，同时通过计算出内容需要滚动多少，公式为：`滚动条的 scrollTop/(tbody 视口高度 - 滚动条高度) = tbody 的 scrollTop/tbody 内容高度 - tbody 视口高度`
5. 当鼠标移入到 tbody 中的时候，监听鼠标滚动事件，每滚动一次，滚动条移动多少，然后根据上述的公式再计算内容需要滚动多少
6. 鼠标移入表格区域，如果表格需要滚动则出现滚动条，移开的时候隐藏

大家只要理解这个思路都是可以实现的，只是工作量较大，我们这边主要实现第二种方案。

### border 模式下固定表头实现

先判断当前 table 是否为可滚动的，并设置类名

```html
<template>
  <div
    :class="[
      't-table',
      border ? 't-table--border' : '',
      isOverflow ? 't-table__has_scroll' : '',
    ]"
    ref="tableRef"
  >
    <div class="t-table__thead-wrapper">
      <!-- ... -->
    </div>
    <div
      class="t-table__tbody-wrapper"
      :style="{
        height: height ? height + 'px' : 'auto',
        overflow: height ? 'auto' : 'hidden',
      }"
      ref="tbodyWrapperRef"
    >
      <table class="t-table__tbody">
        <colgroup>
          <col
            v-for="colItem in columnData"
            :key="'table_col_' + colItem.key"
            :width="colItem.width || averageWidth"
          />
        </colgroup>
        <tbody>
          <!-- ... -->
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, ref } from "vue";
  import { TableProps } from "./table";

  defineOptions({
    name: "t-table",
  });

  const props = defineProps(TableProps);
  const tbodyWrapperRef = ref(null);
  const isOverflow = ref(false);

  const calcColumnWidth = () => {
    const tableWrapperWidth = tbodyWrapperRef.value.offsetWidth;
    const tbodyWrapperHeight = tbodyWrapperRef.value.offsetHeight;
    const scrollHeight = tbodyWrapperRef.value.scrollHeight;
    isOverflow.value = scrollHeight > tbodyWrapperHeight;

    const columnWidthArrs = props.columnData
      .filter((item) => item.width)
      .map((item) => item.width);
    const sumOfColumnWidth = columnWidthArrs.reduce(
      (x, y) => parseInt(x) + parseInt(y)
    );

    // 这里我们-8是因为滚动条的宽度是8px我们需要减掉再平均
    averageWidth.value = isOverflow.value
      ? (tableWrapperWidth - sumOfColumnWidth - 8) /
        (props.columnData.length - columnWidthArrs.length)
      : (tableWrapperWidth - sumOfColumnWidth) /
        (props.columnData.length - columnWidthArrs.length);
  };
</script>
```

我们重新设置一下 `tbody` 部分滚动条样式

```less
.t-table__tbody-wrapper {
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar:horizontal {
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    border-left: 1px solid var(--t-border-color);
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ddd;
    border-radius: 4px;
  }
}
```

现在是这个样子

![](http://tuchuang.niubin.site/image/project-20250120-11.png)

然后我们在 `thead` 的 `colgroup` 中在可以滚动的情况下设置一个 `col`，并且宽度为 8px，与滚动条的宽度保持一致

```html
<template>
  <div
    :class="[
      't-table',
      border ? 't-table--border' : '',
      isOverflow ? 't-table__has_scroll' : '',
    ]"
    ref="tableRef"
  >
    <div class="t-table__thead-wrapper">
      <table class="t-table__thead">
        <colgroup>
          <col
            v-for="colItem in columnData"
            :key="'table_col_' + colItem.key"
            :width="colItem.width || averageWidth"
          />
          <col width="8" v-if="isOverflow" />
        </colgroup>
        <!-- ... -->
      </table>
    </div>
    <!-- ... -->
  </div>
</template>
```

再来看一下

![](http://tuchuang.niubin.site/image/project-20250120-12.png)

这时候我们去掉 border 属性看一下，结果又出现了两个问题，一个是滚动条的边框，一个是 thead 的下边框线比 tbody 的宽，我们再来处理一下

```less
.t-table {
  color: var(--t-text-color);
  .t-table__thead-wrapper {
    th {
      border-bottom: 1px solid var(--t-border-color);
    }
  }
  .t-table__thead,
  .t-table__tbody {
    width: 100%;
    border-spacing: 0;
    border-collapse: collapse;
  }
  .t-table__thead tr > th,
  .t-table__tbody tr > td {
    padding: 8px 0;
    text-align: left;
  }
  .t-table__tbody tr {
    border-bottom: 1px solid var(--t-border-color);
    &:hover {
      background-color: var(--t-hover-color);
    }
  }
  .t-table__tbody--stripe {
    background-color: #f8f8f8;
  }
  .cell {
    padding: 0 10px;
  }
}

.t-table--border {
  border: 1px solid var(--t-border-color);
  .t-table__thead-wrapper {
    th {
      border-bottom: none;
    }
  }
  .t-table__tbody tr:nth-last-child(1) {
    border: none;
  }
  .t-table__thead tr > th,
  .t-table__tbody tr > td {
    box-sizing: border-box;
    border-right: 1px solid var(--t-border-color);
  }
  .t-table__thead tr > th:nth-last-child(1),
  .t-table__tbody tr > td:nth-last-child(1) {
    border-right: none;
  }
  .t-table__tbody-wrapper::-webkit-scrollbar-track {
    border-left: 1px solid var(--t-border-color);
  }

  .t-table__tbody-wrapper {
    border-top: 1px solid var(--t-border-color);
  }
}

.t-table__tbody-wrapper {
  // 修改滚动条宽度
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar:horizontal {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ddd;
    border-radius: 4px;
  }
}
```

![](http://tuchuang.niubin.site/image/project-20250120-13.png)

丸美了

## 列对齐

有时候我们需要设置列的对齐方式，比如居中，靠左，靠右。我们可以在定义列的时候设置 `align` 属性来决定我们当前列的对齐方式，在不设置的时候我们默认为靠左。

```js
const columnData = [
  {
    key: "date",
    label: "Date",
    width: "120",
  },
  {
    key: "name",
    label: "Name",
    align: "center",
  },
  {
    key: "address",
    label: "Address",
  },
];
```

我们给 `cell` 添加一个 `text-align` 样式，然后根据 `align` 属性来决定它的值

```html
<template>
  <div
    :class="[
      't-table',
      border ? 't-table--border' : '',
      isOverflow ? 't-table__has_scroll' : '',
    ]"
    ref="tableRef"
  >
    <div class="t-table__thead-wrapper">
      <table class="t-table__thead">
        <colgroup>
          <col
            v-for="colItem in columnData"
            :key="'table_col_' + colItem.key"
            :width="colItem.width || averageWidth"
          />
          <col width="8" v-if="isOverflow" />
        </colgroup>
        <thead>
          <tr>
            <th v-for="theadItem in columnData" :key="theadItem.key">
              <div
                class="cell"
                :style="{
                  textAlign: theadItem.align || 'left',
                }"
              >
                {{ theadItem.label }}
              </div>
            </th>
          </tr>
        </thead>
      </table>
    </div>
    <div
      class="t-table__tbody-wrapper"
      :style="{
        height: height ? height + 'px' : 'auto',
        overflow: height ? 'auto' : 'hidden',
      }"
      ref="tbodyWrapperRef"
    >
      <table class="t-table__tbody">
        <colgroup>
          <col
            v-for="colItem in columnData"
            :key="'table_col_' + colItem.key"
            :width="colItem.width || averageWidth"
          />
        </colgroup>
        <tbody>
          <tr
            v-for="(rowItem, index) in tableData"
            :key="'table_row_' + index"
            :class="{
              't-table__tbody--stripe': stripe && index % 2 === 1,
            }"
          >
            <td v-for="(colItem, i) in columnData" :key="'table_col_' + i">
              <div
                class="cell"
                :style="{
                  textAlign: colItem.align || 'left',
                }"
              >
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
  </div>
</template>
```

![](http://tuchuang.niubin.site/image/project-20250120-14.png)

这时候看是没有问题的，但其实还是不行的，你们还记得我们上面的数据每个位置是一个插槽，也就意味着他可以放任何东西，不仅仅是文字，当如果是非行级元素呢？ 我们来试试

```html
<t-table :column-data="columnData2" :table-data="tableData" stripe border>
  <template #name="{ scoped, $index }">
    <div style="width: 50px; height: 20px; background-color: pink"></div>
  </template>
</t-table>
```

![](http://tuchuang.niubin.site/image/project-20250120-15.png)

这样就不行了，所以我们还得处理一下，我们只需要修改 tbody 部分就行

先来修改一下样式，让插槽改为 `flex` 盒子

```less
.t-table__tbody .cell {
  display: flex;
  flex-wrap: wrap;
}
```

因为 `justify-content` 接收的值跟 `text-align` 值不一样，所以我们需要做映射

```html
<template>
  <!-- .... -->
  <tbody>
    <tr
      v-for="(rowItem, index) in tableData"
      :key="'table_row_' + index"
      :class="{
              't-table__tbody--stripe': stripe && index % 2 === 1,
            }"
    >
      <td v-for="(colItem, i) in columnData" :key="'table_col_' + i">
        <div
          class="cell"
          :style="{
                  textAlign: colItem.align || 'left',
                  justifyContent: colItem.align
                    ? justifyContentMap[colItem.align]
                    : 'flex-start',
                }"
        >
          <slot :name="colItem.key" v-bind="{ scoped: rowItem, $index: index }">
            {{ rowItem[colItem.key] }}
          </slot>
        </div>
      </td>
    </tr>
  </tbody>
  <!-- ... -->
</template>
<script setup>
  const justifyContentMap = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
  };
</script>
```

这下好了

![](http://tuchuang.niubin.site/image/project-20250120-16.png)

## 固定列

在固定列之前我们先补充一个问题，那就是列的左右滚动，但是如果我们列特别多的时候我们上述写的默认是均分，那么每列的空间将会很小，这时候我们会设置每列的宽度，但是如果每列的宽度之和超出 table 原本的视口大小，我们又该怎么处理呢？

我们先来看看现象吧。

![](http://tuchuang.niubin.site/image/project-20250120-17.png)

即使设置列宽，但是每列宽度之和超出当前 table 所设的宽度大小时，它自动缩小了，但是这样显然是不行的，我们希望的是，当列宽之和超出当前 table 的宽度时，table 可以左右滚动，但是列宽不能缩小。那么我们该怎么处理呢？

我们可以给 table 设置 `table-layout: fixed;`

```less
.t-table__thead,
.t-table__tbody {
  width: 100%;
  border-spacing: 0;
  border-collapse: collapse;
  table-layout: fixed;
}
```

这时候每列就保持了他原有的宽度了，但是 `thead` 不能滚动，我们就需要给 `thead` 也设置滚动，我们上面定义了一个变量是 `isOverflow`，判断的是内容是否溢出，我们这边需要判断列是否溢出，所以我们重新修改一下变量名，把 isOverflow 替换成 `verticalOverflow` 垂直溢出,添加 `horizontalOverflow` 水平溢出。

之前我们是包裹的宽度-指定列宽之和，然后均分作为默认的宽度，这时候就有问题了，如果列宽之和比较大，算出的将会是负数，所以我们需要超出的时候给没有设置列宽的列给一个默认的宽度 `MIN_COLUMN_WIDTH`，这边设置为 120，当然，你也可以将改变量设置为属性供使用者自己配置超出后默认列的列宽。

```html
<template>
  <div
    :class="[
      't-table',
      border ? 't-table--border' : '',
      verticalOverflow ? 't-table__has_scroll' : '',
    ]"
    ref="tableRef"
  >
    <div
      class="t-table__thead-wrapper"
      :style="{
        overflow: horizontalOverflow ? 'auto' : 'hidden',
      }"
    >
      <table class="t-table__thead">
        <colgroup>
          <col
            v-for="colItem in columnData"
            :key="'table_col_' + colItem.key"
            :width="colItem.width || averageWidth"
          />
          <col width="8" v-if="verticalOverflow" />
        </colgroup>
        <thead>
          <tr>
            <th v-for="theadItem in columnData" :key="theadItem.key">
              <div
                class="cell"
                :style="{
                  textAlign: theadItem.align || 'left',
                }"
              >
                {{ theadItem.label }}
              </div>
            </th>
          </tr>
        </thead>
      </table>
    </div>
    <div
      class="t-table__tbody-wrapper"
      :style="{
        height: height ? height + 'px' : 'auto',
        overflow: height ? 'auto' : 'hidden',
      }"
      ref="tbodyWrapperRef"
    >
      <table class="t-table__tbody">
        <colgroup>
          <col
            v-for="colItem in columnData"
            :key="'table_col_' + colItem.key"
            :width="colItem.width || averageWidth"
          />
        </colgroup>
        <tbody>
          <tr
            v-for="(rowItem, index) in tableData"
            :key="'table_row_' + index"
            :class="{
              't-table__tbody--stripe': stripe && index % 2 === 1,
            }"
          >
            <td v-for="(colItem, i) in columnData" :key="'table_col_' + i">
              <div
                class="cell"
                :style="{
                  textAlign: colItem.align || 'left',
                  justifyContent: colItem.align
                    ? justifyContentMap[colItem.align]
                    : 'flex-start',
                }"
              >
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
  </div>
</template>

<script setup>
  import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
  import { TableProps } from "./table";

  defineOptions({
    name: "t-table",
  });

  const props = defineProps(TableProps);
  const tableRef = ref(null);
  const tbodyWrapperRef = ref(null);
  const verticalOverflow = ref(false);
  const horizontalOverflow = ref(false);
  const averageWidth = ref(0);
  const MIN_COLUMN_WIDTH = 120; // 自动分配的最小列宽
  const justifyContentMap = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
  };

  const calcColumnWidth = () => {
    const tableWrapperWidth = tbodyWrapperRef.value.offsetWidth;
    const tbodyWrapperHeight = tbodyWrapperRef.value.offsetHeight;
    const scrollHeight = tbodyWrapperRef.value.scrollHeight;
    verticalOverflow.value = scrollHeight > tbodyWrapperHeight;

    const columnWidthArrs = props.columnData
      .filter((item) => item.width)
      .map((item) => item.width);
    const sumOfColumnWidth = columnWidthArrs.reduce(
      (x, y) => parseInt(x) + parseInt(y)
    );

    if (
      sumOfColumnWidth +
        (props.columnData.length - columnWidthArrs.length) * MIN_COLUMN_WIDTH >
      tableWrapperWidth
    ) {
      horizontalOverflow.value = true;
      averageWidth.value = MIN_COLUMN_WIDTH;
    } else {
      horizontalOverflow.value = false;
      averageWidth.value = verticalOverflow.value
        ? (tableWrapperWidth - sumOfColumnWidth - 8) /
          (props.columnData.length - columnWidthArrs.length)
        : (tableWrapperWidth - sumOfColumnWidth) /
          (props.columnData.length - columnWidthArrs.length);
    }
  };

  // ...
</script>
```

![](http://tuchuang.niubin.site/image/project-20250120-18.png)

我们设置的是如果设置`指定列宽之和 + 其余列*最小列宽 MIN_COLUMN_WIDTH`，如果比包裹的宽度还大我们才给 `thead` 的包裹盒子设置 `overflow: auto`

接下来我们需要先把 thead 那部分的滚动条隐藏，然后给 tbody 部分的滚动添加监听，tbody 部分滚动的时候 thead 也滚动同样的距离。

```html
<template>
  <div
    :class="[
      't-table',
      border ? 't-table--border' : '',
      verticalOverflow ? 't-table__has_scroll' : '',
    ]"
    ref="tableRef"
  >
    <div
      class="t-table__thead-wrapper"
      ref="theadWrapperRef"
      :style="{
        overflow: horizontalOverflow ? 'auto' : 'hidden',
      }"
    >
      <!-- ... -->
    </div>
    <div
      class="t-table__tbody-wrapper"
      :style="{
        height: height ? height + 'px' : 'auto',
        overflow: height ? 'auto' : 'hidden',
      }"
      ref="tbodyWrapperRef"
    >
      <!-- ... -->
    </div>
  </div>
</template>

<script setup>
  const tableRef = ref(null);
  const theadWrapperRef = ref(null);
  const tbodyWrapperRef = ref(null);

  const listenScroll = (e) => {
    theadWrapperRef.value.scrollLeft = e.target.scrollLeft;
  };

  // ...

  onMounted(() => {
    window.addEventListener("resize", calcColumnWidth);
    tbodyWrapperRef.value?.addEventListener("scroll", listenScroll);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", calcColumnWidth);
    tbodyWrapperRef.value?.removeEventListener("scroll", listenScroll);
  });
</script>
```

![](http://tuchuang.niubin.site/image/project-20250120-19.png)

这时候其实还有问题，虽然我们鼠标不能 hover 在 `thead` 上水平滚动，但是如果你有触摸板，你用手双指左右滑动他还是可以滚动的，我们还要在给 `thead` 监听一下吗？其实没必要，直接把 `thead` 变为 `overflow: hidden` 就好了即使他隐藏了，但是只是溢出隐藏，他其实还是可以滚动的，也就是我们可以通过设置 `scrollleft` 来控制他的滚动。

所以哈哈哈哈我们刚才写的 `horizontalOverflow` 没有用到，大家不要为此感到走绕路，要一步步去想这个问题，走的绕路都是经验。

```html
<div
  class="t-table__thead-wrapper"
  ref="theadWrapperRef"
  style="overflow: hidden"
>
  <!-- ... -->
</div>
```
