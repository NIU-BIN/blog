---
category: project
cover: https://cdn.pixabay.com/photo/2023/12/16/00/06/mountain-8451604_640.jpg
---

# Pagination 组件开发

## 创建组件和样式文件

跟之前先创建如图所示的目录结构，然后我们在 `packages/components/components.js` 导出

![](http://tuchuang.niubin.site/image/project-20250114-1.png)

```js
export { TButton } from "./button";
export { TMessage } from "./message";
export { TTree } from "./tree";
export { TSteps } from "./steps";
export { TStep } from "./step";
export { TPagination } from "./pagination";
```

pagination 需要你传入的总数 total，还有每一个页的数量，这两个是必须的，然后通过这两个就可以得知你当前的数据需要多少页。

pagination.js

```js
export const PaginationProps = {
  total: {
    type: Number,
    default: 0,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
};
```

pagination.vue

```html
<template>
  <div class="t-pagination">
    <ul class="t-pagination-list">
      <li class="t-pagination-pre t-icon icon-arrow-left-bold t-pagination-item"></li>
      <li v-for="page in pageCount" :key="page" class="t-pagination-item">{{ page }}</li>
      <li class="t-pagination-next t-icon icon-arrow-right-bold t-pagination-item"></li>
    </ul>
  </div>
</template>

<script setup>
  import { PaginationProps } from "./pagination";
  import { computed } from "vue";

  defineOptions({
    name: "t-pagination",
  });

  const props = defineProps(PaginationProps);

  // 根据总数和每页数量计算出页数
  const pageCount = computed(() =>
    [...Array(Math.ceil(props.total / props.pageSize)).keys()].map((i) => i + 1)
  );
</script>
```

pagination.less

```less
@paginationHeight: 30px;
.t-pagination {
  .t-pagination-list {
    padding: 0;
    margin: 0;
    list-style: none;
    display: flex;
    align-items: center;
    align-items: center;
    .t-pagination-item {
      padding: 0;
      margin: 0;
      list-style: none;
      width: 28px;
      height: @paginationHeight;
      line-height: @paginationHeight;
      text-align: center;
      border-radius: 4px;
      cursor: pointer;
    }
  }
}
```

```html
<t-pagination :total="100" />
```

我们看一下效果

![](http://tuchuang.niubin.site/image/project-20250114-2.png)

## 分页展示

由于我们分页展示的时候，并不是所有的页码都会展示出来，所以我们需要根据当前页码和页数来展示页码，我们这里采用以下规则：

我们先设定显示按钮的最大个数为 7

- 如果页数小于 7，则展示所有页码
- 如果页数大于 7
  - 当前页码如果小于 4，则展示 1 2 3 4 5 6 ... 总页数
  - 当前页码在最后 4 个页码内，则展示 1 ... 总页数-5 总页数-4 总页数-3 总页数-2 总页数-1 总页数

举个例子：

1. 如果有 8 页，当前页面是 4，则显示
   1 2 3 4 5 6 ... 8

2. 如果当前页面是 5，则显示
   1 ... 3 4 5 6 7 8

3. 如果有 20 页，当前页面是 10，则显示
   1 ... 8 9 10 11 12 ... 20

那我们可以将页码分为三部分，首页，尾页，中间页，中间页最多只有 5 页，省略显示遵循上述规则。

思路已经清楚了，我们就来实现一下

```html
<template>
  <div class="t-pagination">
    <ul class="t-pagination-list">
      <li class="t-pagination-pre t-icon icon-arrow-left-bold t-pagination-item"></li>
      <li class="t-pagination-item">{{ firstPage }}</li>
      <li class="t-pagination-item t-icon icon-elipsis" v-if="showFrontEllipsis"></li>
      <li
        v-for="page in centerPages"
        :key="page"
        class="t-pagination-item"
        :class="{ 't-pagination-item__active': page === currentPage }"
        @click="currentPage = page"
      >
        {{ page }}
      </li>
      <li class="t-pagination-item t-icon icon-elipsis" v-if="showEndEllipsis"></li>
      <li class="t-pagination-item">{{ lastPage }}</li>
      <li class="t-pagination-next t-icon icon-arrow-right-bold t-pagination-item"></li>
    </ul>
  </div>
</template>

<script setup>
  import { PaginationProps } from "./pagination";
  import { computed, ref } from "vue";

  defineOptions({
    name: "t-pagination",
  });

  const props = defineProps(PaginationProps);

  // 根据总数和每页数量计算出页数
  const pageCount = computed(() =>
    [...Array(Math.ceil(props.total / props.pageSize)).keys()].map((i) => i + 1)
  );
  const currentPage = ref(5); // 当前页面
  const showFrontEllipsis = ref(false); // 是否显示前面的省略号
  const showEndEllipsis = ref(false); // 是否显示后面的省略号

  const firstPage = 1; // 第一页
  const lastPage = computed(() => pageCount.value.length); // 最后一页

  // 中间的页码
  const centerPages = computed(() => {
    const center = pageCount.value.slice(1, pageCount.value.length - 1);
    if (pageCount.value.length > 7) {
      if (center.indexOf(currentPage.value) < 3) {
        showFrontEllipsis.value = false;
        showEndEllipsis.value = true;
        return center.slice(0, 5);
      } else if (center.indexOf(currentPage.value) > center.length - 4) {
        showFrontEllipsis.value = true;
        showEndEllipsis.value = false;
        return center.slice(-5);
      } else {
        showFrontEllipsis.value = true;
        showEndEllipsis.value = true;
        const center = [
          currentPage.value - 2,
          currentPage.value - 1,
          currentPage.value,
          currentPage.value + 1,
          currentPage.value + 2,
        ];
        return center;
      }
    } else {
      return center;
    }
  });
</script>
```

![](http://tuchuang.niubin.site/image/project-20250114-3.png)

没有问题，我们将 currentPage 的值改为双向绑定的，并且切换页面的时候发出一个事件
