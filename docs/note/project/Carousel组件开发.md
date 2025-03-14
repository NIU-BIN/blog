---
category: project
cover: https://cdn.pixabay.com/photo/2023/12/16/00/06/mountain-8451604_640.jpg
---

# Carousel 组件开发

![](http://tuchuang.niubin.site/image/project-20250310-1.png)

carousel.js

```js
export const CarouselProps = {
  height: {
    type: String,
    default: "300px",
  },
};
```

carousel.vue

```html
<template>
  <div class="t-carousel" :style="{ height: props.height }">
    <slot></slot>
  </div>
</template>
<script setup>
  import { CarouselProps } from "./carousel";

  defineOptions({
    name: "t-carousel",
  });

  const props = defineProps(CarouselProps);
</script>
```

carousel-item.vue

```html
<template>
  <div class="t-carousel-item"></div>
</template>
<script setup>
  defineOptions({
    name: "t-carousel-item",
  });
</script>
```

carousel-item.less

```css
.t-carousel-item {
  height: 100%;
}
```

过渡时间结束后，将 active 的前一个元素先设置 z-index -1，然后放到最后，为 `(arr.length - active - 1)*width` 的位置，然后 nextTick 将 z-index 设置为 1
