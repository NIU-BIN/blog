---
category: project
cover: https://cdn.pixabay.com/photo/2025/05/24/23/16/fallow-9620489_1280.jpg
---

# Row & Col 布局组件开发

我们的布局一般分为行组件和列组件，所以我们需要创建两个组件，分别是 `Row` 行组件 和 `Col` 列组件，并且通过基础的 24 分栏，迅速简便地创建布局。

我们创建如图所示的结构，开始我们的组件开发。

![](http://tuchuang.niubin.site/image/project-20250221-1.png)

## Row 组件和 Col 组件

Row 组件是是行组件，我们里面一般放入我们的 Col 列组件，所以我们需要一个插槽。

```html
<template>
  <div class="t-row">
    <slot></slot>
  </div>
</template>
<script setup>
  defineOptions({
    name: "t-row",
  });
</script>
```

Col 组件是列组件，我们通过 `span` 属性来设置列的宽度。

```js
export const ColProps = {
  span: {
    type: Number,
    default: 24,
  },
};
```

```html
<template>
  <div class="t-col">
    <slot></slot>
  </div>
</template>
<script setup>
  import { ColProps } from "./col";

  defineOptions({
    name: "t-col",
  });

  const props = defineProps(ColProps);
</script>
```

我们这样使用，代表着我们一行中有四部分，每部分是占据 6 个格子。

```html
<t-row>
  <t-col :span="6">
    <div class="grid-content ep-bg-purple" />
  </t-col>
  <t-col :span="6">
    <div class="grid-content ep-bg-purple-light" />
  </t-col>
  <t-col :span="6">
    <div class="grid-content ep-bg-purple" />
  </t-col>
  <t-col :span="6">
    <div class="grid-content ep-bg-purple-light" />
  </t-col>
</t-row>
```

首先我们需要将 `row` 设置为 `flex` 布局，并且设置 `flex-wrap` 为 `wrap`，这样就可以让我们的列组件超出的时候换行。

```less
.t-row {
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
}
```

接下来我们本节的难点来了，如何根据 `span` 属性来设置列的宽度呢？

我们来看看 element-plus 是怎么做的。

![](http://tuchuang.niubin.site/image/project-20250221-2.png)

当 `span` 传递是 8 的时候，他的类名是`.el-col-8`，是 6 的时候他的类名是`.el-col-6`，也就是说他是设置了 24 个不同类名，设置了不同的宽度，但是我们真的要写 24 个类的样式吗？不是，那怎么实现呢？我们用的是 less，他也是非常强大的，给我们提供了一些函数，我们可以了解一下。

[less 中的 each 函数](https://lesscss.org/functions/#list-functions-each)

each 函数接受两个参数，第一个是列表，第二个是匿名规则集，列表是用逗号或者空格分隔的值列表。算了还是写个示例我们看看：

```less
@list: 1, 2, 3, 4, 5;

each(@list, {
  .item-@{value} {
    width: (@value * 10)%;
    height: 30px;
  }
})
```

我们写一个 `item-3` 的类看看

![](http://tuchuang.niubin.site/image/project-20250221-3.png)

他们帮我们生成一个类的样式

```css
.item-3 {
  width: calc(3 * 10%);
  height: 30px;
}
```

我们懂这个函数的用法那接下来就好办了。我们先给设置动态类名：

```html
<template>
  <div :class="`t-col t-col-${span}`">
    <slot></slot>
  </div>
</template>
```

```less
@span: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24;

.t-col {
  box-sizing: border-box;
}

each(@span, {
  .t-col-@{value} {
    max-width: calc(@value / 24 * 100%);
    flex: calc(@value / 24 * 100);
  }
});
```

我们多些几种测试一下

```html
<template>
  <t-row>
    <t-col :span="24">
      <div class="grid-content ep-bg-purple-dark" />
    </t-col>
  </t-row>
  <t-row>
    <t-col :span="12">
      <div class="grid-content ep-bg-purple" />
    </t-col>
    <t-col :span="12">
      <div class="grid-content ep-bg-purple-light" />
    </t-col>
  </t-row>
  <t-row>
    <t-col :span="8">
      <div class="grid-content ep-bg-purple" />
    </t-col>
    <t-col :span="8">
      <div class="grid-content ep-bg-purple-light" />
    </t-col>
    <t-col :span="8">
      <div class="grid-content ep-bg-purple" />
    </t-col>
  </t-row>
  <t-row>
    <t-col :span="6">
      <div class="grid-content ep-bg-purple" />
    </t-col>
    <t-col :span="6">
      <div class="grid-content ep-bg-purple-light" />
    </t-col>
    <t-col :span="6">
      <div class="grid-content ep-bg-purple" />
    </t-col>
    <t-col :span="6">
      <div class="grid-content ep-bg-purple-light" />
    </t-col>
  </t-row>
  <t-row>
    <t-col :span="4">
      <div class="grid-content ep-bg-purple" />
    </t-col>
    <t-col :span="4">
      <div class="grid-content ep-bg-purple-light" />
    </t-col>
    <t-col :span="4">
      <div class="grid-content ep-bg-purple" />
    </t-col>
    <t-col :span="4">
      <div class="grid-content ep-bg-purple-light" />
    </t-col>
    <t-col :span="4">
      <div class="grid-content ep-bg-purple" />
    </t-col>
    <t-col :span="4">
      <div class="grid-content ep-bg-purple-light" />
    </t-col>
  </t-row>
</template>
<style>
  .t-row {
    margin-bottom: 20px;
  }
  .t-row:last-child {
    margin-bottom: 0;
  }
  .t-col {
    border-radius: 4px;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .ep-bg-purple-dark {
    background-color: #99a9bf;
  }
  .ep-bg-purple {
    background-color: #d3dce6;
  }
  .ep-bg-purple-light {
    background-color: #e5e9f2;
  }
</style>
```

![](http://tuchuang.niubin.site/image/project-20250221-4.png)

丸美

## 分栏间隔

我们可以设置 `gutter` 属性，来设置列之间的间距。

```js
export const RowProps = {
  gutter: {
    type: Number,
    default: 0,
  },
};
```

只需要设置 `gap` 即可

```html
<template>
  <div
    class="t-row"
    :style="{
      gap: gutter ? `${gutter}px` : 0,
    }"
  >
    <slot></slot>
  </div>
</template>
```

我们写一个示例看看效果

```html
<t-row :gutter="16">
  <t-col :span="4">
    <div class="grid-content ep-bg-purple" />
  </t-col>
  <t-col :span="6">
    <div class="grid-content ep-bg-purple-light" />
  </t-col>
  <t-col :span="10">
    <div class="grid-content ep-bg-purple" />
  </t-col>
  <t-col :span="2">
    <div class="grid-content ep-bg-purple-light" />
  </t-col>
  <t-col :span="2">
    <div class="grid-content ep-bg-purple" />
  </t-col>
</t-row>
```

![](http://tuchuang.niubin.site/image/project-20250221-5.png)

## 列偏移

我们可以配置一个 `offset` 属性，来设置列的偏移量，他的值必须和 `span` 保持一致，所以我们这块可以加上校验。

```js
const SPAN_VALUES = [...Array(24).keys(), 24];

export const ColProps = {
  span: {
    type: Number,
    default: 24,
    validator(value) {
      return SPAN_VALUES.includes(value);
    },
  },
  offset: {
    type: Number,
    default: 0,
    validator(value) {
      return SPAN_VALUES.includes(value);
    },
  },
};
```

那怎么设置偏移的样式呢？跟我们的 `span` 也是一样的道理。我们修改一下这边的写法

```html
<template>
  <div
    :class="[
      't-col',
      span && `t-col-${span}`,
      offset && `t-col-offset-${offset}`,
    ]"
  >
    <slot></slot>
  </div>
</template>
<script setup>
  import { ColProps } from "./col";

  defineOptions({
    name: "t-col",
  });

  const props = defineProps(ColProps);
</script>
```

```less
each(@span, {
  .t-col-offset-@{value} {
    margin-left: calc(@value / 24 * 100%);
  }
});
```

![](http://tuchuang.niubin.site/image/project-20250221-6.png)

这时候发现其实是有问题的，因为 `gap` 只给以存在的 `col` 与 `col` 之间设置了，这样按照 24 个 `span` 分出来主要存在我偏移了 6 个 `span`，然后我配置一个 18 个 `span`，下来其实少了一个 `gutter`，所以我们不能通过 `gap` 设置了，那我们怎么处理呢？

我看了一下 element-plus 的方案，他是给每一个 `col` 设置一个左右的 `padding` 各为 `gap` 的一半，然后这样的话总体加起来左右会各多出一半的 `gap`，然后在 `row` 上再给左右各设置一个负的 `margin`，且也为 `gap` 的一半，这样就可以把多出来的 `padding` 给抵消掉，但是其实是有问题的，我尝试将 element-plus 的 gutter 间隔设置大一些的时候发现可以左右滚动了，但是造成滚动的主要是右侧的` margin`，这样的话我们可以再包裹一层，然后在最外面直接设置一个 `overflow: hidden`，这样就可以解决了。

![](http://tuchuang.niubin.site/image/project-20250221-7.png)

row.vue

```html
<div
  class="t-row"
  :style="{
        marginLeft: gutter ? -gutter / 2 + 'px' : 0,
        marginRight: gutter ? -gutter / 2 + 'px' : 0,
      }"
>
  <slot></slot>
</div>

<script setup>
  // ...
  const props = defineProps(RowProps);

  provide("gutter", props.gutter);
</script>
```

将 `gutter` 提供注入给 `col`

```html
<template>
  <div
    :class="[
      't-col',
      span && `t-col-${span}`,
      offset && `t-col-offset-${offset}`,
    ]"
    :style="{
      paddingLeft: gutter ? gutter / 2 + 'px' : '0',
      paddingRight: gutter ? gutter / 2 + 'px' : '0',
    }"
  >
    <slot></slot>
  </div>
</template>
<script setup>
  import { ColProps } from "./col";
  import { inject } from "vue";

  defineOptions({
    name: "t-col",
  });

  const props = defineProps(ColProps);

  const gutter = inject("gutter");
</script>
```

现在我们如果 gutter 设置大的时候你就会发现可以左右滚动了，这时候我们修改一下 row 的结构，再加一层，然后设置 `overflow: hidden`

```html
<template>
  <div class="t-row">
    <div
      class="t-row__wapper"
      :style="{
        marginLeft: gutter ? -gutter / 2 + 'px' : 0,
        marginRight: gutter ? -gutter / 2 + 'px' : 0,
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>
<script setup>
  import { provide } from "vue";
  import { RowProps } from "./row";

  defineOptions({
    name: "t-row",
  });

  const props = defineProps(RowProps);

  provide("gutter", props.gutter);
</script>
```

```less
.t-row {
  overflow: hidden;
}
.t-row__wapper {
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  position: relative;
}
```

我们写一个示例来看看效果

```html
<t-row :gutter="20">
  <t-col :span="6"><div class="grid-content ep-bg-purple" /></t-col>
  <t-col :span="6" :offset="6">
    <div class="grid-content ep-bg-purple" />
  </t-col>
</t-row>
<t-row :gutter="20">
  <t-col :span="6" :offset="6">
    <div class="grid-content ep-bg-purple" />
  </t-col>
  <t-col :span="6" :offset="6">
    <div class="grid-content ep-bg-purple" />
  </t-col>
</t-row>
<t-row :gutter="20">
  <t-col :span="12" :offset="6">
    <div class="grid-content ep-bg-purple" />
  </t-col>
</t-row>
```

![](http://tuchuang.niubin.site/image/project-20250221-8.png)

## 对齐方式

这个功能很简单，我们再给 row 添加一个 `justify` 属性，用来设置水平对齐方式，跟 `flex` 对齐一致

row.js

```js
const ROW_JUSTIFY = ["start", "end", "center", "space-around", "space-between"];

export const RowProps = {
  gutter: {
    type: Number,
    default: 0,
  },
  justify: {
    type: String,
    default: "start",
    validator: (value) => {
      return ROW_JUSTIFY.includes(value);
    },
  },
};
```

row.vue

```html
<template>
  <div class="t-row">
    <div
      class="t-row__wapper"
      :style="{
        marginLeft: gutter ? -gutter / 2 + 'px' : 0,
        marginRight: gutter ? -gutter / 2 + 'px' : 0,
        justifyContent: justify,
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>
```

写一下示例看看效果

```html
<t-row class="row-bg">
  <t-col :span="6"><div class="grid-content ep-bg-purple" /></t-col>
  <t-col :span="6"><div class="grid-content ep-bg-purple-light" /></t-col>
  <t-col :span="6"><div class="grid-content ep-bg-purple" /></t-col>
</t-row>
<t-row class="row-bg" justify="center">
  <t-col :span="6"><div class="grid-content ep-bg-purple" /></t-col>
  <t-col :span="6"><div class="grid-content ep-bg-purple-light" /></t-col>
  <t-col :span="6"><div class="grid-content ep-bg-purple" /></t-col>
</t-row>
<t-row class="row-bg" justify="end">
  <t-col :span="6"><div class="grid-content ep-bg-purple" /></t-col>
  <t-col :span="6"><div class="grid-content ep-bg-purple-light" /></t-col>
  <t-col :span="6"><div class="grid-content ep-bg-purple" /></t-col>
</t-row>
<t-row class="row-bg" justify="space-between">
  <t-col :span="6"><div class="grid-content ep-bg-purple" /></t-col>
  <t-col :span="6"><div class="grid-content ep-bg-purple-light" /></t-col>
  <t-col :span="6"><div class="grid-content ep-bg-purple" /></t-col>
</t-row>
<t-row class="row-bg" justify="space-around">
  <t-col :span="6"><div class="grid-content ep-bg-purple" /></t-col>
  <t-col :span="6"><div class="grid-content ep-bg-purple-light" /></t-col>
  <t-col :span="6"><div class="grid-content ep-bg-purple" /></t-col>
</t-row>
<t-row class="row-bg" justify="space-evenly">
  <t-col :span="6"><div class="grid-content ep-bg-purple" /></t-col>
  <t-col :span="6"><div class="grid-content ep-bg-purple-light" /></t-col>
  <t-col :span="6"><div class="grid-content ep-bg-purple" /></t-col>
</t-row>
```

![](http://tuchuang.niubin.site/image/project-20250221-9.png)
