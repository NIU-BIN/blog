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
    .t-pagination-item:hover {
      color: var(--t-primary);
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
      <li
        class="t-pagination-item"
        :class="{ 't-pagination-item__active': firstPage === currentPage }"
        @click="handleChangeCurrentPage(firstPage)"
      >
        {{ firstPage }}
      </li>
      <li class="t-pagination-item t-icon icon-elipsis" v-if="showFrontEllipsis"></li>
      <li
        v-for="page in centerPages"
        :key="page"
        class="t-pagination-item"
        :class="{ 't-pagination-item__active': page === currentPage }"
        @click="handleChangeCurrentPage(page)"
      >
        {{ page }}
      </li>
      <li class="t-pagination-item t-icon icon-elipsis" v-if="showEndEllipsis"></li>
      <li
        class="t-pagination-item"
        :class="{ 't-pagination-item__active': lastPage === currentPage }"
        @click="handleChangeCurrentPage(lastPage)"
      >
        {{ lastPage }}
      </li>
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
      if (currentPage.value === 1) {
        showFrontEllipsis.value = false;
        showEndEllipsis.value = true;
        return center.slice(0, 5);
      } else if (currentPage.value === lastPage.value) {
        showFrontEllipsis.value = true;
        showEndEllipsis.value = false;
        return center.slice(-5);
      } else if (center.indexOf(currentPage.value) < 3) {
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

  const handleChangeCurrentPage = (page) => {
    currentPage.value = page;
  };
</script>
```

pagination.less

```less
.t-pagination {
  // ...
  .t-pagination-item__active {
    font-weight: bold;
    color: var(--t-primary);
  }
}
```

![](http://tuchuang.niubin.site/image/project-20250114-3.png)

没有问题，我们将 currentPage 的值改为双向绑定的，并且切换页码的时候发出一个事件

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
  currentPage: {
    type: Number,
    default: 1,
  },
};

export const PaginationEmits = ["update:current-page", "current-change"];
```

我们将组件内部定义的 `currentPage` 变量删除，然后改为从 `props` 中获取，且点击页面的时候发出事件

```js
const handleChangeCurrentPage = (page) => {
  emit("update:current-page", page);
};
```

这下我们就可以这么使用了

```html
<t-pagination :total="100" v-model:current-page="currentPage" />
```

## 页码交互

上面我们实现的功能虽然满足基本使用，但是页码特别多的时候我们想找到我们想要的页码就会操作特变慢，这时候有两个方案：

1. 鼠标移入 ... 按钮的时候变为快进快退按钮，点击的时候可以快速跳转，每次最多跳 5 页
2. 可以画一个输入框，让用户直接输入页码，然后回车跳转

### 页码快速前进后退

我们先来实现第一种方案。

首先，我们需要将我们的 ... 按钮要设置一个交互，左边的省略按钮鼠标 hover 的时候显示后退的 icon，后面的省略按钮 hover 的时候显示前进的 icon。我们可以将 icon 的名称设置为变量，然后通过鼠标的移入和移出事件来控制显示什么图标。

```html
<template>
  <div class="t-pagination">
    <ul class="t-pagination-list">
      <li class="t-pagination-pre t-icon icon-arrow-left-bold t-pagination-item"></li>
      <li
        class="t-pagination-item"
        :class="{ 't-pagination-item__active': firstPage === currentPage }"
      >
        {{ firstPage }}
      </li>
      <li
        :class="`t-pagination-item t-icon ${frontIcon}`"
        v-if="showFrontEllipsis"
        @mouseenter="handleMouseOver('left')"
        @mouseleave="handleMouseLeave('left')"
      ></li>
      <li
        v-for="page in centerPages"
        :key="page"
        class="t-pagination-item"
        :class="{ 't-pagination-item__active': page === currentPage }"
        @click="handleChangeCurrentPage(page)"
      >
        {{ page }}
      </li>
      <li
        :class="`t-pagination-item t-icon ${endIcon}`"
        v-if="showEndEllipsis"
        @mouseenter="handleMouseOver('right')"
        @mouseleave="handleMouseLeave('right')"
      ></li>
      <li
        class="t-pagination-item"
        :class="{ 't-pagination-item__active': lastPage === currentPage }"
      >
        {{ lastPage }}
      </li>
      <li class="t-pagination-next t-icon icon-arrow-right-bold t-pagination-item"></li>
    </ul>
  </div>
</template>

<script setup>
  // ...

  const frontIcon = ref("icon-elipsis");
  const endIcon = ref("icon-elipsis");

  const handleMouseOver = (direction) => {
    if (direction === "left") {
      frontIcon.value = "icon-arrow-double-left";
    } else {
      endIcon.value = "icon-arrow-double-right";
    }
  };

  const handleMouseLeave = (direction) => {
    if (direction === "left") {
      frontIcon.value = "icon-elipsis";
    } else {
      endIcon.value = "icon-elipsis";
    }
  };
</script>
```

![](http://tuchuang.niubin.site/image/project-20250114-4.png)

接下来我们要实现点击的时候可以快速跳转，每次最多跳 5 页。

```html
<template>
  <!-- ... -->
  <li
    :class="`t-pagination-item t-icon ${frontIcon}`"
    v-if="showFrontEllipsis"
    @mouseenter="handleMouseOver('left')"
    @mouseleave="handleMouseLeave('left')"
    @click="handlePageGo('retreat')"
  ></li>
  <!-- ... -->
  <li
    :class="`t-pagination-item t-icon ${endIcon}`"
    v-if="showEndEllipsis"
    @mouseenter="handleMouseOver('right')"
    @mouseleave="handleMouseLeave('right')"
    @click="handlePageGo('forward')"
  ></li>
  <!-- ... -->
</template>

<script setup>
  // ..
  const frontIcon = ref("icon-elipsis");
  const endIcon = ref("icon-elipsis");

  // 中间的页码
  const centerPages = computed(() => {
    const center = pageCount.value.slice(1, pageCount.value.length - 1);
    if (pageCount.value.length > 7) {
      if (props.currentPage === 1) {
        showFrontEllipsis.value = false;
        showEndEllipsis.value = true;
        frontIcon.value = "icon-elipsis";
        return center.slice(0, 5);
      } else if (props.currentPage === lastPage.value) {
        showFrontEllipsis.value = true;
        showEndEllipsis.value = false;
        endIcon.value = "icon-elipsis";
        return center.slice(-5);
      } else if (center.indexOf(props.currentPage) < 3) {
        showFrontEllipsis.value = false;
        showEndEllipsis.value = true;
        frontIcon.value = "icon-elipsis";
        return center.slice(0, 5);
      } else if (center.indexOf(props.currentPage) > center.length - 4) {
        showFrontEllipsis.value = true;
        showEndEllipsis.value = false;
        endIcon.value = "icon-elipsis";
        return center.slice(-5);
      } else {
        showFrontEllipsis.value = true;
        showEndEllipsis.value = true;
        const center = [
          props.currentPage - 2,
          props.currentPage - 1,
          props.currentPage,
          props.currentPage + 1,
          props.currentPage + 2,
        ];
        return center;
      }
    } else {
      return center;
    }
  });

  const handleMouseOver = (direction) => {
    if (direction === "left") {
      frontIcon.value = "icon-arrow-double-left";
    } else {
      endIcon.value = "icon-arrow-double-right";
    }
  };

  const handleMouseLeave = (direction) => {
    if (direction === "left") {
      frontIcon.value = "icon-elipsis";
    } else {
      endIcon.value = "icon-elipsis";
    }
  };

  const handlePageGo = (direction) => {
    if (direction === "forward") {
      emit(
        "update:current-page",
        props.currentPage + 5 > lastPage.value ? lastPage.value : props.currentPage + 5
      );
    } else {
      emit(
        "update:current-page",
        props.currentPage - 5 < firstPage ? firstPage : props.currentPage - 5
      );
    }
  };
</script>
```

> ✨ 注意上面的 `centerPages` 我加了一些图标名称的控制，因为在控制显示隐藏的时候会触发不到 `mouseleave` 时间，所有我们需要手动给重置一下图标

### 页码左右切换

这下这个快速切换功能我们也实现了，我们发现左右的切换按钮没有完成，接下来我们先完善一下两边的切换交互，这个交互规则很简单：

1. 点击左边的向左 < 的按钮，当前页面倒退一页
2. 点击右边的向右 > 的按钮，当前页面前进一页
3. 若当前页面为首页，则向左 < 的按钮置灰且 hover 显示禁用
4. 若当前页面为最后一页，则向右 > 的按钮置灰且 hover 显示禁用

前进和后退我们直接复用一下 handlePageGo 方法，我们稍微修改一下

```js
const handlePageGo = (direction, num) => {
  if (
    (direction === "forward" && props.currentPage === lastPage.value) ||
    (direction === "backward" && props.currentPage === firstPage)
  )
    return;
  if (direction === "forward") {
    emit(
      "update:current-page",
      props.currentPage + num > lastPage.value ? lastPage.value : props.currentPage + num
    );
  } else {
    emit(
      "update:current-page",
      props.currentPage - num < firstPage ? firstPage : props.currentPage - num
    );
  }
};
```

然后我们就可以直接使用了

```html
<template>
  <div class="t-pagination">
    <ul class="t-pagination-list">
      <li
        class="t-pagination-pre t-icon icon-arrow-left-bold t-pagination-item"
        @click="handlePageGo('retreat', 1)"
      ></li>
      <li
        class="t-pagination-item"
        :class="{ 't-pagination-item__active': firstPage === currentPage }"
        @click="handleChangeCurrentPage(firstPage)"
      >
        {{ firstPage }}
      </li>
      <li
        :class="`t-pagination-item t-icon ${frontIcon}`"
        v-if="showFrontEllipsis"
        @mouseenter="handleMouseOver('left')"
        @mouseleave="handleMouseLeave('left')"
        @click="handlePageGo('retreat', 5)"
      ></li>
      <li
        v-for="page in centerPages"
        :key="page"
        class="t-pagination-item"
        :class="{ 't-pagination-item__active': page === currentPage }"
        @click="handleChangeCurrentPage(page)"
      >
        {{ page }}
      </li>
      <li
        :class="`t-pagination-item t-icon ${endIcon}`"
        v-if="showEndEllipsis"
        @mouseenter="handleMouseOver('right')"
        @mouseleave="handleMouseLeave('right')"
        @click="handlePageGo('forward', 5)"
      ></li>
      <li
        class="t-pagination-item"
        :class="{ 't-pagination-item__active': lastPage === currentPage }"
        @click="handleChangeCurrentPage(lastPage)"
      >
        {{ lastPage }}
      </li>
      <li
        class="t-pagination-next t-icon icon-arrow-right-bold t-pagination-item"
        @click="handlePageGo('forward', 1)"
      ></li>
    </ul>
  </div>
</template>
```

接下来是样式

```html
<!-- ... -->
<li
  class="t-pagination-pre t-icon icon-arrow-left-bold t-pagination-item"
  :style="{
          cursor: firstPage === currentPage ? 'not-allowed' : 'pointer',
          color: firstPage === currentPage ? '#ccc' : null,
        }"
  @click="handlePageGo('retreat', 1)"
></li>
<!-- ... -->
<li
  class="t-pagination-next t-icon icon-arrow-right-bold t-pagination-item"
  :style="{
          cursor: lastPage === currentPage ? 'not-allowed' : 'pointer',
          color: lastPage === currentPage ? '#ccc' : null,
        }"
  @click="handlePageGo('forward', 1)"
></li>
<!-- ... -->
```

![](http://tuchuang.niubin.site/image/project-20250114-5.png)

### 页码直达

好了，接下来我们来做直接切换到用户所要到达的页码，只需要画一个输入框，然后做一个回车事件即可

```html
<div class="t-pagination">
  <!-- ... -->
  <div class="t-pagination__jump">
    <span>跳转至</span>
    <input type="number" v-model="goToNum" class="t-pagination__editor" />
  </div>
</div>
```

```less
@paginationHeight: 30px;
.t-pagination {
  // ...
  .t-pagination__jump {
    display: flex;
    align-items: center;
    gap: 8px;
    .t-pagination__editor {
      padding: 0 6px;
      width: 42px;
      height: @paginationHeight;
      border-radius: 4px;
      border: 1px solid var(--t-border-color);
      font-size: 14px;
      color: var(--t-text-color);
    }
    input[type="number"] {
      -moz-appearance: textfield;
    }
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
}
```

![](http://tuchuang.niubin.site/image/project-20250114-6.png)

```html
<template>
  <div class="t-pagination">
    <!-- ... -->
    <div class="t-pagination__jump">
      <span>跳转至</span>
      <input
        type="number"
        v-model="goToNum"
        class="t-pagination__editor"
        @keydown.enter="handleGoToPage"
      />
    </div>
  </div>
</template>

<script setup>
  // ...
  const goToNum = ref(null);

  const handleGoToPage = () => {
    if (goToNum.value) {
      const targetPageNum =
        goToNum.value < 0 ? 1 : goToNum.value > lastPage.value ? lastPage.value : goToNum.value;
      goToNum.value = targetPageNum;
      emit("update:current-page", targetPageNum);
    }
  };
</script>
```

我们设置一个属性 `showJump` 来控制是否显示跳转功能

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
  currentPage: {
    type: Number,
    default: 1,
  },
  showJump: {
    type: Boolean,
    default: false,
  },
};

export const PaginationEmits = ["update:current-page", "current-change"];
```
